//----------------------------------------------------------------------------------------------------------------------
// EotE/Genesys Character Validation
//
// Validates referential integrity of supplement references in character data.
// Called on character save to ensure all referenced supplements exist.
//----------------------------------------------------------------------------------------------------------------------

import type { Character, ValidationManagers } from '@rpgk/core';

// Local models
import type { EoteSystemDetails, GenesysSystemDetails } from '../models.ts';

//----------------------------------------------------------------------------------------------------------------------
// Helpers
//----------------------------------------------------------------------------------------------------------------------

/**
 * Validate an array of supplement IDs, removing any that don't exist.
 */
async function validateIds(
    ids : string[],
    type : string,
    system : string,
    managers : ValidationManagers
) : Promise<string[]>
{
    const results = await Promise.all(
        ids.map(async(id) =>
        {
            const exists = await managers.supplement.exists(id, type, system);
            return exists ? id : null;
        })
    );

    return results.filter((id) : id is string => id !== null);
}

/**
 * Validate an array of supplement references, removing any that don't exist.
 * Generic to preserve the input array's type.
 */
async function validateRefs<T extends { id ?: string }>(
    refs : T[],
    type : string,
    system : string,
    managers : ValidationManagers
) : Promise<T[]>
{
    const results = await Promise.all(
        refs.map(async(ref) : Promise<T | null> =>
        {
            if(ref.id === undefined)
            {
                return null;
            }
            const exists = await managers.supplement.exists(String(ref.id), type, system);
            return exists ? ref : null;
        })
    );

    return results.filter((ref) => ref !== null) as T[];
}

//----------------------------------------------------------------------------------------------------------------------
// EotE Validation
//----------------------------------------------------------------------------------------------------------------------

export async function validateEoteCharacter(
    character : unknown,
    managers : unknown
) : Promise<unknown>
{
    const char = character as Character<EoteSystemDetails>;
    const mgrs = managers as ValidationManagers;
    const details = char.details;
    const system = 'eote';

    // Validate abilities (array of IDs)
    details.abilities = await validateIds(details.abilities, 'ability', system, mgrs);

    // Validate talents (array of refs with id)
    details.talents = await validateRefs(details.talents, 'talent', system, mgrs);

    // Validate gear (array of refs with id)
    details.gear = await validateRefs(details.gear, 'gear', system, mgrs);

    // Validate force powers
    if(details.force?.powers)
    {
        details.force.powers = await validateRefs(details.force.powers, 'forcepower', system, mgrs);
    }

    // Validate armor attachments and qualities
    if(details.armor)
    {
        if(details.armor.attachments)
        {
            details.armor.attachments = await validateIds(
                details.armor.attachments,
                'attachment',
                system,
                mgrs
            );
        }
        if(details.armor.qualities)
        {
            details.armor.qualities = await validateRefs(details.armor.qualities, 'quality', system, mgrs);
        }
    }

    // Validate weapon attachments and qualities
    if(details.weapons)
    {
        await Promise.all(details.weapons.map(async(weapon) =>
        {
            if(weapon.attachments)
            {
                weapon.attachments = await validateIds(weapon.attachments, 'attachment', system, mgrs);
            }
            if(weapon.qualities)
            {
                weapon.qualities = await validateRefs(weapon.qualities, 'quality', system, mgrs);
            }
        }));
    }

    return character;
}

//----------------------------------------------------------------------------------------------------------------------
// Genesys Validation
//----------------------------------------------------------------------------------------------------------------------

export async function validateGenesysCharacter(
    character : unknown,
    managers : unknown
) : Promise<unknown>
{
    const char = character as Character<GenesysSystemDetails>;
    const mgrs = managers as ValidationManagers;
    const details = char.details;
    const system = 'genesys';

    // Validate motivations (nullable IDs)
    if(details.motivations)
    {
        const motivations = details.motivations;

        if(motivations.strength !== null)
        {
            const exists = await mgrs.supplement.exists(String(motivations.strength), 'motivation', system);
            motivations.strength = exists ? motivations.strength : null;
        }

        if(motivations.flaw !== null)
        {
            const exists = await mgrs.supplement.exists(String(motivations.flaw), 'motivation', system);
            motivations.flaw = exists ? motivations.flaw : null;
        }

        if(motivations.desire !== null)
        {
            const exists = await mgrs.supplement.exists(String(motivations.desire), 'motivation', system);
            motivations.desire = exists ? motivations.desire : null;
        }

        if(motivations.fear !== null)
        {
            const exists = await mgrs.supplement.exists(String(motivations.fear), 'motivation', system);
            motivations.fear = exists ? motivations.fear : null;
        }
    }

    // Validate abilities (array of IDs)
    details.abilities = await validateIds(details.abilities, 'ability', system, mgrs);

    // Validate talents (array of refs with id)
    details.talents = await validateRefs(details.talents, 'talent', system, mgrs);

    // Validate gear (array of refs with id)
    details.gear = await validateRefs(details.gear, 'gear', system, mgrs);

    // Validate armor attachments and qualities
    if(details.armor)
    {
        if(details.armor.attachments)
        {
            details.armor.attachments = await validateIds(
                details.armor.attachments,
                'attachment',
                system,
                mgrs
            );
        }
        if(details.armor.qualities)
        {
            details.armor.qualities = await validateRefs(details.armor.qualities, 'quality', system, mgrs);
        }
    }

    // Validate weapon attachments and qualities
    if(details.weapons)
    {
        await Promise.all(details.weapons.map(async(weapon) =>
        {
            if(weapon.attachments)
            {
                weapon.attachments = await validateIds(weapon.attachments, 'attachment', system, mgrs);
            }
            if(weapon.qualities)
            {
                weapon.qualities = await validateRefs(weapon.qualities, 'quality', system, mgrs);
            }
        }));
    }

    return char;
}

//----------------------------------------------------------------------------------------------------------------------
