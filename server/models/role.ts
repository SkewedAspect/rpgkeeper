//----------------------------------------------------------------------------------------------------------------------
// Role
//----------------------------------------------------------------------------------------------------------------------

import { shortID } from '../utils/misc';
import { AppError } from '../errors';

// Logger
import logging from 'trivial-logging';
const logger = logging.loggerFor(module);

//----------------------------------------------------------------------------------------------------------------------

export interface RoleLike {
    id ?: string;
    name : string;
    permissions ?: string[];
}

export interface RoleDBRecord extends Omit<RoleLike, 'permissions'>
{
    role_id ?: string,
    permissions : string;
}

//----------------------------------------------------------------------------------------------------------------------

export class Role implements RoleLike
{
    #id ?: string;

    public readonly permissions : string[] = [];

    public name = '';

    constructor(definition ?: RoleLike)
    {
        if(definition)
        {
            this.#id = definition.id;
            this.name = definition.name;
            this.permissions = definition.permissions ?? [];
        } // end if
    } // end constructor

    //------------------------------------------------------------------------------------------------------------------
    // Properties
    //------------------------------------------------------------------------------------------------------------------

    get id() : string | undefined
    {
        return this.#id;
    }

    //------------------------------------------------------------------------------------------------------------------

    public generateID() : string
    {
        if(!this.#id)
        {
            return this.#id = shortID();
        }
        else
        {
            throw new AppError('Unable to change the ID of an existing role.', 'CannotChangeRoleID');
        } // end if
    } // end generateID

    //------------------------------------------------------------------------------------------------------------------
    // Serialization
    //------------------------------------------------------------------------------------------------------------------

    public toJSON() : RoleLike
    {
        return {
            id: this.id,
            name: this.name,
            permissions: this.permissions
        };
    } // end

    public toDB() : RoleDBRecord
    {
        const { id, ...jsonObj } = this.toJSON();
        return {
            ...jsonObj,
            role_id: id,
            permissions: JSON.stringify(this.permissions)
        };
    } // end toDB

    //------------------------------------------------------------------------------------------------------------------
    // Deserialization
    //------------------------------------------------------------------------------------------------------------------

    static fromDB(roleRecord : RoleDBRecord) : Role
    {
        let permissions;
        try
        {
            permissions = JSON.parse(roleRecord.permissions);
        }
        catch (error)
        {
            permissions = [];
            logger.warn(`Failed to parse role permissions on role ${ roleRecord.id }:`, error.stack);
        } // end if

        return new Role({ ...roleRecord, permissions });
    } // end fromDB

    static fromJSON(jsonObj : RoleLike) : Role
    {
        if(jsonObj instanceof Role)
        {
            return jsonObj;
        } // end if

        return new Role(jsonObj);
    } // end fromJSON
} // end Role

//----------------------------------------------------------------------------------------------------------------------
