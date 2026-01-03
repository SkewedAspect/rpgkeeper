//----------------------------------------------------------------------------------------------------------------------
// @rpgk/systems - Main Entry Point (Client)
//----------------------------------------------------------------------------------------------------------------------

// Export types
export * from './types.ts';

// Export registry
export { systemRegistry } from './registry.ts';

// Import and register all systems
import coc from './coc/index.ts';
import { eote, genesys } from './eote';
import fate from './fate/index.ts';
import risus from './risus/index.ts';
import wfrp from './wfrp/index.ts';
import { systemRegistry } from './registry.ts';

// Register systems
systemRegistry.register(coc);
systemRegistry.register(eote);
systemRegistry.register(fate);
systemRegistry.register(genesys);
systemRegistry.register(risus);
systemRegistry.register(wfrp);

// Export individual systems for direct access
export { default as coc } from './coc/index.ts';
export { eote, genesys } from './eote/index.ts';
export { default as fate } from './fate/index.ts';
export { default as risus } from './risus/index.ts';
export { default as wfrp } from './wfrp/index.ts';

//----------------------------------------------------------------------------------------------------------------------
