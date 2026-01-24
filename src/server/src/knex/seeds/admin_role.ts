//----------------------------------------------------------------------------------------------------------------------
// Set us up a default role
//----------------------------------------------------------------------------------------------------------------------

import type { Knex } from 'knex';

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

    // Read admin/mod emails from environment variables
    // ADMIN_EMAILS: comma-separated list of email addresses to be admins
    // MOD_EMAILS: comma-separated list of email addresses to be mods
    const adminEmails = process.env['ADMIN_EMAILS']?.split(',').map((e) => e.trim()).filter(Boolean) ?? [];
    const modEmails = process.env['MOD_EMAILS']?.split(',').map((e) => e.trim()).filter(Boolean) ?? [];

    console.info(`Admin emails from env: ${ adminEmails.join(', ') || '(none)' }`);
    console.info(`Mod emails from env: ${ modEmails.join(', ') || '(none)' }`);

    // Build admin/mod account lists (seeds don't create accounts, just link existing ones to roles)
    const admins : Array<{ email : string }> = adminEmails.map((email) => ({ email }));
    const mods : Array<{ email : string }> = modEmails.map((email) => ({ email }));

    // Link existing admin accounts to the admin role
    for(const acc of admins)
    {
        // eslint-disable-next-line no-await-in-loop
        const account = await knex('account').select()
            .where({ email: acc.email })
            .first();

        if(account)
        {
            // eslint-disable-next-line no-await-in-loop
            const linkExists = (await knex('account_role').select()
                .where({ account_id: account.account_id, role_id: 1 })).length > 0;
            if(!linkExists)
            {
                // eslint-disable-next-line no-await-in-loop
                await knex('account_role').insert({ account_id: account.account_id, role_id: 1 });
                console.info(`Linked ${ account.email } to admin role`);
            }
        }
        else
        {
            console.info(`Admin email ${ acc.email } not found in accounts table (will be linked when account is created)`);
        }
    }

    // Link existing mod accounts to the mod role
    for(const acc of mods)
    {
        // eslint-disable-next-line no-await-in-loop
        const account = await knex('account').select()
            .where({ email: acc.email })
            .first();

        if(account)
        {
            // eslint-disable-next-line no-await-in-loop
            const linkExists = (await knex('account_role').select()
                .where({ account_id: account.account_id, role_id: 2 })).length > 0;
            if(!linkExists)
            {
                // eslint-disable-next-line no-await-in-loop
                await knex('account_role').insert({ account_id: account.account_id, role_id: 2 });
                console.info(`Linked ${ account.email } to mod role`);
            }
        }
        else
        {
            console.info(`Mod email ${ acc.email } not found in accounts table (will be linked when account is created)`);
        }
    }
}

//----------------------------------------------------------------------------------------------------------------------
