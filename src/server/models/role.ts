//----------------------------------------------------------------------------------------------------------------------
// Role
//----------------------------------------------------------------------------------------------------------------------

import * as JsonDecoder from 'decoders';

// Decoders
import { roleJsonDecoder, roleRecDecoder } from '../decoders/role';

// Models
import { RoleOptions } from '../../common/interfaces/models/role';

//----------------------------------------------------------------------------------------------------------------------

export class Role
{
    public readonly id : number;
    public readonly name : string;
    public permissions : string[] = [];

    constructor(options : RoleOptions)
    {
        this.id = options.id;
        this.name = options.name;
        this.permissions = options.permissions ?? [];
    }

    //------------------------------------------------------------------------------------------------------------------
    // Serialization
    //------------------------------------------------------------------------------------------------------------------

    public toJSON() : Record<string, unknown>
    {
        return {
            id: this.id,
            name: this.name,
            permissions: this.permissions
        };
    }

    public toDB() : Record<string, unknown>
    {
        const { id, ...jsonObj } = this.toJSON();
        return {
            ...jsonObj,
            role_id: id,
            permissions: JSON.stringify(this.permissions)
        };
    }

    //------------------------------------------------------------------------------------------------------------------
    // Deserialization
    //------------------------------------------------------------------------------------------------------------------

    static fromDB(roleRecord : Record<string, unknown>) : Role
    {
        const decoder = JsonDecoder.guard(roleRecDecoder);
        return new Role(decoder(roleRecord));
    }

    static fromJSON(jsonObj : Record<string, unknown>) : Role
    {
        const decoder = JsonDecoder.guard(roleJsonDecoder);
        return new Role(decoder(jsonObj));
    }
}

//----------------------------------------------------------------------------------------------------------------------
