//----------------------------------------------------------------------------------------------------------------------
// Migration: Update skill name format from hyphenated to parenthetical
//
// Updates skill names in EotE/Genesys characters from the old format (e.g., "Ranged-Heavy")
// to the canonical format from source books (e.g., "Ranged (Heavy)").
//----------------------------------------------------------------------------------------------------------------------

import type { Knex } from 'knex';

//----------------------------------------------------------------------------------------------------------------------
// Skill Name Mapping
//----------------------------------------------------------------------------------------------------------------------

// Normalize skill name for comparison (lowercase, remove all spaces and special chars except hyphen)
function normalizeSkillName(name : string) : string
{
    return name.toLowerCase()
        .replace(/\s+/g, '')
        .replace(/[()]/g, '');
}

// Mapping from normalized names to canonical format
const canonicalSkillNames : Record<string, string> = {
    'ranged-heavy': 'Ranged (Heavy)',
    'ranged-light': 'Ranged (Light)',
    'melee-heavy': 'Melee (Heavy)',
    'melee-light': 'Melee (Light)',
    'piloting-planetary': 'Piloting (Planetary)',
    'piloting-space': 'Piloting (Space)',
};

// Inverse mapping for rollback
const oldSkillNames : Record<string, string> = {
    'ranged-heavy': 'Ranged-Heavy',
    'ranged-light': 'Ranged-Light',
    'melee-heavy': 'Melee-Heavy',
    'melee-light': 'Melee-Light',
    'piloting-planetary': 'Piloting-Planetary',
    'piloting-space': 'Piloting-Space',
};

// Convert skill name to canonical format
function toCanonicalSkillName(oldName : string) : string
{
    const normalized = normalizeSkillName(oldName);
    return canonicalSkillNames[normalized] ?? oldName;
}

// Convert skill name back to old format
function toOldSkillName(canonicalName : string) : string
{
    const normalized = normalizeSkillName(canonicalName);
    return oldSkillNames[normalized] ?? canonicalName;
}

//----------------------------------------------------------------------------------------------------------------------
// Migration
//----------------------------------------------------------------------------------------------------------------------

export async function up(knex : Knex) : Promise<void>
{
    // Get all EotE and Genesys characters
    const characters = await knex('character')
        .whereIn('system', [ 'eote', 'genesys' ])
        .select('character_id', 'system', 'details');

    // Collect updates to batch at the end
    const updates : { id : string; details : string }[] = [];

    for(const char of characters)
    {
        const details = typeof char.details === 'string' ? JSON.parse(char.details) : char.details;
        let modified = false;

        // Update skill names in skills array
        if(Array.isArray(details.skills))
        {
            for(const skill of details.skills)
            {
                if(skill.name)
                {
                    const newName = toCanonicalSkillName(skill.name);
                    if(newName !== skill.name)
                    {
                        skill.name = newName;
                        modified = true;
                    }
                }
            }
        }

        // Update weapon skill references
        if(Array.isArray(details.weapons))
        {
            for(const weapon of details.weapons)
            {
                if(weapon.skill)
                {
                    const newSkill = toCanonicalSkillName(weapon.skill);
                    if(newSkill !== weapon.skill)
                    {
                        weapon.skill = newSkill;
                        modified = true;
                    }
                }
            }
        }

        // Collect update if modified
        if(modified)
        {
            updates.push({
                id: char.character_id,
                details: JSON.stringify(details),
            });
        }
    }

    // Batch update all modified characters
    await Promise.all(
        updates.map((update) =>
            knex('character')
                .where('character_id', update.id)
                .update({ details: update.details }))
    );

    console.info(`Updated skill names in ${ updates.length } character(s).`);
}

export async function down(knex : Knex) : Promise<void>
{
    // Get all EotE and Genesys characters
    const characters = await knex('character')
        .whereIn('system', [ 'eote', 'genesys' ])
        .select('character_id', 'system', 'details');

    // Collect updates to batch at the end
    const updates : { id : string; details : string }[] = [];

    for(const char of characters)
    {
        const details = typeof char.details === 'string' ? JSON.parse(char.details) : char.details;
        let modified = false;

        // Revert skill names in skills array
        if(Array.isArray(details.skills))
        {
            for(const skill of details.skills)
            {
                if(skill.name)
                {
                    const oldName = toOldSkillName(skill.name);
                    if(oldName !== skill.name)
                    {
                        skill.name = oldName;
                        modified = true;
                    }
                }
            }
        }

        // Revert weapon skill references
        if(Array.isArray(details.weapons))
        {
            for(const weapon of details.weapons)
            {
                if(weapon.skill)
                {
                    const oldSkill = toOldSkillName(weapon.skill);
                    if(oldSkill !== weapon.skill)
                    {
                        weapon.skill = oldSkill;
                        modified = true;
                    }
                }
            }
        }

        // Collect update if modified
        if(modified)
        {
            updates.push({
                id: char.character_id,
                details: JSON.stringify(details),
            });
        }
    }

    // Batch update all modified characters
    await Promise.all(
        updates.map((update) =>
            knex('character')
                .where('character_id', update.id)
                .update({ details: update.details }))
    );

    console.info(`Reverted skill names in ${ updates.length } character(s).`);
}

//----------------------------------------------------------------------------------------------------------------------
