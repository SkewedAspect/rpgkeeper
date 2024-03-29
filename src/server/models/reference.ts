//----------------------------------------------------------------------------------------------------------------------
// Reference
//----------------------------------------------------------------------------------------------------------------------

import * as JsonDecoder from 'decoders';

// Decoders
import { referenceJsonDecoder, referenceRecDecoder } from '../decoders/reference';

// Models
import { ReferenceOptions } from '../../common/interfaces/models/reference';

//----------------------------------------------------------------------------------------------------------------------

export class Reference
{
    public readonly abbr : string;
    public readonly name : string;
    public readonly productCode : string;

    constructor(options : ReferenceOptions)
    {
        this.abbr = options.abbr;
        this.name = options.name;
        this.productCode = options.productCode;
    }

    //------------------------------------------------------------------------------------------------------------------
    // Serialization
    //------------------------------------------------------------------------------------------------------------------

    public toJSON() : Record<string, unknown>
    {
        return {
            abbr: this.abbr,
            name: this.name,
            productCode: this.productCode
        };
    } // end

    public toDB() : Record<string, unknown>
    {
        return this.toJSON();
    }

    //------------------------------------------------------------------------------------------------------------------
    // Deserialization
    //------------------------------------------------------------------------------------------------------------------

    static fromDB(referenceRecord : Record<string, unknown>) : Reference
    {
        const decoder = JsonDecoder.guard(referenceRecDecoder);
        return new Reference(decoder(referenceRecord));
    }

    static fromJSON(jsonObj : Record<string, unknown>) : Reference
    {
        const decoder = JsonDecoder.guard(referenceJsonDecoder);
        return new Reference(decoder(jsonObj));
    }
}

//----------------------------------------------------------------------------------------------------------------------
