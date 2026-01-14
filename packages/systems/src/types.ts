//----------------------------------------------------------------------------------------------------------------------
// @rpgk/systems - Types
//----------------------------------------------------------------------------------------------------------------------

import type { z } from 'zod';
import type { Character, SystemDefaults, SystemDefinition } from '@rpgk/core';

//----------------------------------------------------------------------------------------------------------------------

/**
 * Extended system module interface that includes Vue component and validation.
 * This extends SystemDefinition to add client-side functionality.
 */
export interface SystemModule<TDetails extends SystemDefaults = SystemDefaults>
    extends SystemDefinition<TDetails>
{
    /** Vue component for rendering the character sheet (client-only) */
    characterComponent ?: any;

    /** Zod schema for validating character details on save */
    detailsSchema ?: z.ZodType<TDetails>;

    /** Validate and normalize character details, returning corrected data (legacy) */
    validateDetails ?: (char : Character<TDetails>) => Character<TDetails>;
}

//----------------------------------------------------------------------------------------------------------------------
