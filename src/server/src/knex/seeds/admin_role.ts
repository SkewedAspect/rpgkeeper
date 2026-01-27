//----------------------------------------------------------------------------------------------------------------------
// Set us up a default role
//----------------------------------------------------------------------------------------------------------------------

import type { Knex } from 'knex';

//----------------------------------------------------------------------------------------------------------------------

export async function seed(knex : Knex) : Promise<void>
{
    // Ensure default roles exist (insert if missing, don't touch if present)
    const roles = [
        { role_id: 1, name: 'Admins', permissions: JSON.stringify([ '*/*' ]) },
        { role_id: 2, name: 'Global Mods', permissions: JSON.stringify([ '*/canModifyContent', '*/canDeleteContent' ]) },
    ];

    for(const role of roles)
    {
        // eslint-disable-next-line no-await-in-loop
        const existing = await knex('role')
            .where('role_id', role.role_id)
            .first();
        if(!existing)
        {
            // eslint-disable-next-line no-await-in-loop
            await knex('role').insert(role);
        }
    }

    // Note: Admin/mod assignment happens automatically when accounts are created via Google OAuth
    // if their email matches the ADMIN_EMAILS or MOD_EMAILS environment variables.
    // See src/server/src/auth/google.ts and src/server/src/utils/autoRoles.ts
}

//----------------------------------------------------------------------------------------------------------------------
