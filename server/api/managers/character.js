//----------------------------------------------------------------------------------------------------------------------
// CharacterManager
//----------------------------------------------------------------------------------------------------------------------

const _ = require('lodash');

// Managers
const notesMan = require('./notes');

// Resource Access
const characterRA = require('../resource-access/character');

//----------------------------------------------------------------------------------------------------------------------

class CharacterManager
{
    async getCharacters(filters, includeDetails = true)
    {
        // Map `id` to `hash_id`
        if(filters.id)
        {
            filters.hash_id = filters.id;
        } // end if

        // Limit filters to only those properties we want you to be able to search by.
        filters = _.pick(filters, 'system', 'description', 'portrait', 'thumbnail', 'color', 'campaign', 'account_id');

        // Prefix filters with the right table.
        filters = _.transform(filters, (result, value, key) =>
        {
            result[`char.${ key }`] = value;
            return result;
        }, {});

        return characterRA.getCharacters(filters, includeDetails);
    } // end getCharacters

    async getCharacter(id, includeDetails = true)
    {
        return characterRA.getCharacter(id, includeDetails);
    } // getCharacterByHash

    async createCharacter(character)
    {
        // We have to create a note for this character.
        const { note_id } = await notesMan.createNote();
        character.note_id = note_id;

        return this.getCharacter(await characterRA.addCharacter(character));
    } // end createCharacter

    async updateCharacter(character)
    {
        const characterID = await characterRA.updateCharacter(character);
        return characterRA.getCharacter(characterID, true);
    } // end updateCharacter

    async deleteCharacter(characterID)
    {
        // First, retrieve the character
        const char = await this.getCharacter(characterID);

        // Next we must delete the character before any other cleanup.
        const deleted = await characterRA.deleteCharacter(characterID);

        if(deleted > 0)
        {
            // Then, we have to delete the notes
            await notesMan.deleteNote(char.note_id);
        } // end if

        return deleted;
    } // end deleteCharacter
} // end CharacterManager

//----------------------------------------------------------------------------------------------------------------------

module.exports = new CharacterManager();

//----------------------------------------------------------------------------------------------------------------------
