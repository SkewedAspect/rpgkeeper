//----------------------------------------------------------------------------------------------------------------------
// CharacterManager
//----------------------------------------------------------------------------------------------------------------------

// Managers
import { table } from './database';
// import * as notebookMan from './notebook';

// Models
import { Character } from '../models/character';

// Utils
import { MultipleResultsError, NotFoundError } from '../errors';
import { FilterToken } from '../routes/utils/query';
import { applyFilters } from '../knex/utils';

//----------------------------------------------------------------------------------------------------------------------

class CharacterManager
{
    async get(id : string) : Promise<Character>
    {
        const characters = await table('character as char')
            .select(
                'char.hash_id as id',
                'char.system',
                'char.name',
                'char.description',
                'char.portrait',
                'char.thumbnail',
                'char.color',
                'char.campaign',
                'char.details',
                'acc.hash_id as accountID',
                'note.hash_id as noteID'
            )
            .join('note', 'note.note_id', '=', 'char.note_id')
            .join('account as acc', 'acc.account_id', '=', 'char.account_id')
            .where({ 'char.hash_id': id });

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
            return Character.fromDB(characters[0]);
        } // end if
    } // get

    async list(filters : Record<string, FilterToken> = {}) : Promise<Character>
    {
        let query = table('character as char')
            .select(
                'char.hash_id as id',
                'char.system',
                'char.name',
                'char.description',
                'char.portrait',
                'char.thumbnail',
                'char.color',
                'char.campaign',
                'char.details',
                'acc.hash_id as accountID',
                'note.hash_id as noteID'
            )
            .join('note', 'note.note_id', '=', 'char.note_id')
            .join('account as acc', 'acc.account_id', '=', 'char.account_id');

        // Apply any filters
        query = applyFilters(query, filters);

        return (await query)
            .map(Character.fromDB);
    } // end list

    async createCharacter(character)
    {
        console.log('create got: ', character);
        // // We have to create a note for this character.
        // const notebook = await notebookMan.add();
        // character.note_id = notebook.id;
        //
        // return this.getCharacter(await characterRA.addCharacter(character));
    } // end createCharacter

    async updateCharacter(character)
    {
        console.log('update got: ', character);
        // const characterID = await characterRA.updateCharacter(character);
        // return characterRA.getCharacter(characterID, true);
    } // end updateCharacter

    async deleteCharacter(characterID)
    {
        console.log('delete got: ', characterID);
        return 0;
        // // First, retrieve the character
        // const char = await this.getCharacter(characterID);
        //
        // // Next we must delete the character before any other cleanup.
        // const deleted = await characterRA.deleteCharacter(characterID);
        //
        // if(deleted > 0)
        // {
        //     // Then, we have to delete the notes
        //     await notebookMan.remove(char.note_id);
        // } // end if
        //
        // return deleted;
    } // end deleteCharacter
} // end CharacterManager

//----------------------------------------------------------------------------------------------------------------------

export default new CharacterManager();

//----------------------------------------------------------------------------------------------------------------------
