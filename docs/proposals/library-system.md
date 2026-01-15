# Library System Proposal

A redesign of RPGKeeper's reference content architecture, replacing the current "supplements" system with a cleaner separation of concerns.

## Problem Statement

The current supplement system conflates multiple concerns:

1. **Official content** - Reference material from source books (talents, feats, spells, gear)
2. **User homebrew** - Custom content users create
3. **Campaign sharing** - GM sharing content with players
4. **Ownership/moderation** - Who can edit what, public submission workflows

This results in:
- Complex ownership/scope logic (`official`, `owner`, `scope` columns everywhere)
- Magic auto-route building that's hard to customize
- No type safety (`.passthrough()` allows anything)
- Migrations required for new systems or content types
- Crowdsourcing workflows that were never used

### The Fundamental Insight

Reference content has two very different lifecycles:

1. **Static definitions** - The "dictionary." What a talent IS. Doesn't change at runtime. Either comes from a book or is homebrew.
2. **Character instances** - The "usage." This character HAS that talent at rank 3. Lives on the character sheet.

The current system muddles these together. The fix is to separate them completely.

## Proposed Architecture

### Two Databases, Two Concerns

```
┌─────────────────────────────────────────────────────────────────┐
│                        STATIC DB                                 │
│                    (Read-only, deployed)                         │
│                                                                  │
│  Built from YAML in source control → SQLite file                │
│  Official/curated content                                        │
│  No ownership, no migrations, just reference data               │
└─────────────────────────────────────────────────────────────────┘
                              +
┌─────────────────────────────────────────────────────────────────┐
│                         MAIN DB                                  │
│                    (Read-write, runtime)                         │
│                                                                  │
│  User homebrew (personal library)                                │
│  Campaign shared content                                         │
│  Characters, accounts, campaigns, etc.                          │
└─────────────────────────────────────────────────────────────────┘
```

### Static Database

**Source of truth: YAML files in Git**

One YAML file per definition, organized by system and type:

```
packages/systems/src/
  eote/static/
    eote/                           # EotE-specific content
      sources.yaml                  # Source books metadata
      definitions/
        abilities/
          durable.yaml
          human.yaml
          ...
        talents/
          durable.yaml
          parry.yaml
          ...
        qualities/
          accurate.yaml
          ...
        forcepowers/
          ...
    genesys/                        # Genesys content (shares folder with eote)
      sources.yaml
      definitions/
        talents/
        qualities/
        motivations/
        ...
  coc/static/
    sources.yaml
    definitions/
      weapons/
        10-gauge-shotgun-2b.yaml
        ...
```

Each definition file has an explicit ID:

```yaml
# packages/systems/src/eote/static/eote/definitions/talents/durable.yaml
id: eote-talent-durable
name: Durable
description: The character may reduce a Critical Injury result...
activation: p
ranked: true
trees: Bodyguard, Fringer
reference: E-CRB:135
```

ID convention: `{system}-{type}-{slug}` but can be any unique string for edge cases.

