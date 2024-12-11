// ---------------------------------------------------------------------------------------------------------------------
// Character Database Transform
// ---------------------------------------------------------------------------------------------------------------------

import { Character } from '../../../common/models/index.js';

// ---------------------------------------------------------------------------------------------------------------------

export interface CharacterDBSchema
{
    character_id : string;
    system : string;
    name : string;
    description ?: string | null;
    portrait ?: string | null;
    thumbnail ?: string | null;
    color ?: string | null;
    campaign ?: string | null;
    details : string | null;
    note_id : string;
    account_id : string;
    created : string;
    updated : string;
}

// ---------------------------------------------------------------------------------------------------------------------

export function toDB(character : Character) : Omit<CharacterDBSchema, 'created' | 'updated'>
{
    const { id, details, accountID, noteID, created, updated, ...rest } = character;
    return {
        ...rest,
        character_id: id,
        details: JSON.stringify(details),
        note_id: noteID,
        account_id: accountID,
    };
}

export function fromDB(character : CharacterDBSchema) : Character
{
    return {
        id: character.character_id,
        system: character.system,
        name: character.name,
        description: character.description,
        portrait: character.portrait,
        thumbnail: character.thumbnail,
        color: character.color,
        campaign: character.campaign,
        details: JSON.parse(character.details),
        noteID: character.note_id,
        accountID: character.account_id,
        created: (new Date(character.created)).getTime() / 1000,
        updated: (new Date(character.updated)).getTime() / 1000,
    };
}

// ---------------------------------------------------------------------------------------------------------------------
