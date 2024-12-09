//----------------------------------------------------------------------------------------------------------------------
// Character Manager
//----------------------------------------------------------------------------------------------------------------------

// Models
import { Character } from '../../common/interfaces/models/character';

// Transforms
import * as CharTransforms from './transforms/character';

// Resource Access
import systemRA from './system';

// Utils
import { getDB } from '../utils/database';
import { FilterToken } from '../routes/utils';
import { applyFilters } from '../knex/utils';
import { shortID, snakeCaseKeys } from '../utils/misc';
import { broadcast } from '../utils/sio';

import { MultipleResultsError, NotFoundError } from '../errors';

//----------------------------------------------------------------------------------------------------------------------

export async function get(id : string) : Promise<Character>
{
    const db = await getDB();
    const characters = await db('character as char')
        .select()
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
        const char = CharTransforms.fromDB(characters[0]);
        return systemRA.validateCharacterDetails(char);
    }
}

export async function list(filters : Record<string, FilterToken> = {}) : Promise<Character[]>
{
    const db = await getDB();
    let query = db('character as char')
        .select();

    // Snake case the filters
    filters = snakeCaseKeys(filters);

    // Apply any filters
    query = applyFilters(query, filters);

    return Promise.all((await query)
        .map(CharTransforms.fromDB)
        .map(async(char) => systemRA.validateCharacterDetails(char)));
}

export async function add(accountID : string, newCharacter : Omit<Character, 'id'>) : Promise<Character>
{
    const char = CharTransforms.toDB({ ...newCharacter, id: shortID(), accountID });

    const db = await getDB();
    await db('character')
        .insert(char);

    // We know this is a string since it's set above.
    return get(char.character_id);
}

export async function update(charID : string, updateChar : Partial<Character>) : Promise<Character>
{
    const char = await get(charID);

    // Mix the current character with the allowed updates.
    const allowedUpdate = {
        ...char,
        name: updateChar.name ?? char.name,
        description: updateChar.description ?? char.description,
        portrait: updateChar.portrait ?? char.portrait,
        thumbnail: updateChar.thumbnail ?? char.thumbnail,
        color: updateChar.color ?? char.color,
        campaign: updateChar.campaign ?? char.campaign,
        details: updateChar.details ?? char.details,
    };

    // Make a new character object
    const newCharacter = CharTransforms.toDB(allowedUpdate);

    // Update the database
    const db = await getDB();
    await db('character')
        .update(newCharacter)
        .where({ character_id: charID });

    const newChar = await get(charID);

    // Broadcast the update
    await broadcast('/characters', {
        type: 'update',
        resource: charID,
        payload: newChar,
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
        resource: charID,
    });

    return { status: 'ok' };
}

//----------------------------------------------------------------------------------------------------------------------
