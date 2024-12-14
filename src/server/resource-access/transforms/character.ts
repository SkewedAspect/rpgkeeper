// ---------------------------------------------------------------------------------------------------------------------
// Character Database Transform
// ---------------------------------------------------------------------------------------------------------------------

// Models
import { Character } from '../../../common/models/index.js';

// Utils
import { fromDBTimestamp } from './utils/timestamp.js';
import { fromJSON, toJSON } from './utils/json.js';

// ---------------------------------------------------------------------------------------------------------------------

export interface CharacterDBSchema extends Omit<
    Character, 'id' | 'details' | 'accountID' | 'noteID' | 'created' | 'updated'
>
{
    character_id : string;
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
        details: toJSON(details),
        note_id: noteID,
        account_id: accountID,
    };
}

export function fromDB(character : CharacterDBSchema) : Character
{
    const { character_id, details, note_id, account_id, created, updated, ...rest } = character;
    return {
        ...rest,
        id: character_id,
        details: fromJSON(details) ?? {},
        noteID: note_id,
        accountID: account_id,
        created: fromDBTimestamp(created),
        updated: fromDBTimestamp(updated),
    };
}

// ---------------------------------------------------------------------------------------------------------------------
