//----------------------------------------------------------------------------------------------------------------------
// EotE / Genesys Client Constants
//
// Display enums and other constants used by the EotE/Genesys Vue components.
//----------------------------------------------------------------------------------------------------------------------

/* eslint-disable id-length */

/**
 * Display names for encounter range values.
 */
export const rangeEnum : Record<string, string> = {
    en: 'Engaged',
    s: 'Short',
    m: 'Medium',
    l: 'Long',
    ex: 'Extreme',
};

/**
 * Display names for talent/ability activation types.
 */
export const activationEnum : Record<string, string> = {
    p: 'Passive',
    ai: 'Active (Incidental)',
    aio: 'Active (Incidental, Out of Turn)',
    am: 'Active (Maneuver)',
    aa: 'Active (Action)',
};

/* eslint-enable id-length */

//----------------------------------------------------------------------------------------------------------------------
