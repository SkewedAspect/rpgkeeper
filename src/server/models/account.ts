//----------------------------------------------------------------------------------------------------------------------
// Account
//----------------------------------------------------------------------------------------------------------------------

import * as JsonDecoder from 'decoders';

// Models
import { AccountOptions, AccountSettings } from '../../common/interfaces/models/account';

// Decoders
import { accountJsonDecoder, accountRecDecoder } from '../decoders/account';

//----------------------------------------------------------------------------------------------------------------------

export class Account
{
    public readonly id : string;
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
    }

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
            groups: this.groups,
            settings: this.settings
        };
    } // end

    public toDB() : Record<string, unknown>
    {
        const { groups, ...jsonObj } = this.toJSON();
        return {
            ...jsonObj,
            permissions: JSON.stringify(this.permissions),
            settings: JSON.stringify(this.settings)
        };
    }

    //------------------------------------------------------------------------------------------------------------------
    // Deserialization
    //------------------------------------------------------------------------------------------------------------------

    static fromDB(accountRecord : Record<string, unknown>) : Account
    {
        const decoder = JsonDecoder.guard(accountRecDecoder);
        return new Account(decoder(accountRecord));
    }

    static fromJSON(jsonObj : Record<string, unknown>) : Account
    {
        const decoder = JsonDecoder.guard(accountJsonDecoder);
        return new Account(decoder(jsonObj));
    }
}

//----------------------------------------------------------------------------------------------------------------------
