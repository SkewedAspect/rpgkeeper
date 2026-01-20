//----------------------------------------------------------------------------------------------------------------------
// Fate System Models
//----------------------------------------------------------------------------------------------------------------------

export interface FateAspect
{
    type : 'aspect' | 'high concept' | 'trouble' | 'consequence';
    detail : string;
    healing ?: boolean;
    value ?: number;
}

export interface FatePoints
{
    current : number;
    refresh : number;
}

export interface FateSkill
{
    name : string;
    rank : number;
}

export interface FateStunt
{
    title : string;
    description : string;
}

export type FateStress = [ boolean, boolean, boolean, boolean ];

export interface FateSystemDetails
{
    aspects : FateAspect[];
    extras : string;
    fatePoints : FatePoints;
    mentalStress : FateStress;
    physicalStress : FateStress;
    skills : FateSkill[];
    stunts : FateStunt[];
}

//----------------------------------------------------------------------------------------------------------------------
