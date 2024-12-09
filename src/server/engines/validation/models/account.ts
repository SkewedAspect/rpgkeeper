// ---------------------------------------------------------------------------------------------------------------------
// Account Validation Model
// ---------------------------------------------------------------------------------------------------------------------

import { z } from 'zod';

// Models
import { HashID } from './common.js';

// ---------------------------------------------------------------------------------------------------------------------

export const AccountID = HashID;

export const AccountSettings = z.object({
    colorMode: z.enum([ 'light', 'dark', 'auto' ]).optional(),

    // Other settings...
});

export const Account = z.object({
    id: z.string(),
    email: z.string(),
    name: z.string().optional(),
    avatar: z.string().optional(),
    permissions: z.array(z.string()).optional(),
    settings: AccountSettings.passthrough().optional(),
});

// ---------------------------------------------------------------------------------------------------------------------
// Request Validations
// ---------------------------------------------------------------------------------------------------------------------

export const UpdateParams = z.object({
    accountID: AccountID,
});

export const AccountFilter = z.object({
    id: z.union([ AccountID, z.array(AccountID) ]).optional(),
    email: z.union([ z.string().email(), z.array(z.string().email()) ])
        .optional(),
    name: z.union([ z.string().min(1), z.array(z.string().min(1)) ])
        .optional(),
});

// ---------------------------------------------------------------------------------------------------------------------
