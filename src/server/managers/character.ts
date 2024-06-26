//----------------------------------------------------------------------------------------------------------------------
// CharacterManager
//----------------------------------------------------------------------------------------------------------------------

// Managers
import * as notebookMan from './notebook';
import systemMan from './system';

// Models
import { Character } from '../models/character';

// Utils
import { getDB } from '../utils/database';
import { MultipleResultsError, NotFoundError } from '../errors';
import { FilterToken } from '../routes/utils';
import { applyFilters } from '../knex/utils';
import { shortID } from '../utils/misc';
import { broadcast } from '../utils/sio';

//----------------------------------------------------------------------------------------------------------------------

export async function get(id : string) : Promise<Character>
{
    const db = await getDB();
    const characters = await db('character as char')
        .select(
            'char.character_id as id',
            'char.system',
            'char.name',
            'char.description',
            'char.portrait',
            'char.thumbnail',
            'char.color',
            'char.campaign',
            'char.details',
            'acc.account_id as accountID',
            'note.note_id as noteID'
        )
        .join('note', 'note.note_id', '=', 'char.note_id')
        .join('account as acc', 'acc.account_id', '=', 'char.account_id')
        .where({ 'char.character_id': id });

    if(characters.length > 1)
    {
        throw new MultipleResultsError('character');
    }
    else if(characters.length === 0)
    {
        throw new NotFoundError(`No character with id '${ id }' found.`);
    }
    else
    {
        const char = Character.fromDB(characters[0]);
        return systemMan.validateCharacterDetails(char);
    }
}

export async function list(filters : Record<string, FilterToken> = {}) : Promise<Character[]>
{
    const db = await getDB();
    let query = db('character as char')
        .select(
            'char.character_id as id',
            'char.system',
            'char.name',
            'char.description',
            'char.portrait',
            'char.thumbnail',
            'char.color',
            'char.campaign',
            'char.details',
            'acc.account_id as accountID',
            'note.note_id as noteID'
        )
        .join('note', 'note.note_id', '=', 'char.note_id')
        .join('account as acc', 'acc.account_id', '=', 'char.account_id');

    // Apply any filters
    query = applyFilters(query, filters);

    return Promise.all((await query)
        .map(Character.fromDB)
        .map(async(char) => systemMan.validateCharacterDetails(char)));
}

export async function add(accountID : string, newCharacter : Record<string, unknown>) : Promise<Character>
{
    const notebook = await notebookMan.add();

    const char = Character.fromJSON({ ...newCharacter, id: shortID(), noteID: notebook.id, accountID });

    const db = await getDB();
    await db('character')
        .insert(char.toDB());

    // We know this is a string since it's set above.
    return get(char.id as string);
}

export async function update(charID : string, updateChar : Record<string, unknown>) : Promise<Character>
{
    const char = await get(charID);

    // Mix the current character with the allowed updates.
    const allowedUpdate = {
        ...char.toJSON(),
        name: updateChar.name,
        description: updateChar.description,
        portrait: updateChar.portrait,
        thumbnail: updateChar.thumbnail,
        color: updateChar.color,
        campaign: updateChar.campaign,
        details: updateChar.details
    };

    // Make a new character object
    const newCharacter = Character.fromJSON(allowedUpdate);

    // Update the database
    const db = await getDB();
    await db('character')
        .update(newCharacter.toDB())
        .where({ character_id: charID });

    const newChar = await get(charID);

    // Broadcast the update
    await broadcast('/characters', {
        type: 'update',
        resource: charID,
        payload: newChar.toJSON()
    });

    // Return the updated record
    return newChar;
}

export async function remove(charID : string) : Promise<{ status : 'ok' }>
{
    const db = await getDB();
    await db('character')
        .where({ character_id: charID })
        .delete();

    // Broadcast the update
    await broadcast('/characters', {
        type: 'remove',
        resource: charID
    });

    return { status: 'ok' };
}

//----------------------------------------------------------------------------------------------------------------------
