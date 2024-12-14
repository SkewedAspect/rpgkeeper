//----------------------------------------------------------------------------------------------------------------------
// Character Manager
//----------------------------------------------------------------------------------------------------------------------

// Managers
import * as notebookMan from './notebook.js';

// Models
import { Character } from '../../common/models/index.js';

// Resource Access
import * as characterRA from '../resource-access/character.js';

// Utils
import { FilterToken } from '../routes/utils/index.js';
import { broadcast } from '../utils/sio.js';

//----------------------------------------------------------------------------------------------------------------------

export async function get(id : string) : Promise<Character>
{
    return characterRA.get(id);
}

export async function list(filters : Record<string, FilterToken> = {}) : Promise<Character[]>
{
    return characterRA.list(filters);
}

export async function add(accountID : string, newCharacter : Omit<Character, 'id'>) : Promise<Character>
{
    const notebook = await notebookMan.add();
    const newChar = await characterRA.add(accountID, { ...newCharacter, noteID: notebook.id });

    // Broadcast the update
    await broadcast('/character', {
        type: 'add',
        resource: newChar.id,
        payload: newChar,
    });

    return newChar;
}

export async function update(charID : string, updateChar : Partial<Character>) : Promise<Character>
{
    const newChar = await characterRA.update(charID, updateChar);

    // Broadcast the update
    await broadcast('/character', {
        type: 'update',
        resource: charID,
        payload: newChar,
    });

    return newChar;
}

export async function remove(charID : string) : Promise<{ status : 'ok' }>
{
    const char = await characterRA.get(charID);
    await characterRA.remove(charID);
    await notebookMan.remove(char.noteID);

    // Broadcast the update
    await broadcast('/character', {
        type: 'remove',
        resource: charID,
    });

    return { status: 'ok' };
}

//----------------------------------------------------------------------------------------------------------------------
