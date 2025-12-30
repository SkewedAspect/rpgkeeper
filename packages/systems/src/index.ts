//----------------------------------------------------------------------------------------------------------------------
// @rpgk/systems - Main Entry Point (Client)
//----------------------------------------------------------------------------------------------------------------------

// Export types
export * from './types.js';

// Export registry
export { systemRegistry } from './registry.js';

// Import and register all systems
import risus from './risus/index.js';
import { systemRegistry } from './registry.js';

// Register systems
systemRegistry.register(risus);

// Export individual systems for direct access
export { default as risus } from './risus/index.js';

//----------------------------------------------------------------------------------------------------------------------
