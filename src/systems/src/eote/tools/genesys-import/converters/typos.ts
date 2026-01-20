//----------------------------------------------------------------------------------------------------------------------
// Typo Corrections
//
// Fixes known typos in source data during import.
//----------------------------------------------------------------------------------------------------------------------

/**
 * Map of typos to their corrections.
 * Keys are case-insensitive patterns, values are the correct spelling.
 */
const TYPO_CORRECTIONS : Record<string, string> = {
    encoumbrance: 'encumbrance',
};

//----------------------------------------------------------------------------------------------------------------------

/**
 * Fix known typos in text.
 */
export function fixTypos(text : string) : string
{
    let result = text;

    for(const [ typo, correction ] of Object.entries(TYPO_CORRECTIONS))
    {
        // Case-insensitive replacement that preserves original case pattern
        const regex = new RegExp(typo, 'gi');
        result = result.replace(regex, (match) =>
        {
            // Preserve the case of the first character
            if(match[0] === match[0].toUpperCase())
            {
                return correction.charAt(0).toUpperCase() + correction.slice(1);
            }
            return correction;
        });
    }

    return result;
}

//----------------------------------------------------------------------------------------------------------------------
