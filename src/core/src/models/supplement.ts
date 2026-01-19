//----------------------------------------------------------------------------------------------------------------------
// Supplement
//----------------------------------------------------------------------------------------------------------------------

/**
 * Base interface for supplement data with strongly-typed core fields.
 */
export interface SupplementBase
{
    id ?: string;
    name : string;
    description ?: string;
    owner ?: string;
    official : boolean;
    reference ?: string;
}

/**
 * A supplement definition that can include system-specific additional properties.
 * Uses intersection type to preserve strong typing for base properties while allowing extensions.
 */
export type Supplement = SupplementBase & Record<string, unknown>;

/**
 * A reference to an instantiated supplement (e.g., on a character).
 */
export interface SupplementInst
{
    id : string;
}

//----------------------------------------------------------------------------------------------------------------------
