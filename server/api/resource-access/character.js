//----------------------------------------------------------------------------------------------------------------------
// CharacterResourceAccess
//----------------------------------------------------------------------------------------------------------------------

import _ from 'lodash';

// Managers
import * as dbMan from '../../managers/database';

// Utilities
import { shortID } from '../../utils/misc';
import { applyFilters } from '../../knex/utils';

// Errors
import { MultipleResultsError, NotFoundError } from '../errors';

// Logger
import logging from 'trivial-logging';
const logger = logging.loggerFor(module);

//----------------------------------------------------------------------------------------------------------------------

class CharacterResourceAccess
{
    //------------------------------------------------------------------------------------------------------------------
    // Utility Functions
    //------------------------------------------------------------------------------------------------------------------

    _parseCharacter(character)
    {
        // Parse details JSON
        if(character.details)
        {
            try
            { character.details = JSON.parse(character.details); }
            catch (error)
            {
                character.details = {};
                logger.error(`Failed to parse details for character ${ character.character_id }:`, error.stack);
            } // end try/catch
        } // end if

        return character;
    } // end _parseCharacter

    //------------------------------------------------------------------------------------------------------------------
    // Public API
    //------------------------------------------------------------------------------------------------------------------

    async getCharacters(filters, includeDetails)
    {
        const db = await dbMan.getDB();
        let query = db('character as char')
            .select(
                'char.hash_id as id',
                'char.system',
                'char.name',
                'char.description',
                'char.portrait',
                'char.thumbnail',
                'char.color',
                'char.campaign',
                'acc.hash_id as account_id',
                'note.hash_id as note_id'
            )
            .join('note', 'note.note_id', '=', 'char.note_id')
            .join('account as acc', 'acc.account_id', '=', 'char.account_id');

        if(includeDetails)
        {
            query = query.select('char.details');
        } // end if

        if(filters && !_.isEmpty(filters))
        {
            query = applyFilters(query, filters);
        } // end if

        return (await query)
            .map(this._parseCharacter);
    } // end getCharacters

    async getCharacter(hash_id, includeDetails)
    {
        const db = await dbMan.getDB();
        let query = db('character as char')
            .select(
                'char.hash_id as id',
                'char.system',
                'char.name',
                'char.description',
                'char.portrait',
                'char.thumbnail',
                'char.color',
                'char.campaign',
                'acc.hash_id as account_id',
                'note.hash_id as note_id'
            )
            .join('note', 'note.note_id', '=', 'char.note_id')
            .join('account as acc', 'acc.account_id', '=', 'char.account_id')
            .where({ 'char.hash_id': hash_id });

        if(includeDetails)
        {
            query = query.select('char.details');
        } // end if

        const characters = await query;
        if(characters.length > 1)
        {
            throw new MultipleResultsError('character');
        }
        else if(characters.length === 0)
        {
            throw new NotFoundError(`No character with id '${ hash_id }' found.`);
        }
        else
        {
            return this._parseCharacter(characters[0]);
        } // end if
    } // end getCharacter

    async addCharacter(character)
    {
        // We're adding an character, so we want to make sure we don't have a `character_id`, and we generate a
        // `hash_id`.
        delete character.character_id;
        character.hash_id = shortID();

        // We have to stringify this to insert it into the table.
        character.details = JSON.stringify(character.details);

        // Insert character
        const db = await dbMan.getDB();
        await db('character').insert(character);

        return character.hash_id;
    } // end addCharacter

    async updateCharacter(character)
    {
        delete character.system;
        delete character.created;
        delete character.character_id;
        delete character.account_id;
        delete character.note_id;

        const { id, hash_id, ...safeCharacter } = character;
        const charID = id || hash_id;

        if(character.details)
        {
            safeCharacter.details = JSON.stringify(character.details);
        } // end if

        // Update the character
        const db = await dbMan.getDB();
        await db('character')
            .update(safeCharacter)
            .where({ hash_id: charID });

        return charID;
    } // end updateCharacter

    async deleteCharacter(hash_id)
    {
        const db = await dbMan.getDB();
        return db('character')
            .where({ hash_id })
            .delete();
    } // end deleteCharacter
} // end CharacterResourceAccess

//----------------------------------------------------------------------------------------------------------------------

export default new CharacterResourceAccess();

//----------------------------------------------------------------------------------------------------------------------
