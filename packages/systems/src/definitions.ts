//----------------------------------------------------------------------------------------------------------------------
// @rpgk/systems - Definitions Entry Point (Server-safe, no Vue)
//----------------------------------------------------------------------------------------------------------------------

// Export types
export * from './types.js';

// Export registry
export { systemRegistry } from './registry.js';

// Import and register all system definitions (no Vue components)
import risusDefinition from './risus/definition.js';
import { systemRegistry } from './registry.js';

// Register systems (definitions only)
systemRegistry.register(risusDefinition);

// Export individual definitions
export { risusDefinition };

//----------------------------------------------------------------------------------------------------------------------
