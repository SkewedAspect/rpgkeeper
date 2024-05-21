//----------------------------------------------------------------------------------------------------------------------
// ReferenceManager
//----------------------------------------------------------------------------------------------------------------------

// Models
import { Reference } from '../../common/interfaces/models/reference';

// Resource Access
import * as referenceRA from '../resource-access/reference';

// Utilities
import { FilterToken } from '../routes/utils';

//----------------------------------------------------------------------------------------------------------------------

export async function list(filters : Record<string, FilterToken>, tableName : string) : Promise<Reference[]>
{
    return referenceRA.list(filters, tableName);
}

//----------------------------------------------------------------------------------------------------------------------
