//----------------------------------------------------------------------------------------------------------------------
// Character
//----------------------------------------------------------------------------------------------------------------------

import * as JsonDecoder from 'decoders';

// Decoders
import { characterJsonDecoder, characterRecDecoder } from '../decoders/character';

//----------------------------------------------------------------------------------------------------------------------

export interface CharacterOptions<SystemDetails extends Record<string, unknown> = Record<string, unknown>> {
    id : string;
    system : string;
    name : string;
    description ?: string;
    portrait ?: string;
    thumbnail ?: string;
    color ?: string;
    campaign ?: string;
    accountID : string;
    noteID : string;
    details : SystemDetails
}

//----------------------------------------------------------------------------------------------------------------------

export class Character<SystemDetails extends Record<string, unknown> = Record<string, unknown>>
{
    public readonly id : string;
    public readonly system : string;
    public readonly accountID : string;
    public readonly noteID : string;

    public name : string;
    public description ?: string;
    public portrait ?: string;
    public thumbnail ?: string;
    public color ?: string;
    public campaign ?: string;
    public details : SystemDetails;

    constructor(options : CharacterOptions<SystemDetails>)
    {
        this.id = options.id;
        this.system = options.system;
        this.accountID = options.accountID;
        this.noteID = options.noteID;
        this.name = options.name;
        this.description = options.description;
        this.portrait = options.portrait;
        this.thumbnail = options.thumbnail;
        this.color = options.color;
        this.campaign = options.campaign;
        this.details = options.details;
    } // end constructor

    //------------------------------------------------------------------------------------------------------------------
    // Serialization
    //------------------------------------------------------------------------------------------------------------------

    public toJSON() : Record<string, unknown>
    {
        return {
            id: this.id,
            system: this.system,
            accountID: this.accountID,
            noteID: this.noteID,
            name: this.name,
            description: this.description,
            portrait: this.portrait,
            thumbnail: this.thumbnail,
            color: this.color,
            campaign: this.campaign,
            details: this.details
        };
    } // end

    public toDB() : Record<string, unknown>
    {
        const { id, accountID, noteID, ...jsonObj } = this.toJSON();
        return {
            ...jsonObj,
            hash_id: id,
            account_id: accountID,
            note_id: noteID
        };
    } // end toDB

    //------------------------------------------------------------------------------------------------------------------
    // Deserialization
    //------------------------------------------------------------------------------------------------------------------

    static fromDB(characterRecord : Record<string, unknown>) : Character
    {
        const decoder = JsonDecoder.guard(characterRecDecoder);
        return new Character(decoder(characterRecord));
    } // end fromDB

    static fromJSON(jsonObj : Record<string, unknown>) : Character
    {
        const decoder = JsonDecoder.guard(characterJsonDecoder);
        return new Character(decoder(jsonObj));
    } // end fromJSON
} // end Character

//----------------------------------------------------------------------------------------------------------------------
