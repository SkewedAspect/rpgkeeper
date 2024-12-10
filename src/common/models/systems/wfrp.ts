// ---------------------------------------------------------------------------------------------------------------------
// WFRP Interfaces
// ---------------------------------------------------------------------------------------------------------------------

export interface WFRPStat
{
    description : string;
    value : number;
}

export interface WFRPSkill
{
    description : string;
    value : number;
}

export interface WFRPSystemDetails
{
    skills : WFRPSkill[];
    stats : WFRPStat[];
}

// ---------------------------------------------------------------------------------------------------------------------
