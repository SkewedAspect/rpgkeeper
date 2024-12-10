//----------------------------------------------------------------------------------------------------------------------
// Set us up a default role
//----------------------------------------------------------------------------------------------------------------------

import { Knex } from 'knex';

//----------------------------------------------------------------------------------------------------------------------

export async function seed(knex : Knex) : Promise<void>
{
    // Delete automatic roles
    await knex('role').del()
        .whereIn('role_id', [ 1, 2 ]);

    // Add Automatic Roles
    await knex('role')
        .insert([
            { role_id: 1, name: 'Admins', permissions: JSON.stringify([ '*/*' ]) },
            { role_id: 2, name: 'Global Mods', permissions: JSON.stringify([ '*/canModifyContent', '*/canDeleteContent' ]) },
        ]);

    // Check for admin records, and add them if they're not already there.
    const admins = [
        {
            account_id: '3VAAgA',
            email: 'chris.case@g33xnexus.com',
            name: 'Morgul',
            avatar: 'https://lh3.googleusercontent.com/-r8fmbWdlFvg/AAAAAAAAAAI/AAAAAAAAA9g/oWyh8pnmDSY/s96-c/photo.jpg?sz=512',
            permissions: '["*/*"]',
            settings: '{}',
            created: knex.fn.now(),
        },
    ];

    const mods = [
        {
            account_id: '3Ks11R',
            email: 'travis.a.odom@gmail.com',
            name: 'Burstaholic',
            avatar: 'https://lh6.googleusercontent.com/-Cm7eBAJV2gQ/AAAAAAAAAAI/AAAAAAAAAXE/KLFM6YmcWm8/s96-c/photo.jpg?sz=512',
            permissions: '[]',
            settings: '{}',
            created: knex.fn.now(),
        },
    ];

    // Do a `mapSeries` over admins, and add them and their `account_role entry`, if needed.
    for(const acc of admins)
    {
        // eslint-disable-next-line no-await-in-loop
        let account = await knex('account').select()
            .where({ email: acc.email })
            .first();

        if(!account)
        {
            // eslint-disable-next-line no-await-in-loop
            await knex('account').insert(acc);
            account = acc;
        }

        // eslint-disable-next-line no-await-in-loop
        const linkExists = (await knex('account_role').select()
            .where({ account_id: account.account_id, role_id: 1 })).length > 0;
        if(!linkExists)
        {
            // eslint-disable-next-line no-await-in-loop
            await knex('account_role').insert({ account_id: account.account_id, role_id: 1 });
        }
    }

    // Do a `mapSeries` over mods, and add them and their `account_role entry`, if needed.
    for(const acc of mods)
    {
        // eslint-disable-next-line no-await-in-loop
        let account = await knex('account').select()
            .where({ email: acc.email })
            .first();

        if(!account)
        {
            // eslint-disable-next-line no-await-in-loop
            await knex('account').insert(acc);
            account = acc;
        }

        // eslint-disable-next-line no-await-in-loop
        const linkExists = (await knex('account_role').select()
            .where({ account_id: account.account_id, role_id: 2 })).length > 0;
        if(!linkExists)
        {
            // eslint-disable-next-line no-await-in-loop
            await knex('account_role').insert({ account_id: account.account_id, role_id: 2 });
        }
    }
}

//----------------------------------------------------------------------------------------------------------------------
