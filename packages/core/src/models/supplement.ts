//----------------------------------------------------------------------------------------------------------------------
// Supplement
//----------------------------------------------------------------------------------------------------------------------

export interface Supplement
{
    id ?: string;
    name : string;
    owner ?: string;
    official : boolean;
    reference ?: string;

    // Allow additional properties for system-specific supplements
    [ key : string ] : unknown;
}

export interface SupplementInst
{
    id : string;
}

//----------------------------------------------------------------------------------------------------------------------
