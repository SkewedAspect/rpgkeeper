//----------------------------------------------------------------------------------------------------------------------
// Characteristic Utilities
//----------------------------------------------------------------------------------------------------------------------

/**
 * Abbreviation map for EotE/Genesys characteristics.
 */
const CHAR_ABBREVIATIONS : Record<string, string> = {
    brawn: 'BR',
    agility: 'AG',
    intellect: 'INT',
    cunning: 'CUN',
    willpower: 'WIL',
    presence: 'PR',
};

/**
 * Get the standard abbreviation for a characteristic name.
 */
export function charAbbrev(char : string) : string
{
    return CHAR_ABBREVIATIONS[char] ?? char.substring(0, 2).toUpperCase();
}

//----------------------------------------------------------------------------------------------------------------------
