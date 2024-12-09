// ---------------------------------------------------------------------------------------------------------------------
// Reference Database Transform
// ---------------------------------------------------------------------------------------------------------------------

import { Reference } from '../../../common/interfaces/models/reference.js';

// ---------------------------------------------------------------------------------------------------------------------

export interface ReferenceDBSchema 
{
    abbr : string;
    name : string;
    productCode : string;
}

// ---------------------------------------------------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------------------------------------------------
