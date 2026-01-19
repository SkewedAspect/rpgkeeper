// ---------------------------------------------------------------------------------------------------------------------
// System
// ---------------------------------------------------------------------------------------------------------------------

import type { ZodTypeAny } from 'zod';

// ---------------------------------------------------------------------------------------------------------------------
// Support Status
// ---------------------------------------------------------------------------------------------------------------------

export const validSupportStatuses = [ 'dev', 'beta', 'disabled', 'stable' ] as const;
export type ValidSupportStatus = typeof validSupportStatuses[number];

export const SupportStatus = {
    Alpha: 'dev',
    Beta: 'beta',
    Disabled: 'disabled',
    Stable: 'stable',
} as const;

export type SupportStatus = typeof SupportStatus[keyof typeof SupportStatus];

// ---------------------------------------------------------------------------------------------------------------------
// Supplement Type Configuration
// ---------------------------------------------------------------------------------------------------------------------

/**
 * Configuration for a supplement type within a system.
 */
export interface SupplementTypeConfig
{
    /** Zod schema for validating supplement data */
    schema : ZodTypeAny;
}

// ---------------------------------------------------------------------------------------------------------------------
// System Definition
// ---------------------------------------------------------------------------------------------------------------------

export type SystemDefaults = object;

/**
 * Definition of an RPG system.
 *
 * @template Defaults - Type of the default character details for this system
 */
export interface SystemDefinition<Defaults extends SystemDefaults = SystemDefaults>
{
    /** Unique identifier for this system (e.g., 'eote', 'genesys', 'coc') */
    id : string;

    /** Display name for this system */
    name : string;

    /** Description of this system */
    description : string;

    /** Default values for new characters in this system */
    defaults : Defaults;

    /** Support status of this system */
    status : SupportStatus;

    /**
     * Supplement types supported by this system.
     * Routes are auto-generated for each type: GET/POST /:system/:type, GET/PATCH/DELETE /:system/:type/:id
     *
     * @example
     * ```typescript
     * supplements: {
     *     ability: { schema: AbilitySchema },
     *     talent: { schema: TalentSchema },
     * }
     * ```
     */
    supplements ?: Record<string, SupplementTypeConfig>;

    /**
     * Custom route handler for system-specific endpoints.
     * Called with an Express Router instance after auto-generated supplement routes.
     * If a custom route conflicts with an auto-generated one, the custom route takes precedence
     * and a warning is logged.
     *
     * Note: This is typed loosely to avoid Express dependency in @rpgk/core.
     * The server will pass the correct Router type.
     */
    routes ?: (router : unknown) => void;

    /**
     * Zod schema for validating character details on save.
     * Used by the server to validate character.details before persisting.
     *
     * The schema can include supplement reference metadata (via supplementId/supplementRefMeta)
     * to enable automatic referential integrity validation. Fields annotated with this metadata
     * will be checked against the supplement database, and invalid references will be removed.
     *
     * @see supplementId - For direct ID string fields
     * @see supplementRefMeta - For object fields with an 'id' property
     */
    detailsSchema ?: ZodTypeAny;
}

// ---------------------------------------------------------------------------------------------------------------------
