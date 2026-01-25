//----------------------------------------------------------------------------------------------------------------------
// Migration: Convert attachment modOptions from string[] to structured format
//
// Updates attachment supplements to use the new modOptions format:
// FROM: modOptions: string[] (e.g., ["Accurate 1", "-1 Encumbrance"])
// TO:   modOptions: { description: string, qualities?: QualityRef[] }[]
//----------------------------------------------------------------------------------------------------------------------

import type { Knex } from 'knex';

//----------------------------------------------------------------------------------------------------------------------

interface OldModOptions
{
    modOptions ?: string[];
}

interface NewModOptions
{
    modOptions ?: { description : string }[];
}

//----------------------------------------------------------------------------------------------------------------------

export async function up(knex : Knex) : Promise<void>
{
    // Get all attachment supplements
    const attachments = await knex('supplement')
        .where('type', 'attachment')
        .select('supplement_id', 'data');

    // Collect updates to batch at the end
    const updates : { id : string; data : string }[] = [];

    for(const attachment of attachments)
    {
        const data : OldModOptions = typeof attachment.data === 'string'
            ? JSON.parse(attachment.data)
            : attachment.data;

        // Check if modOptions exists and is an array
        if(Array.isArray(data.modOptions))
        {
            // Check if already converted (first element is an object)
            const firstMod = data.modOptions[0];
            if(!firstMod || typeof firstMod !== 'object')
            {
                // Convert string[] to { description: string }[]
                const newData : NewModOptions = {
                    ...data,
                    modOptions: data.modOptions.map((mod : string) => ({ description: mod })),
                };

                updates.push({
                    id: attachment.supplement_id,
                    data: JSON.stringify(newData),
                });
            }
        }
    }

    // Batch update all modified attachments
    await Promise.all(
        updates.map((update) =>
            knex('supplement')
                .where('supplement_id', update.id)
                .update({ data: update.data }))
    );

    console.info(`Converted modOptions format in ${ updates.length } attachment(s).`);
}

export async function down(knex : Knex) : Promise<void>
{
    // Get all attachment supplements
    const attachments = await knex('supplement')
        .where('type', 'attachment')
        .select('supplement_id', 'data');

    // Collect updates to batch at the end
    const updates : { id : string; data : string }[] = [];

    for(const attachment of attachments)
    {
        const data : NewModOptions = typeof attachment.data === 'string'
            ? JSON.parse(attachment.data)
            : attachment.data;

        // Check if modOptions exists and is an array
        if(Array.isArray(data.modOptions))
        {
            // Check if it's in the new format (first element is an object with description)
            const firstMod = data.modOptions[0];
            if(firstMod && typeof firstMod === 'object' && 'description' in firstMod)
            {
                // Convert { description: string }[] back to string[]
                const oldData : OldModOptions = {
                    ...data,
                    modOptions: data.modOptions.map((mod) => mod.description),
                };

                updates.push({
                    id: attachment.supplement_id,
                    data: JSON.stringify(oldData),
                });
            }
        }
    }

    // Batch update all modified attachments
    await Promise.all(
        updates.map((update) =>
            knex('supplement')
                .where('supplement_id', update.id)
                .update({ data: update.data }))
    );

    console.info(`Reverted modOptions format in ${ updates.length } attachment(s).`);
}

//----------------------------------------------------------------------------------------------------------------------
