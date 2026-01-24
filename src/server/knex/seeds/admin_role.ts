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

    // Note: Admin/mod assignment happens automatically when accounts are created via Google OAuth
    // if their email matches the ADMIN_EMAILS or MOD_EMAILS environment variables.
    // See src/server/auth/google.ts and src/server/utils/autoRoles.ts
}

//----------------------------------------------------------------------------------------------------------------------
