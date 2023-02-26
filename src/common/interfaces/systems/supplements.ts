// ---------------------------------------------------------------------------------------------------------------------
// System Supplements
// ---------------------------------------------------------------------------------------------------------------------

import { ReferenceOptions } from '../../../server/models/reference';

// ---------------------------------------------------------------------------------------------------------------------

export type SupplementScope = 'public' | 'user';

export type Reference = ReferenceOptions;

export interface Supplement
{
    id ?: number;
    name : string;
    owner ?: string;
    scope : SupplementScope;
    reference : string;
    official : boolean;
}

// ---------------------------------------------------------------------------------------------------------------------
