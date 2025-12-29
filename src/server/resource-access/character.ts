//----------------------------------------------------------------------------------------------------------------------
// Character Resource Access
//----------------------------------------------------------------------------------------------------------------------

// Models
import { Character } from '@rpgk/core';

// Transforms
import * as CharTransforms from './transforms/character.js';

// Resource Access
import systemRA from '../managers/system.js';

// Utils
import { getDB } from '../utils/database.js';
import { FilterToken } from '../routes/utils/index.js';
import { applyFilters } from '../knex/utils.js';
import { shortID, snakeCaseKeys } from '../utils/misc.js';

import { MultipleResultsError, NotFoundError } from '../errors.js';

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
        .update({ ...newCharacter, updated: db.fn.now() })
        .where({ character_id: charID });

    // Return the updated record
    return await get(charID);
}

export async function remove(charID : string) : Promise<{ status : 'ok' }>
{
    const db = await getDB();
    await db('character')
        .where({ character_id: charID })
        .delete();

    return { status: 'ok' };
}

//----------------------------------------------------------------------------------------------------------------------
