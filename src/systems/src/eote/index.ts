//----------------------------------------------------------------------------------------------------------------------
// EotE / Genesys System (Server-Safe)
//----------------------------------------------------------------------------------------------------------------------

// Definitions
export { eoteDefinition, genesysDefinition } from './definition.ts';
export { eoteDefinition as default } from './definition.ts';

// Models
export * from './models.ts';

// Note: Schemas are NOT re-exported to avoid naming conflicts.
// Import directly from:
//   - './schemas/shared/character.ts' for shared character schemas
//   - './schemas/shared/supplements.ts' for shared supplement schemas
//   - './schemas/eote/character.ts' for EotE character schemas
//   - './schemas/eote/supplements.ts' for EotE supplement schemas
//   - './schemas/genesys/character.ts' for Genesys character schemas
//   - './schemas/genesys/supplements.ts' for Genesys supplement schemas

//----------------------------------------------------------------------------------------------------------------------
