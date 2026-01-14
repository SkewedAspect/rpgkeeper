//----------------------------------------------------------------------------------------------------------------------
// Character Manager
//----------------------------------------------------------------------------------------------------------------------

// Models
import type { Character, SavedCharacter } from '@rpgk/core';

// Systems
import { systemRegistry } from '@rpgk/systems/definitions';

// Engines
import systemsEngine from '../engines/system.ts';
import type { NotebookEngine } from '../engines/notebook.ts';

// Resource Access
import type { EntityResourceAccess } from '../resource-access/index.ts';

// Utils
import type { FilterToken } from '../routes/utils/index.ts';
import { broadcast } from '../utils/sio.ts';

//----------------------------------------------------------------------------------------------------------------------

export class CharacterManager
{
    private entities : EntityResourceAccess;
    private notebookEngine : NotebookEngine;

    constructor(entities : EntityResourceAccess, notebookEngine : NotebookEngine)
    {
        this.entities = entities;
        this.notebookEngine = notebookEngine;
    }

    //------------------------------------------------------------------------------------------------------------------
    // Private Helpers
    //------------------------------------------------------------------------------------------------------------------

    /**
     * Validates character details against the system's schema.
     * Throws a ZodError if validation fails.
     */
    private validateDetailsSchema(character : Partial<Character>) : void
    {
        // If no details provided, nothing to validate
        if(!character.details)
        {
            return;
        }

        // Get the system - need to know which schema to use
        const systemId = character.system;
        if(!systemId)
        {
            return;
        }

        // Look up the system and its schema
        const system = systemRegistry.get(systemId);
        if(!system?.detailsSchema)
        {
            // No schema defined for this system - skip validation
            return;
        }

        // Validate the details against the schema (throws on failure)
        system.detailsSchema.parse(character.details);
    }

    //------------------------------------------------------------------------------------------------------------------
    // Public API
    //------------------------------------------------------------------------------------------------------------------

    async get(id : string) : Promise<SavedCharacter>
    {
        const character = await this.entities.character.get(id);

        // Validate system-specific details
        return systemsEngine.validateCharacterDetails(character) as Promise<SavedCharacter>;
    }

    async list(filters : Record<string, FilterToken> = {}) : Promise<SavedCharacter[]>
    {
        const characters = await this.entities.character.list(filters);

        // Validate system-specific details for all characters
        return Promise.all(
            characters.map((char) => systemsEngine.validateCharacterDetails(char) as Promise<SavedCharacter>)
        );
    }

    async add(accountID : string, newCharacter : Character) : Promise<SavedCharacter>
    {
        // Validate details schema before saving
        this.validateDetailsSchema(newCharacter);

        const notebook = await this.notebookEngine.add();
        const newChar = await this.entities.character.add(accountID, { ...newCharacter, noteID: notebook.id });

        // Broadcast the update
        await broadcast('/character', {
            type: 'add',
            resource: newChar.id,
            payload: newChar,
        });

        return newChar;
    }

    async update(charID : string, updateChar : Partial<Character>) : Promise<SavedCharacter>
    {
        // Validate details schema before saving
        if(updateChar.details)
        {
            // If system not in update, fetch current character to get it
            if(!updateChar.system)
            {
                const current = await this.entities.character.get(charID);
                this.validateDetailsSchema({ ...updateChar, system: current.system });
            }
            else
            {
                this.validateDetailsSchema(updateChar);
            }
        }

        const newChar = await this.entities.character.update(charID, updateChar);

        // Broadcast the update
        await broadcast('/character', {
            type: 'update',
            resource: charID,
            payload: newChar,
        });

        return newChar;
    }

    async remove(charID : string) : Promise<{ status : 'ok' }>
    {
        const char = await this.entities.character.get(charID);
        await this.entities.character.remove(charID);
        await this.notebookEngine.remove(char.noteID);

        // Broadcast the update
        await broadcast('/character', {
            type: 'remove',
            resource: charID,
        });

        return { status: 'ok' };
    }
}

//----------------------------------------------------------------------------------------------------------------------
