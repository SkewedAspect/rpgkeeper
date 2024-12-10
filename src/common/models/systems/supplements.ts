// ---------------------------------------------------------------------------------------------------------------------
// System Supplements
// ---------------------------------------------------------------------------------------------------------------------

export type SupplementScope = 'public' | 'user';

export interface Supplement
{
    id ?: number | string;
    name : string;
    owner ?: string;
    scope : SupplementScope;
    reference : string;
    official : boolean;
}

export interface SupplementInst
{
    id : number | string;
}

// ---------------------------------------------------------------------------------------------------------------------
