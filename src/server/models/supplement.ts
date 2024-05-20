//----------------------------------------------------------------------------------------------------------------------
// Supplement
//----------------------------------------------------------------------------------------------------------------------

import * as JsonDecoder from 'decoders';

// Decoders
import { getSupplementDecoder } from '../decoders/supplement';

// Models
import { SupplementOptions } from '../../common/interfaces/models/supplement';

// Utils
import { snakeCaseKeys } from '../utils/misc';

//----------------------------------------------------------------------------------------------------------------------

export class Supplement
{
    public readonly id : number;
    public readonly name : string;

    public owner ?: string;
    public scope : 'public' | 'user' = 'user';
    public official = false;
    public record : Record<string, unknown> = {};

    constructor(options : SupplementOptions)
    {
        // So we store the full thing as a record, to make serialization easier.
        this.record = options;

        // However, we pull some parts to the top level to make working with the supplement API portions easier.
        this.id = options.id;
        this.name = options.name;
        this.owner = options.owner;
        this.scope = options.scope;
        this.official = options.official;
    }

    //------------------------------------------------------------------------------------------------------------------
    // Serialization
    //------------------------------------------------------------------------------------------------------------------

    public toJSON() : Record<string, unknown>
    {
        return {
            ...this.record,
            id: this.id,
            name: this.name,
            owner: this.owner,
            scope: this.scope,
            official: this.official
        };
    }

    public toDB() : Record<string, unknown>
    {
        const { id, ...suppDef } = snakeCaseKeys(this.toJSON());

        // And nested keys need to become json strings
        for(const key in suppDef)
        {
            const value = suppDef[key];

            if(typeof value === 'object' && value !== null)
            {
                suppDef[key] = JSON.stringify(value);
            }
        }

        return {
            ...suppDef,
            owner: this.owner ?? null
        };
    }

    //------------------------------------------------------------------------------------------------------------------
    // Deserialization
    //------------------------------------------------------------------------------------------------------------------

    static fromDB(system : string, type : string, supplementRecord : Record<string, unknown>) : Supplement
    {
        const decoder = JsonDecoder.guard(getSupplementDecoder(system, type) as JsonDecoder.Decoder<SupplementOptions>);
        return new Supplement(decoder(supplementRecord));
    }

    static fromJSON(system : string, type : string, jsonObj : Record<string, unknown>) : Supplement
    {
        const decoder = JsonDecoder.guard(getSupplementDecoder(system, type) as JsonDecoder.Decoder<SupplementOptions>);
        return new Supplement(decoder(jsonObj));
    }
}

//----------------------------------------------------------------------------------------------------------------------
