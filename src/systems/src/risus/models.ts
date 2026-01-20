//----------------------------------------------------------------------------------------------------------------------
// Risus System Models
//----------------------------------------------------------------------------------------------------------------------

/**
 * A hook is a character flaw or complication that makes the game more interesting.
 */
export interface RisusHook
{
    description : string;
}

/**
 * A cliche is a broad skill or archetype that defines what a character can do.
 * The value represents the number of dice rolled when using the cliche.
 */
export interface RisusCliche
{
    /** The number of dice for this cliche (permanent value) */
    value : number;
    /** Current dice available (may be reduced during combat) */
    current : number;
    /** Description of the cliche */
    description : string;
    /** Optional tools or equipment associated with the cliche */
    tools ?: string;
}

/**
 * The system-specific details for a Risus character.
 */
export interface RisusSystemDetails
{
    /** Points available for character advancement */
    advancementPoints : number;
    /** Funky Dice - special dice that can be used for creative actions */
    ffDice : number;
    /** The character's cliches (skills/archetypes) */
    cliches : RisusCliche[];
    /** The character's hooks (flaws/complications) */
    hooks : RisusHook[];
    /** Lucky shots - one-time bonuses that can be used in dire situations */
    luckyShots : {
        current : number;
        max : number;
    };
}

//----------------------------------------------------------------------------------------------------------------------
