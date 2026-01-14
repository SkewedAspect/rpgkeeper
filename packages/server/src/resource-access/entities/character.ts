//----------------------------------------------------------------------------------------------------------------------
// Character Resource Access
//----------------------------------------------------------------------------------------------------------------------

import type { Knex } from 'knex';

// Models
import type { Character, SavedCharacter } from '@rpgk/core';

// Transforms
import * as CharTransforms from '../transforms/character.ts';

// Utils
import type { FilterToken } from '../../routes/utils/index.ts';
import { applyFilters } from '../../knex/utils.ts';
import { shortID, snakeCaseKeys } from '../../utils/misc.ts';

// Errors
import { MultipleResultsError, NotFoundError } from '../../errors.ts';

//----------------------------------------------------------------------------------------------------------------------

export class CharacterResourceAccess
{
    private db : Knex;

    constructor(db : Knex)
    {
        this.db = db;
    }

    //------------------------------------------------------------------------------------------------------------------

    async get(id : string) : Promise<SavedCharacter>
    {
        const characters = await this.db('character as char')
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
            return CharTransforms.fromDB(characters[0]) as SavedCharacter;
        }
    }

    async list(filters : Record<string, FilterToken> = {}) : Promise<SavedCharacter[]>
    {
        let query = this.db('character as char')
            .select();

        // Snake case the filters
        filters = snakeCaseKeys(filters);

        // Apply any filters
        query = applyFilters(query, filters);

        return (await query).map((row) => CharTransforms.fromDB(row) as SavedCharacter);
    }

    async add(accountID : string, newCharacter : Character) : Promise<SavedCharacter>
    {
        const char = CharTransforms.toDB({ ...newCharacter, id: shortID(), accountID });

        await this.db('character')
            .insert(char);

        // We know this is a string since it's set above.
        return this.get(char.character_id);
    }

    async update(charID : string, updateChar : Partial<Character>) : Promise<SavedCharacter>
    {
        const char = await this.get(charID);

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
        await this.db('character')
            .update({ ...newCharacter, updated: this.db.fn.now() })
            .where({ character_id: charID });

        // Return the updated record
        return await this.get(charID);
    }

    async remove(charID : string) : Promise<{ status : 'ok' }>
    {
        await this.db('character')
            .where({ character_id: charID })
            .delete();

        return { status: 'ok' };
    }
}

//----------------------------------------------------------------------------------------------------------------------
