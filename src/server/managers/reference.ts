//----------------------------------------------------------------------------------------------------------------------
// ReferenceManager
//----------------------------------------------------------------------------------------------------------------------

// Models
import { Reference } from '../../common/interfaces/models/reference.js';

// Resource Access
import * as referenceRA from '../resource-access/reference.js';

// Utilities
import { FilterToken } from '../routes/utils/index.js';

//----------------------------------------------------------------------------------------------------------------------

export async function list(filters : Record<string, FilterToken>, tableName : string) : Promise<Reference[]>
{
    return referenceRA.list(filters, tableName);
}

//----------------------------------------------------------------------------------------------------------------------
