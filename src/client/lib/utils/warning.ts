// ---------------------------------------------------------------------------------------------------------------------
// Warning Handler
// ---------------------------------------------------------------------------------------------------------------------

import { ComponentPublicInstance } from 'vue';

// ---------------------------------------------------------------------------------------------------------------------

// Components to ignore.
const componentsToIgnore = [
    'BLink',
    'RouterLink',
    'BNav',
    'BVTab',
    'BTab',
    'BButton',
    'BDropdown',
    'BProgress',
    'BForm',
    'BTbody',
    'BThead',
    'BTh',
    'BTr',
    'BTable'
];

const deprecationsToIgnore = [
    // Weird errors we can probably ignore?
    'Multiple instances of Vue detected',
    'has already been',

    // Look up each of these in the migration build and check your code for it, before turning these on!
    // See: https://v3-migration.vuejs.org/migration-build.html
    'RENDER_FUNCTION',
    'COMPONENT_FUNCTIONAL',
    'INSTANCE_LISTENERS',
    'INSTANCE_EVENT_EMITTER',
    'INSTANCE_SCOPED_SLOTS',
    'OPTIONS_BEFORE_DESTROY',
    'WATCH_ARRAY',
    'COMPONENT_V_MODEL',
    'GLOBAL_EXTEND',
    'GLOBAL_MOUNT',
    'ATTR_FALSE_VALUE'
];

export function buildWarnHandler() : (msg : string, instance: (ComponentPublicInstance | null), trace : string) => void
{
    return (msg : string, instance : ComponentPublicInstance | null, trace : string) =>
    {
        const components = trace
            .split('at')
            .map((item) => item.trim())
            .filter((item) => !!item);

        const matchingMessage = deprecationsToIgnore.some((item) => msg.includes(item));
        const matchingComponent = componentsToIgnore.some((item) => components[0].includes(item));

        if(!matchingMessage && !matchingComponent)
        {
            console.warn(`[Vue warn]: ${ msg }`, instance, trace);
        }
    };
}

// ---------------------------------------------------------------------------------------------------------------------
