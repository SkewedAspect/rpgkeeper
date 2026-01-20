//----------------------------------------------------------------------------------------------------------------------
// CoC System (Server-Safe)
//----------------------------------------------------------------------------------------------------------------------

// Definition
export { default as cocDefinition, default } from './definition.ts';

// Re-export skill data for use elsewhere
export {
    baseSkills,
    cocDefaults,
    defaultSkills,
    modernSkills,
    specializations,
    twentiesSkills,
} from './definition.ts';

// Models
export * from './models.ts';

// Note: Schemas are NOT re-exported to avoid naming conflicts.
// Import directly from './schemas/character.ts' or './schemas/supplements.ts' as needed.

//----------------------------------------------------------------------------------------------------------------------
