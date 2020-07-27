//----------------------------------------------------------------------------------------------------------------------
// Account
//----------------------------------------------------------------------------------------------------------------------

import * as JsonDecoder from 'decoders';

// Decoders
import { accountJsonDecoder, accountRecDecoder } from '../decoders/account';

//----------------------------------------------------------------------------------------------------------------------

interface AccountOptions {
    id : string;
    email : string;
    name ?: string;
    avatar ?: string;
    permissions ?: string[];
    groups ?: string[];
    settings ?: AccountSettings;
    created : number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AccountSettings {
    // TODO: Figure out some settings...
}

//----------------------------------------------------------------------------------------------------------------------

export class Account
{
    public readonly id : string;
    public readonly created : number;
    public readonly email : string = '';

    public name = '';
    public avatar = '';
    public permissions : string[] = [];
    public groups : string[] = [];
    public settings : AccountSettings = {};

    constructor(options : AccountOptions)
    {
        this.id = options.id;
        this.email = options.email;
        this.name = options.name ?? options.email.split('@')[0];
        this.avatar = options.avatar || '';
        this.permissions = options.permissions ?? [];
        this.groups = options.groups ?? [];
        this.settings = options.settings ?? {};
        this.created = options.created;
    } // end constructor

    //------------------------------------------------------------------------------------------------------------------
    // Serialization
    //------------------------------------------------------------------------------------------------------------------

    public toJSON() : Record<string, unknown>
    {
        return {
            id: this.id,
            email: this.email,
            name: this.name,
            avatar: this.avatar,
            permissions: this.permissions,
            settings: this.settings,
            created: this.created
        };
    } // end

    public toDB() : Record<string, unknown>
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

    static fromDB(accountRecord : Record<string, unknown>) : Account
    {
        const decoder = JsonDecoder.guard(accountRecDecoder);
        return new Account(decoder(accountRecord));
    } // end fromDB

    static fromJSON(jsonObj : Record<string, unknown>) : Account
    {
        const decoder = JsonDecoder.guard(accountJsonDecoder);
        return new Account(decoder(jsonObj));
    } // end fromJSON
} // end Account

//----------------------------------------------------------------------------------------------------------------------
