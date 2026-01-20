//----------------------------------------------------------------------------------------------------------------------
// Character Manager
//----------------------------------------------------------------------------------------------------------------------

import logging from '@strata-js/util-logging';

// Models
import type { Character, SavedCharacter } from '@rpgk/core';

// Systems
import { systems } from '@rpgk/systems';

// Engines
import type { NotebookEngine } from '../engines/notebook.ts';
import { type SupplementExistsChecker, validateSupplementRefs } from '../engines/supplementRefs.ts';

// Resource Access
import type { EntityResourceAccess } from '../resource-access/index.ts';

// Utils
import type { FilterToken } from '../routes/utils/index.ts';
import { broadcast } from '../utils/sio.ts';

//----------------------------------------------------------------------------------------------------------------------

const logger = logging.getLogger('character-manager');

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
            logger.debug('Skipping schema validation: no details provided');
            return;
        }

        // Get the system - need to know which schema to use
        const systemId = character.system;
        if(!systemId)
        {
            logger.debug('Skipping schema validation: no system ID');
            return;
        }

        // Look up the system and its schema
        const system = systems[systemId];
        if(!system?.detailsSchema)
        {
            logger.debug(`Skipping schema validation: no schema for system '${ systemId }'`);
            return;
        }

        // Validate the details against the schema (throws on failure)
        logger.debug(`Validating character details schema for system '${ systemId }'`);
        system.detailsSchema.parse(character.details);
        logger.debug(`Schema validation passed for system '${ systemId }'`);
    }

    /**
     * Validates supplement references in character data using the generic engine.
     * Called on save to ensure all referenced supplements exist.
     */
    private async validateSupplementRefs<T extends Character>(
        character : T,
        checker : SupplementExistsChecker
    ) : Promise<T>
    {
        const systemId = character.system;
        if(!systemId || !character.details)
        {
            return character;
        }

        const system = systems[systemId];
        if(!system?.detailsSchema)
        {
            return character;
        }

        logger.debug(`Validating supplement references for system '${ systemId }'`);
        const result = await validateSupplementRefs(
            character.details,
            system.detailsSchema,
            systemId,
            checker
        );

        if(result.removedCount > 0)
        {
            logger.warn(
                `Removed ${ result.removedCount } invalid supplement references:`,
                result.removed.map((ref) => `${ ref.path } (${ ref.type }: ${ ref.id })`).join(', ')
            );
        }
        else
        {
            logger.debug('All supplement references valid');
        }

        return { ...character, details: result.data };
    }

    //------------------------------------------------------------------------------------------------------------------
    // Public API
    //------------------------------------------------------------------------------------------------------------------

    async get(id : string) : Promise<SavedCharacter>
    {
        return this.entities.character.get(id);
    }

    async list(filters : Record<string, FilterToken> = {}) : Promise<SavedCharacter[]>
    {
        return this.entities.character.list(filters);
    }

    async add(
        accountID : string,
        newCharacter : Character,
        checker : SupplementExistsChecker
    ) : Promise<SavedCharacter>
    {
        // Validate details schema before saving
        this.validateDetailsSchema(newCharacter);

        // Validate supplement references (removes invalid refs)
        const validatedChar = await this.validateSupplementRefs(newCharacter, checker);

        const notebook = await this.notebookEngine.add();
        const newChar = await this.entities.character.add(accountID, { ...validatedChar, noteID: notebook.id });

        // Broadcast the update
        broadcast('/character', {
            type: 'add',
            resource: newChar.id,
            payload: newChar,
        });

        return newChar;
    }

    async update(
        charID : string,
        updateChar : Partial<Character>,
        checker : SupplementExistsChecker
    ) : Promise<SavedCharacter>
    {
        // Get current character for validation context
        const current = await this.entities.character.get(charID);

        // Merge update with current for validation purposes
        const merged = { ...current, ...updateChar } as Character;

        // Validate details schema before saving
        if(updateChar.details)
        {
            this.validateDetailsSchema(merged);
        }

        // Validate supplement references (removes invalid refs)
        const validated = await this.validateSupplementRefs(merged, checker);

        // Extract only the fields that were in the update
        const validatedUpdate : Partial<Character> = {};
        for(const key of Object.keys(updateChar) as (keyof Character)[])
        {
            // Use Record type for dynamic property assignment
            (validatedUpdate as Record<keyof Character, unknown>)[key] = validated[key];
        }

        const newChar = await this.entities.character.update(charID, validatedUpdate);

        // Broadcast the update
        broadcast('/character', {
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
        broadcast('/character', {
            type: 'remove',
            resource: charID,
        });

        return { status: 'ok' };
    }
}

//----------------------------------------------------------------------------------------------------------------------
