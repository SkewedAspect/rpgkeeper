// ---------------------------------------------------------------------------------------------------------------------
// Risus Interfaces
// ---------------------------------------------------------------------------------------------------------------------

export interface RisusHook
{
    description : string;
}

export interface RisusCliche
{
    value : number;
    current : number;
    description : string;
    tools ?: string;
}

export interface RisusSystemDetails
{
    advancementPoints : number;
    ffDice : number;
    cliches : RisusCliche[];
    hooks : RisusHook[];
    luckyShots : {
        current : number;
        max : number;
    }
}

// ---------------------------------------------------------------------------------------------------------------------
