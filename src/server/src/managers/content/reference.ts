//----------------------------------------------------------------------------------------------------------------------
// Reference Sub-Manager
//----------------------------------------------------------------------------------------------------------------------

// Models
import type { Reference } from '@rpgk/core/models/reference';

// Resource Access
import type { EntityResourceAccess } from '../../resource-access/index.ts';

// Utilities
import type { FilterToken } from '../../routes/utils/index.ts';

//----------------------------------------------------------------------------------------------------------------------

export class ReferenceSubManager
{
    private entities : EntityResourceAccess;

    constructor(entities : EntityResourceAccess)
    {
        this.entities = entities;
    }

    //------------------------------------------------------------------------------------------------------------------

    async list(filters : Record<string, FilterToken>, tableName : string) : Promise<Reference[]>
    {
        return this.entities.reference.list(filters, tableName);
    }
}

//----------------------------------------------------------------------------------------------------------------------
