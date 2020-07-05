//----------------------------------------------------------------------------------------------------------------------
// Account
//----------------------------------------------------------------------------------------------------------------------

import { shortID } from '../utils/misc';
import { AppError } from '../api/errors';

// Logger
import logging from 'trivial-logging';
const logger = logging.loggerFor(module);

//----------------------------------------------------------------------------------------------------------------------

export interface AccountDefinition {
    id ?: string;
    email : string;
    name : string;
    avatar : string;
    permissions ?: string[];
    groups ?: string[];
    settings ?: AccountSettings;
    created ?: number;
}

export interface AccountDBRecord extends Omit<Omit<AccountDefinition, 'permissions'>, 'settings'>
{
    hash_id ?: string,
    permissions : string;
    settings : string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AccountSettings {
    // TODO: Figure out some settings...
}

//----------------------------------------------------------------------------------------------------------------------

export class Account implements AccountDefinition
{
    #id ?: string;
    #created ?: number;

    public readonly email : string = '';
    public readonly permissions : string[] = [];
    public readonly groups : string[] = [];
    public readonly settings : AccountSettings = {};

    public name = '';
    public avatar = '';

    constructor(definition ?: AccountDefinition)
    {
        if(definition)
        {
            this.#id = definition.id;
            this.email = definition.email;
            this.name = definition.name;
            this.avatar = definition.avatar;
            this.permissions = definition.permissions ?? [];
            this.groups = definition.groups ?? [];
            this.settings = definition.settings ?? {};
            this.#created = definition.created;
        } // end if
    } // end constructor

    //------------------------------------------------------------------------------------------------------------------
    // Properties
    //------------------------------------------------------------------------------------------------------------------

    get id() : string | undefined
    {
        return this.#id;
    }

    get created() : number | undefined
    {
        return this.#created;
    }

    //------------------------------------------------------------------------------------------------------------------

    public generateID() : string
    {
        if(!this.#id)
        {
            this.#created = Date.now();
            return this.#id = shortID();
        }
        else
        {
            throw new AppError('Unable to change the ID of an existing account.', 'CannotChangeAccountID');
        } // end if
    } // end generateID

    //------------------------------------------------------------------------------------------------------------------
    // Serialization
    //------------------------------------------------------------------------------------------------------------------

    public toJSON() : AccountDefinition
    {
        return {
            id: this.id,
            email: this.email,
            name: this.name,
            avatar: this.avatar,
            created: this.created
        };
    } // end

    public toDB() : AccountDBRecord
    {
        const { id, ...jsonObj } = this.toJSON();
        return {
            ...jsonObj,
            hash_id: id,
            permissions: JSON.stringify(this.permissions),
            settings: JSON.stringify(this.settings)
        };
    } // end toDB

    //------------------------------------------------------------------------------------------------------------------
    // Deserialization
    //------------------------------------------------------------------------------------------------------------------

    static fromDB(accountRecord : AccountDBRecord) : Account
    {
        let permissions;
        try
        {
            permissions = JSON.parse(accountRecord.permissions);
        }
        catch (error)
        {
            permissions = [];
            logger.warn(`Failed to parse account permissions on account ${ accountRecord.id }:`, error.stack);
        } // end if

        let settings;
        try
        {
            settings = JSON.parse(accountRecord.settings);
        }
        catch (error)
        {
            settings = [];
            logger.warn(`Failed to parse account settings on account ${ accountRecord.id }:`, error.stack);
        } // end if

        return new Account({ ...accountRecord, permissions, settings });
    } // end fromDB

    static fromJSON(jsonObj : AccountDefinition) : Account
    {
        return new Account(jsonObj);
    } // end fromJSON
} // end Account

//----------------------------------------------------------------------------------------------------------------------
