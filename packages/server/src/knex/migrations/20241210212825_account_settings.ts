//----------------------------------------------------------------------------------------------------------------------
// Populate the database with the new account settings.
//----------------------------------------------------------------------------------------------------------------------

import type { Knex } from 'knex';

//----------------------------------------------------------------------------------------------------------------------

export async function up(knex : Knex) : Promise<Knex.QueryBuilder>
{
    // Unlike the other migrations, this one is a bit different. We're not creating a new table or modifying an existing
    // one. Instead, we're updating the existing data with the new account settings.
    await knex('account').update({ settings: '{"colorMode":"auto","systemFilter":"beta"}' });
}

//----------------------------------------------------------------------------------------------------------------------

export async function down(knex : Knex) : Promise<Knex.QueryBuilder>
{
    await knex('account').update({ settings: '{}' });
}

//----------------------------------------------------------------------------------------------------------------------