Benefits:
- Human or AI can write it
- PRs for review (that's the moderation)
- Git history (that's the versioning)
- Schemas validate at build time
- Easy to audit

**Build step: YAML → SQLite**

```bash
npm run db:build-static
# Reads YAML files, outputs db/static.db
```

**Deploy: Copy the file**

```bash
scp db/static.db production:/app/db/
```

No migrations. No seeding logic. Atomic updates. Roll back = deploy previous file.

**Schema:**

```sql
-- Sources table (source books)
CREATE TABLE sources (
  system TEXT NOT NULL,       -- 'eote', 'genesys', 'coc'
  abbr TEXT NOT NULL,         -- 'E-CRB', 'CoC-IH'
  name TEXT NOT NULL,         -- 'Edge of the Empire Core Rulebook'
  product_code TEXT,          -- 'SWE02'
  PRIMARY KEY (system, abbr)
);

-- Definitions table (talents, weapons, etc.)
CREATE TABLE definitions (
  id TEXT PRIMARY KEY,        -- 'eote-talent-durable'
  system TEXT NOT NULL,       -- 'eote', 'genesys', 'coc'
  type TEXT NOT NULL,         -- 'talent', 'weapon', 'ability'
  name TEXT NOT NULL,         -- for text search
  content TEXT NOT NULL       -- full YAML content as JSON
);

CREATE INDEX idx_definitions_system ON definitions(system);
CREATE INDEX idx_definitions_type ON definitions(type);
CREATE INDEX idx_definitions_system_type ON definitions(system, type);
```

Two tables: `sources` for source books, `definitions` for everything else. Adding a new system or content type requires zero database changes.

### UGC Database (Main DB)

**Same structure, plus ownership:**

```sql
CREATE TABLE definitions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  owner_id INTEGER NOT NULL REFERENCES account(account_id),
  system TEXT NOT NULL,
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  content JSON NOT NULL
);

CREATE TABLE campaign_definitions (
  campaign_id INTEGER NOT NULL REFERENCES campaign(campaign_id),
  definition_id INTEGER NOT NULL REFERENCES definitions(id),
  PRIMARY KEY (campaign_id, definition_id)
);
```

**Ownership model:**
- `owner_id` - Who created it (always set)
- Junction table for campaign sharing (many-to-many)
- GMs can share their homebrew across multiple campaigns

**What shows up in search:**
- Everything from static DB (for your system)
- Your own UGC (`owner_id = me`)
- Campaign shared UGC (via junction table)

This isn't a security boundary - it's just filtering what appears in the UI.

### Definition References

Characters reference definitions via a simple pointer:

```typescript
interface DefinitionRef {
  source: 'static' | 'ugc';
  id: string;  // 'eote-talent-durable' or UGC ID
}
```

That's it. System is implicit from the character. The ref just says "look it up here."

**Instance data is separate and system-specific:**

```typescript
// EotE talent on a character
interface EoteTalentInstance {
  definitionRef: DefinitionRef;
  ranks: number;
  notes?: string;
}

// EotE weapon on a character
interface EoteWeaponInstance {
  definitionRef: DefinitionRef;
  attachments?: number[];
  condition?: string;
}

// D&D spell on a character
interface DndSpellInstance {
  definitionRef: DefinitionRef;
  prepared: boolean;
  slotsUsed?: number;
}
```

Each system defines what instance data it needs. The definition ref is just "where to find the base definition."

### Homebrew: Always Available

**Non-negotiable requirement:** Users must always be able to create content that doesn't exist in the static DB.

If a user needs a feat from an obscure supplement that isn't in the system yet, they can create it in their personal library. The site never blocks them.

**Promotion path (optional, out-of-band):**
1. User creates homebrew
2. Exports to YAML
3. Submits PR to project
4. Review, merge, deploy
5. Now it's static content

No in-app tracking of "this became official." It just exists in static now.

## System Architecture

### Self-Contained System Packages

Each system is a fully self-contained module:

```
packages/systems/src/eote/
  │
  ├── definition.ts           # System metadata (id, name, status)
  ├── models.ts               # TypeScript interfaces
  ├── schema.ts               # Character details Zod schema
  │
  ├── library/                # (future) Definition schemas & routes
  │   ├── schemas.ts          # Definition schemas (TalentSchema, etc.)
  │   ├── routes.ts           # Express Router (optional)
  │   └── index.ts            # Registration export
  │
  ├── client/                 # (future) Client-side logic
  │   ├── resource-access.ts  # Client-side API calls
  │   ├── managers.ts         # Client-side business logic
  │   └── engines.ts          # Client-side pure logic
  │
  ├── components/             # Vue components
  │   ├── eoteCharacter.vue
  │   ├── talentsCard.vue
  │   └── ...
  │
  └── static/                 # Static definitions (YAML)
      ├── eote/               # EotE-specific content
      │   ├── sources.yaml
      │   └── definitions/
      │       ├── talents/
      │       ├── abilities/
      │       └── ...
      └── genesys/            # Genesys content (same folder, different static path)
          ├── sources.yaml
          └── definitions/
              └── ...
```

### Library Registration

Systems declare what definition types they support:

```typescript
// packages/systems/src/eote/library/schemas.ts
import { z } from 'zod';

export const TalentSchema = z.object({
  name: z.string(),
  description: z.string(),
  activation: z.enum(['p', 'ai', 'aio', 'am', 'aa']),
  ranked: z.boolean(),
  trees: z.string(),
  reference: z.string(),
});

export const WeaponSchema = z.object({
  name: z.string(),
  description: z.string(),
  skill: z.string(),
  damage: z.number(),
  critical: z.number(),
  range: z.enum(['en', 's', 'm', 'l', 'ex']),
  encumbrance: z.number(),
  rarity: z.number(),
  qualities: z.array(z.object({ id: z.number(), ranks: z.number().optional() })),
  reference: z.string(),
});

// ... etc
```

```typescript
// packages/systems/src/eote/library/index.ts
import { TalentSchema, WeaponSchema, AbilitySchema, GearSchema } from './schemas.ts';

export const libraryDefinitions = {
  talent: TalentSchema,
  weapon: WeaponSchema,
  ability: AbilitySchema,
  gear: GearSchema,
  // ...
};

export type EoteDefinitionType = keyof typeof libraryDefinitions;
```

### Routes: Explicit, Not Magic

**No more auto-route building.** Systems export Express routers explicitly:

```typescript
// packages/systems/src/eote/library/routes.ts
import { Router } from 'express';
import { buildLibraryRoutes } from '@rpgk/server/utils/library';
import { TalentSchema, WeaponSchema } from './schemas.ts';

const router = Router();

// Factory functions for standard CRUD (opt-in)
buildLibraryRoutes(router, 'talent', TalentSchema);
buildLibraryRoutes(router, 'weapon', WeaponSchema);
buildLibraryRoutes(router, 'ability', AbilitySchema);

// Custom routes when needed
router.get('/forcepowers/:id/tree', async (req, res) => {
  // Custom logic for force power upgrade trees
});

export default router;
```

**Convention:** `/api/system/:systemId/library/:type`

But it's just convention. Systems write their own routes. Factory functions are helpers, not magic.

### Client-Side Architecture

Systems include their own client-side code:

```typescript
// packages/systems/src/eote/client/resource-access.ts
import { api } from '@rpgk/client/lib/api';
import type { EoteTalent, EoteWeapon } from '../models.ts';

export async function getTalents(): Promise<EoteTalent[]> {
  return api.get('/system/eote/library/talent');
}

export async function getTalent(ref: DefinitionRef): Promise<EoteTalent> {
  const base = ref.source === 'static' ? '/static' : '/api';
  return api.get(`${base}/system/eote/library/talent/${ref.id}`);
}

// ... etc
```

```typescript
// packages/systems/src/eote/client/managers.ts
import * as libraryRA from './resource-access.ts';

export class EoteLibraryManager {
  async searchTalents(query: string): Promise<EoteTalent[]> {
    // Searches both static and UGC, merges results
  }

  async resolveTalent(ref: DefinitionRef): Promise<EoteTalent> {
    return libraryRA.getTalent(ref);
  }
}
```

### What Core Provides

The `@rpgk/server` and `@rpgk/client` packages provide infrastructure:

**Server:**
- Generic library CRUD (the `buildLibraryRoutes` factory)
- Database access for both static and UGC
- Authentication, permissions
- Static DB loading and querying
- System registration and routing

**Client:**
- API client infrastructure
- Store management (Pinia)
- Generic UI components
- Definition resolution utilities

### What Systems Provide

Everything specific to that game system:

- Definition schemas (Zod)
- Character details schema
- TypeScript interfaces
- Optional custom routes
- Vue components
- Client-side managers/RA
- Static data (YAML)

## Migration Path

### Phase 1: Infrastructure ✅ DONE

1. ✅ Create static DB build pipeline (YAML → SQLite)
   - `scripts/convert-seeds-to-yaml.ts` - Converts database seeds to YAML
   - `packages/systems/scripts/build-static-db.ts` - Builds SQLite from YAML
   - `npm run db:build-static` - NPM script (outputs to `db/static.db`)
2. ✅ Add static DB resource access (`packages/server/src/resource-access/static.ts`)
3. ⏳ Add `definitions` table to main DB (UGC)
4. ⏳ Add `campaign_definitions` junction table
5. ⏳ Create generic library CRUD utilities
6. ⏳ Add static DB loading to server startup

### Phase 2: Migrate EotE/Genesys ⏳ IN PROGRESS

1. ✅ Create YAML files for EotE static content (354 definitions, 53 sources)
2. ⏳ Define library schemas in `eote/library/schemas.ts`
3. ⏳ Create explicit routes in `eote/library/routes.ts`
4. ⏳ Add client-side RA/managers
5. ⏳ Update character model to use `DefinitionRef`
6. ⏳ Update Vue components to resolve definitions
7. ⏳ Migrate existing supplement data

### Phase 3: CoC

1. ✅ Create YAML files for CoC static content (104 weapons, 3 sources)
2. ⏳ Define library schemas
3. ⏳ Rest of migration...

### Phase 4: Remaining Systems

Repeat for each system. Systems without library content (Risus, WFRP, Fate) just skip the library parts.

### Phase 5: Cleanup

1. Remove old supplement tables
2. Remove auto-route building code
3. Remove `official`, `scope`, `owner` from old schema
4. Update documentation

## Benefits

1. **No migrations for new content** - JSON column handles schema changes
2. **No migrations for new systems** - One generic table
3. **Static content is truly static** - Read-only, deployed as a file
4. **Clear separation of concerns** - Static vs UGC, definition vs instance
5. **Explicit routing** - No magic, easy to understand and customize
6. **Self-contained systems** - Everything about a system in one place
7. **AI content pipeline** - Feed PDF → output YAML → review PR → deploy
8. **Homebrew always works** - Users never blocked by missing content

## Open Questions

1. **Full-text search** - SQLite FTS5 for name searching? Or keep it simple with LIKE?
2. **Caching** - Cache static definitions in memory on server startup?
3. **Client-side static DB** - Ship staticdb.sqlite to client for offline support someday?
4. **Definition versioning** - Store a hash/version for "check for updates" on character refs?

## Appendix: Content Pipeline Vision

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   PDF        │────▶│  Claude +    │────▶│    YAML      │
│  (rulebook)  │     │  MCP Tools   │     │   (output)   │
└──────────────┘     └──────────────┘     └──────────────┘
                                                 │
                                                 ▼
                                          ┌──────────────┐
                                          │   PR Review  │
                                          │   (human)    │
                                          └──────────────┘
                                                 │
                                                 ▼
                                          ┌──────────────┐
                                          │    Build     │
                                          │  Static DB   │
                                          └──────────────┘
                                                 │
                                                 ▼
                                          ┌──────────────┐
                                          │   Deploy     │
                                          └──────────────┘
```

A Claude skill could:
1. Accept PDF pages as input
2. Know the system's definition schemas
3. Extract structured content
4. Output valid YAML
5. Human reviews for accuracy
6. Merge → build → ship

This solves the original "users had to type everything" problem without crowdsourcing.
