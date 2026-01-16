//----------------------------------------------------------------------------------------------------------------------
// Migrate Homebrew Definitions - Move existing homebrew from system-specific tables to unified definition table
//----------------------------------------------------------------------------------------------------------------------

import type { Knex } from 'knex';

//----------------------------------------------------------------------------------------------------------------------

export async function up(knex : Knex) : Promise<void>
{
    // Migrate homebrew abilities from eote_ability where owner exists in account table
    const homebrewAbilities = await knex('eote_ability')
        .select('eote_ability.*')
        .join('account', 'eote_ability.owner', 'account.account_id')
        .where('eote_ability.official', 0)
        .where('eote_ability.scope', 'user');

    // Transform and bulk insert
    const definitions = homebrewAbilities.map((ability) => ({
        definition_id: `eote-ability-${ ability.id }`,
        system: 'eote',
        type: 'ability',
        name: ability.name,
        owner: ability.owner,
        data: JSON.stringify({
            description: ability.description,
            reference: ability.reference,
        }),
    }));

    if(definitions.length > 0)
    {
        await knex('definition').insert(definitions);
    }

    console.info(`Migrated ${ homebrewAbilities.length } homebrew abilities to definition table`);
}

//----------------------------------------------------------------------------------------------------------------------

export async function down(knex : Knex) : Promise<void>
{
    // Remove migrated definitions (those with IDs starting with 'eote-ability-')
    await knex('definition')
        .where('definition_id', 'like', 'eote-ability-%')
        .delete();
}

//----------------------------------------------------------------------------------------------------------------------
