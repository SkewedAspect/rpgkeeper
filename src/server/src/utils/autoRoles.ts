//----------------------------------------------------------------------------------------------------------------------
// Auto Role Assignment Utilities
//
// Checks if an email should be automatically assigned to a role based on environment variables.
//----------------------------------------------------------------------------------------------------------------------

//----------------------------------------------------------------------------------------------------------------------

/**
 * Get the list of email addresses that should be admins from the ADMIN_EMAILS environment variable
 */
export function getAdminEmails() : string[]
{
    return process.env['ADMIN_EMAILS']?.split(',').map((e) => e.trim()).filter(Boolean) ?? [];
}

/**
 * Get the list of email addresses that should be mods from the MOD_EMAILS environment variable
 */
export function getModEmails() : string[]
{
    return process.env['MOD_EMAILS']?.split(',').map((e) => e.trim()).filter(Boolean) ?? [];
}

/**
 * Check if an email should be an admin
 */
export function isAdminEmail(email : string) : boolean
{
    const adminEmails = getAdminEmails().map((e) => e.toLowerCase());
    return adminEmails.includes(email.toLowerCase());
}

/**
 * Check if an email should be a mod
 */
export function isModEmail(email : string) : boolean
{
    const modEmails = getModEmails().map((e) => e.toLowerCase());
    return modEmails.includes(email.toLowerCase());
}

/**
 * Get the role ID(s) that should be assigned to an email address
 * Returns an array of role IDs: [1] for admin, [2] for mod, [] for none
 */
export function getRoleIDsForEmail(email : string) : number[]
{
    const roles : number[] = [];

    if(isAdminEmail(email))
    {
        roles.push(1); // Admin role
    }
    else if(isModEmail(email))
    {
        roles.push(2); // Mod role
    }

    return roles;
}

//----------------------------------------------------------------------------------------------------------------------
