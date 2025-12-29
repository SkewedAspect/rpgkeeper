//----------------------------------------------------------------------------------------------------------------------
// Character
//----------------------------------------------------------------------------------------------------------------------

export type SystemDetails = object;

export interface Character<Details extends SystemDetails = SystemDetails>
{
    id : string | null;
    system : string;
    name : string;
    description ?: string;
    portrait ?: string;
    thumbnail ?: string;
    color ?: string;
    campaign ?: string;
    accountID : string;
    noteID : string;
    details : Details;
    created : number;
    updated : number;
}

//----------------------------------------------------------------------------------------------------------------------
