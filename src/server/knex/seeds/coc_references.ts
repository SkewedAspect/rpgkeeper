//----------------------------------------------------------------------------------------------------------------------
// Populate a default set of EotE/Genesys References
//----------------------------------------------------------------------------------------------------------------------

import { Knex } from 'knex';

//----------------------------------------------------------------------------------------------------------------------

export async function seed(knex : Knex) : Promise<void>
{
    // Deletes ALL existing entries
    await knex('coc_reference').del();

    // Inserts seed entries
    await knex('coc_reference').insert([
        { name: 'Homebrew', abbr: 'HB', product_code: 'HB999' },
        { name: 'Call of Cthulhu Keeper Rulebook', abbr: 'CoC-RK', product_code: 'CHA23135' },
        { name: 'Call of Cthulhu Investigator Handbook', abbr: 'CoC-IH', product_code: 'CHA23136' },
    ]);
}

//----------------------------------------------------------------------------------------------------------------------
