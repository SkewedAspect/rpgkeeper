# Project Revamp MkIII

Back at it again... again.

## Completed

* [X] Switch to Bootstrap v5 (and Bootstrap-Vue-Next)
* [X] Switch to Vue 3
* [X] ~~Switch to New [Color-picker][]~~ Old one works fine
* [X] Convert from decoders to [Zod][] validation

## In Progress

* [ ] Change FontAwesome imports to [tree-shakable][] version
* [X] Migrate to a plain data model (see [Plain Data Model Migration](#plain-data-model-migration) below)
* [ ] Character avatar/portrait uploads
    * [ ] Add image cropping UI using [vue-advanced-cropper][]
    * [ ] Store images as blob in database (S3/object storage later)
    * [ ] Database schema changes for stored images

## Plain Data Model Migration

Three-pronged approach to clean up data handling:

1. **Plain object data models** - TypeScript interfaces + Zod schemas, no classes
2. **Validation** - Zod schemas validate at runtime, codecs handle transforms
3. **Supplements** - Rethink the overly generic system (deferred for now)

### Architecture

**Zod as the universal parser/transformer** at every boundary:

```
┌─────────────────────────────────────────────────────────────┐
│                     ZOD CODECS                              │
│              (parse, validate, transform)                   │
└─────────────────────────────────────────────────────────────┘
        ↑                    ↑                    ↑
   Client JSON          Domain Object          DB Row
        │                    │                    │
        ▼                    ▼                    ▼
   ┌─────────┐          ┌─────────┐          ┌─────────┐
   │ Request │──decode──▶│ Domain  │──encode──▶│   DB    │
   │  Body   │          │  Model  │          │   Row   │
   └─────────┘          └─────────┘          └─────────┘
        ▲                    ▲                    │
        │                    └───────decode───────┘
        └─────────────────encode──────────────────┘
```

### Package Responsibilities

```
@rpgk/core (foundation - no dependencies)
├── models/
│   ├── character.ts         # Base Character<Details> interface
│   ├── supplement.ts        # Base Supplement interface
│   └── common.ts            # Shared types (SystemDefaults, etc.)
├── validation/
│   ├── character.ts         # Base CharacterSchema (non-details fields)
│   └── common.ts            # Reusable Zod pieces (HashID, etc.)
└── utils/
    └── codecs.ts            # Common codecs (timestamps, JSON helpers)

@rpgk/systems (owns system-specific everything)
└── {system}/
    ├── definition.ts        # SystemDefinition
    ├── models.ts            # System details interface (MOVED from core)
    ├── schema.ts            # Zod schemas + codecs
    └── components/          # Vue components

@rpgk/server (consumes both)
└── Uses schemas from systems, codecs from core
```

### Key Patterns

**System details use `z.json()` codec:**
```typescript
// Handles JSON string ↔ validated object in one shot
const RisusDetailsCodec = z.json(RisusDetailsSchema);

RisusDetailsCodec.decode('{"advancementPoints":5,...}')  // → typed object
RisusDetailsCodec.encode({ advancementPoints: 5, ... })  // → JSON string
```

**Custom codec for timestamps:**
```typescript
// ISO string (DB) ↔ Unix seconds (Domain)
export const isoToEpochSeconds = z.codec(
    z.iso.datetime(),
    z.number(),
    {
        decode: (iso) => Math.floor(new Date(iso).getTime() / 1000),
        encode: (seconds) => new Date(seconds * 1000).toISOString(),
    }
);
```

**Type inference from schemas:**
```typescript
// Interface derived from schema - single source of truth
export const RisusDetailsSchema = z.object({ ... });
export type RisusSystemDetails = z.infer<typeof RisusDetailsSchema>;
```

### Migration Order

Systems by complexity (simple → complex):

1. **Risus** - 5 fields, no supplement refs (proof of concept) ✓
2. **WFRP** - 2 arrays ✓
3. **Fate** - Aspects, stress, stunts ✓
4. **CoC** - Biography, skills, backstory, weapons ✓
5. **EotE/Genesys** - Supplement refs everywhere (most complex) ✓

### Checklist

#### Phase 1: Foundation
- [X] Create `@rpgk/core/utils/codecs.ts` with common codecs
- [X] Add tests for common codecs
- [X] Update `@rpgk/core` exports

#### Phase 2: Risus (Proof of Concept)
- [X] Move `RisusSystemDetails` interface from core to systems
- [X] Create `@rpgk/systems/risus/schema.ts` with Zod schemas
- [X] Create `@rpgk/systems/risus/models.ts` (moved interfaces)
- [X] Add tests for Risus schema validation
- [X] Update Risus exports and definition
- [X] Wire up validation in CharacterManager

#### Phase 3: Remaining Systems
- [X] WFRP
- [X] Fate
- [X] CoC
- [X] EotE/Genesys

#### Phase 4: Supplements (Deferred)
- [ ] Audit current supplement architecture
- [ ] Design simplified supplement system
- [ ] Migrate supplements to new pattern

## Project Restructuring

Restructure the project to use npm workspaces to solve build conflicts and improve system organization.

### Goals

* Solve client/server build conflicts over shared code (common/ compiled by both Vite and tsc)
* Create a clear "system contract" that defines what each RPG system must implement
* Enable auto-discovery of systems (no more manual switch statements)
* Unify validation across all systems using Zod schemas
* Better code organization with clear ownership boundaries

### Proposed Structure

```
rpgkeeper/
├── package.json                 # Workspace root
├── packages/
│   ├── core/                    # @rpgk/core - Pure TS (tsc)
│   │   └── src/
│   │       ├── models/          # Character, Supplement, base interfaces
│   │       ├── system/          # SystemDefinition contract
│   │       ├── validation/      # Shared Zod utilities
│   │       └── utils/           # Dice, formatting, etc.
│   │
│   ├── systems/                 # @rpgk/systems - TS + Vue (Vite)
│   │   └── src/
│   │       ├── index.ts         # Registry, auto-discovery, exports
│   │       ├── risus/           # Each system as a module
│   │       │   ├── index.ts     # System definition
│   │       │   ├── models.ts    # TypeScript interfaces
│   │       │   ├── validation.ts # Zod schemas
│   │       │   └── components/  # Vue components
│   │       ├── eote/
│   │       ├── fate/
│   │       ├── coc/
│   │       └── wfrp/
│   │
│   ├── client/                  # @rpgk/client - Vue app (Vite)
│   │   └── src/                 # App shell, pages, shared UI only
│   │
│   └── server/                  # @rpgk/server - Express API (tsc)
│       └── src/
│           └── knex/            # Database migrations
```

### System Contract

Each system exports a unified definition:

```typescript
interface SystemDefinition<TDetails> {
    // Identity
    id: string;
    name: string;
    description: string;
    status: SupportStatus;

    // Data
    defaults: TDetails;
    detailsSchema: ZodSchema<TDetails>;

    // Client
    characterComponent: Component;

    // Server (optional)
    routes?: Router;
    supplements?: SupplementConfig[];
}
```

### Build Order

1. `@rpgk/core` (tsc) - pure types/utils, no framework dependencies
2. `@rpgk/systems` (Vite) - depends on core, contains Vue components
3. `@rpgk/client` (Vite) - depends on core + systems
4. `@rpgk/server` (tsc) - depends on core, imports system types only

### Migration Plan

- [X] Phase 1: Create workspace structure, extract `@rpgk/core` from `src/common/`
- [X] Phase 2: Update client and server to import from `@rpgk/core`
- [X] Phase 3: Create `@rpgk/systems` package, extract Risus first (simplest)
- [X] Phase 4: Extract remaining systems (Fate, WFRP, CoC, EotE/Genesys + dnd35, generic, v20)
- [X] Phase 5: Clean up legacy code

## iDesign Architecture Migration

Migrate from functional modules to proper iDesign methodology with clear separation of concerns. See `AGENTS.md` for architecture documentation. Reference implementations: `polyverse` and `marknoire` projects.

### Server Architecture Refactoring

Current state: Functional modules with `export async function` pattern, unclear separation between managers and resource access, business logic mixed into RA layer.

Target state: Class-based architecture with clear layering - Managers orchestrate, Engines contain pure logic, Resource Access handles I/O only.

#### Phase 1: Resource Access Layer

Convert to class-based RAs with clear single responsibility:

- [X] Create `EntityResourceAccess` facade class to coordinate all entity RAs
- [X] Create `getEntities()` singleton accessor for managers
- [X] Convert `account.ts` RA to class-based `AccountResourceAccess`
- [X] Convert `character.ts` RA to class-based `CharacterResourceAccess`
- [X] Convert `campaign.ts` RA to class-based `CampaignResourceAccess`
- [X] Convert `notebook.ts` RA to class-based `NotebookResourceAccess`
- [X] Convert `reference.ts` RA to class-based `ReferenceResourceAccess`
- [X] Convert `role.ts` RA to class-based `RoleResourceAccess`
- [X] Convert `supplement.ts` RA to class-based `SupplementResourceAccess`
- [X] Convert `system.ts` RA to class-based `SystemResourceAccess`
- [X] Update all managers to use `EntityResourceAccess` via `getEntities()`
- [X] Delete old functional RA files
- [ ] Refactor transforms/ into engine layer or utils (optional)

#### Phase 2: Engine Layer (New)

Create pure logic engines (no I/O, easily testable):

- [X] `SystemsEngine` exists with `validateCharacterDetails()` for system-specific validation
- [X] Create `SupplementEngine` for access control and validation
    - [X] `getViewAccessFilter()` - returns filter criteria for queries
    - [X] `checkModifyAccess()` - authorization check
    - [X] `sanitizeForSave()` - ensures ownership and official flags are valid
- [X] Character manager orchestrates between RA and engine
- [ ] Create `RoleEngine` for permission/role logic (if needed)
- [ ] Move character transforms from transforms/ to engine (optional)

#### Phase 3: Manager Layer

Convert to class-based managers that orchestrate engines and RAs:

- [X] Create dependency injection pattern for manager construction (`ManagerAccess` facade + `getManagers()`)
- [X] Convert `account.ts` manager to class-based `AccountManager`
- [X] Convert `character.ts` manager to class-based `CharacterManager`
    - [X] Orchestrate between `CharacterEngine` and `CharacterResourceAccess`
    - [X] Keep broadcasting logic here
- [X] Convert `campaign.ts` manager to class-based `CampaignManager`
- [X] Convert `notebook.ts` manager to class-based `NotebookManager`
- [X] Convert `reference.ts` manager to class-based `ReferenceManager`
- [X] Convert `role.ts` manager to class-based `RoleManager`
- [X] Convert `supplement.ts` manager to class-based `SupplementManager`
- [X] Convert `system.ts` manager to class-based `SystemManager`

#### Phase 4: Routes Refactoring

Update routes to use new class-based managers:

- [X] Update route handlers to use `getManagers()` for manager access
- [X] Remove direct RA imports from routes
- [X] Ensure routes only call manager layer

### Client Architecture Refactoring

Current state: Already class-based managers and RAs, uses Pinia stores for reactive state. Some business logic mixed into RA layer (e.g., `_buildOrUpdateModel`).

Target state: Cleaner separation with managers → engines → RA pattern, consistent with server architecture.

#### Phase 1: Audit and Plan

- [ ] Audit current manager/RA responsibilities
- [ ] Identify business logic that should move to engines
- [ ] Document socket.io handling patterns

#### Phase 2: Engine Layer (New)

- [ ] Create `CharacterEngine` for character model building and validation
    - [ ] Move `_buildOrUpdateModel()` logic from RA
- [ ] Create other engines as needed based on audit

#### Phase 3: Clean Up Existing Layers

- [ ] Ensure RAs only handle HTTP calls (axios)
- [ ] Ensure managers handle orchestration and socket.io
- [ ] Stores remain as reactive state layer
- [ ] Consider `EntityResourceAccess` facade for consistency with server

## Authentication

Replace current Google-only auth with [better-auth][] for flexible authentication.

### Phase 1 (Initial)
- [ ] Local username/password registration
- [ ] Google OAuth

### Phase 2 (Social)
- [ ] Twitter / X
- [ ] Facebook

### Phase 3 (Enterprise)
- [ ] Apple
- [ ] Microsoft

## New Features

* [ ] Improved Dashboard
* [ ] Campaigns
* [ ] Maps
* [ ] Mooks

## Project Infrastructure

* [ ] Move project to GitLab (GitHub as mirror)
    * [ ] Set up CI/CD Pipelines
        * [ ] Beta deploys on all merges to main
        * [ ] Prod deploys on release tags

<!-- Links -->

[zod]: https://github.com/colinhacks/zod
[better-auth]: https://www.better-auth.com/
[vue-advanced-cropper]: https://github.com/advanced-cropper/vue-advanced-cropper
[color-picker]: https://github.com/cyhnkckali/vue3-color-picker
[tree-shakable]: https://docs.fontawesome.com/apis/javascript/tree-shaking
