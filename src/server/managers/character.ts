//----------------------------------------------------------------------------------------------------------------------
// CharacterManager
//----------------------------------------------------------------------------------------------------------------------

// Managers
import * as notebookMan from './notebook.js';

// Models
import { Character } from '../../common/interfaces/models/character.js';

// Resource Access
import * as characterRA from '../resource-access/character.js';

// Utils
import { FilterToken } from '../routes/utils/index.js';

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
    return characterRA.add(accountID, { ...newCharacter, noteID: notebook.id });
}

export async function update(charID : string, updateChar : Partial<Character>) : Promise<Character>
{
    return characterRA.update(charID, updateChar);
}

export async function remove(charID : string) : Promise<{ status : 'ok' }>
{
    const char = await characterRA.get(charID);
    await notebookMan.remove(char.noteID);
    await characterRA.remove(charID);

    return { status: 'ok' };
}

//----------------------------------------------------------------------------------------------------------------------
