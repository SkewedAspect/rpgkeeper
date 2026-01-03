//----------------------------------------------------------------------------------------------------------------------
// ReferenceManager
//----------------------------------------------------------------------------------------------------------------------

// Models
import type { Reference } from '@rpgk/core/models/reference';

// Resource Access
import * as referenceRA from '../resource-access/reference.ts';

// Utilities
import type { FilterToken } from '../routes/utils/index.ts';

//----------------------------------------------------------------------------------------------------------------------

export async function list(filters : Record<string, FilterToken>, tableName : string) : Promise<Reference[]>
{
    return referenceRA.list(filters, tableName);
}

//----------------------------------------------------------------------------------------------------------------------
