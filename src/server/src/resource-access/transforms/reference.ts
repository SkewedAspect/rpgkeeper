//----------------------------------------------------------------------------------------------------------------------
// Reference Database Transform
//----------------------------------------------------------------------------------------------------------------------

import type { Reference } from '@rpgk/core/models/reference';

//----------------------------------------------------------------------------------------------------------------------

export interface ReferenceDBSchema
{
    abbr : string;
    name : string;
    productCode : string;
}

//----------------------------------------------------------------------------------------------------------------------

export function toDB(reference : Reference) : ReferenceDBSchema
{
    return {
        abbr: reference.abbr,
        name: reference.name,
        productCode: reference.productCode,
    };
}

export function fromDB(reference : ReferenceDBSchema) : Reference
{
    return {
        abbr: reference.abbr,
        name: reference.name,
        productCode: reference.productCode,
    };
}

//----------------------------------------------------------------------------------------------------------------------
