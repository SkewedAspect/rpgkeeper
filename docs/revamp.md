# Project Revamp MkIII

Back at it again... again.

## Completed

* [X] Switch to Bootstrap v5 (and Bootstrap-Vue-Next)
* [X] Switch to Vue 3
* [X] ~~Switch to New [Color-picker][]~~ Old one works fine
* [X] Convert from decoders to [Zod][] validation

## In Progress

* [ ] Change FontAwesome imports to [tree-shakable][] version
* [ ] Migrate to a plain data model
    * [ ] Remove/replace the 'supplements' system with a more customized system per system
* [ ] Character avatar/portrait uploads
    * [ ] Add image cropping UI using [vue-advanced-cropper][]
    * [ ] Store images as blob in database (S3/object storage later)
    * [ ] Database schema changes for stored images

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

- [ ] Phase 1: Create workspace structure, extract `@rpgk/core` from `src/common/`
- [ ] Phase 2: Update client and server to import from `@rpgk/core`
- [ ] Phase 3: Create `@rpgk/systems` package, extract Risus first (simplest)
- [ ] Phase 4: Extract remaining systems (Fate, WFRP, CoC, EotE/Genesys)
- [ ] Phase 5: Clean up legacy code, update documentation

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
