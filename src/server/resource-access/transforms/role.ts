// ---------------------------------------------------------------------------------------------------------------------
// Role Database Transform
// ---------------------------------------------------------------------------------------------------------------------

import { Role } from '../../../common/interfaces/models/role';

// ---------------------------------------------------------------------------------------------------------------------

export interface RoleDBSchema
{
    role_id : number;
    name : string;
    permissions : string;
}

// ---------------------------------------------------------------------------------------------------------------------

export function toDB(role : Role) : RoleDBSchema
{
    return {
        role_id: role.id,
        name: role.name,
        permissions: JSON.stringify(role.permissions ?? []),
    };
}

export function fromDB(role : RoleDBSchema) : Role
{
    return {
        id: role.role_id,
        name: role.name,
        permissions: JSON.parse(role.permissions) ?? [],
    };
}

// ---------------------------------------------------------------------------------------------------------------------
