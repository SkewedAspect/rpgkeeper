# RPGKeeper Development Guidelines

## Project Overview

**RPGKeeper** - A universal digital character sheet manager for TTRPGs

This project has been in development for over a decade across multiple major versions. The current version (v3) is a ground-up rewrite with the goal of finally supporting all the RPG systems and characters from previous versions. Expect some legacy cruft and historical design decisions.

- **@rpgk/server** - Node.js/Express 5 backend
- **@rpgk/client** - Vue 3/Vite/Bootstrap frontend
- **@rpgk/core** - Core domain models and types
- **@rpgk/systems** - RPG system definitions and Vue components
- Monorepo with npm workspaces

## Commands

```bash
npm install              # Install all dependencies
npm run build            # Build frontend with Vite
npm run dev              # Start dev server (DEBUG=true)
npm start                # Start production server
npm run lint             # Lint all code
npm run lint:types       # TypeScript type checking (tsgo)
npm run lint:types:vue   # Vue TypeScript checking (vue-tsc)
npm run db:migrate       # Run database migrations
npm run db:setup         # Run migrations and seeds
npm test                 # Run tests
```

## Code Style

### File Naming

- **All files use camelCase**: `userProfile.ts`, `authManager.ts`, `appHeader.vue`
- Vue components are also camelCase: `mainLayout.vue`, not `MainLayout.vue`

### Indentation & Formatting

- **4-space indentation**
- **120 character line limit**
- **Allman brace style** with single-line allowance:

```typescript
function example()
{
    if(condition)
    {
        // code
    }
}

// Single-line allowed
if(simple) { return true; }
```

### Comment Breaks

Use dashes filling to 120 characters to separate file sections:

```typescript
//----------------------------------------------------------------------------------------------------------------------
// Section Name
//----------------------------------------------------------------------------------------------------------------------
```

- Files start and end with a comment break
- Use blank lines to separate major sections

### Import Organization

1. External library imports first
2. Blank line
3. Internal imports grouped by type with comment headers:

```typescript
import { Router } from 'express';
import { z } from 'zod';

// Models
import type { Character } from '@rpgk/core';

// Managers
import * as characterMan from './managers/character.ts';

// Resource Access
import * as characterRA from '../resource-access/character.ts';

// Utils
import { broadcast } from '../utils/sio.ts';
```

### TypeScript Conventions

- Use `import type` for type-only imports
- Prefix interfaces with `I` when appropriate
- Async functions return `Promise<T>`
- Use explicit return types on exported functions
- Spaces around type annotations: `id : string` not `id: string`
- Spaces in brackets: `[ 1, 2, 3 ]`, `{ key: 'value' }`
- Template literals with spacing: `${ variable }`

## Architecture Patterns

### Layered Architecture

1. **Routes** - HTTP endpoint handlers
2. **Managers** - Business logic and orchestration
3. **Resource Access** - Database queries and data access
4. **Engines** - Specialized logic (validation, system-specific)

### Functional Module Pattern

```typescript
//----------------------------------------------------------------------------------------------------------------------
// Character Manager
//----------------------------------------------------------------------------------------------------------------------

// Resource Access
import * as characterRA from '../resource-access/character.ts';

//----------------------------------------------------------------------------------------------------------------------

export async function get(id : string) : Promise<Character>
{
    return characterRA.get(id);
}

export async function add(accountID : string, newCharacter : Omit<Character, 'id'>) : Promise<Character>
{
    // Business logic here
    return characterRA.add(accountID, newCharacter);
}

//----------------------------------------------------------------------------------------------------------------------
```

## Vue Guidelines

### Component Structure

```
componentName/
├── componentName.vue    # Template → Style → Script
├── types.ts             # Exported types (if needed)
└── index.ts             # Re-exports (if needed)
```

### Vue File Order

1. `<template>` - HTML
2. `<style lang="scss" scoped>` - Styles
3. `<script setup lang="ts">` - Logic

With HTML comment breaks between sections:

```vue
<!----------------------------------------------------------------------------------------------------------------------
  -- Component Name
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="my-component">
        Content
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss" scoped>
    .my-component {
        /* styles */
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script setup lang="ts">
    // Component logic

    //------------------------------------------------------------------------------------------------------------------
    // Section Name
    //------------------------------------------------------------------------------------------------------------------
</script>

<!--------------------------------------------------------------------------------------------------------------------->
```

### Component Naming

- File names are camelCase: `userCard.vue`, `mainLayout.vue`
- Component registration uses PascalCase in templates: `<UserCard />`

## Database

- **Type**: SQLite (better-sqlite3)
- **Location**: `<PROJECT_ROOT>/db/rpgk.db`
- **ORM**: Knex.js
- Migrations: `packages/server/src/knex/migrations/`
- Seeds: `packages/server/src/knex/seeds/`

## Package Dependencies

- Workspace packages reference each other with `"*"`: `"@rpgk/core": "*"`
- This resolves to the local workspace package

## Project Folders

- **`docs/`** - Design documents, system specifications, and project documentation
- **`config/`** - Environment configuration files (uses `@strata-js/util-config`)
- **`backup/`** - Database exports from previous versions (v0.9 through v2) pending migration to v3

## Key Files

- `packages/core/src/index.ts` - Core exports and models
- `packages/server/src/server.ts` - Server entry point
- `packages/client/src/app.vue` - Root Vue component
- `packages/systems/src/index.ts` - System definitions
- `eslint.config.js` - Code style rules
- `knexfile.js` - Database configuration
- `db/rpgk.db` - SQLite database
