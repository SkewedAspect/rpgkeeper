//----------------------------------------------------------------------------------------------------------------------
// Supplement
//----------------------------------------------------------------------------------------------------------------------

export interface Supplement
{
    id ?: string;
    name : string;
    owner ?: string;
    official : boolean;

    // Allow additional properties for system-specific supplements
    [ key : string ] : unknown;
}

export interface SupplementInst
{
    id : string;
}

//----------------------------------------------------------------------------------------------------------------------
