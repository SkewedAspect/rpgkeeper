// ---------------------------------------------------------------------------------------------------------------------
// Account Validation Model
// ---------------------------------------------------------------------------------------------------------------------

import { z } from 'zod';

// Models
import { validColorModes, validSupportStatuses } from '../../../../common/models/index.js';

// Validations
import { HashID, ItemFilter } from './common.js';

// ---------------------------------------------------------------------------------------------------------------------

export const AccountSettings = z.object({
    colorMode: z.enum(validColorModes).optional(),
    systemFilter: z.enum(validSupportStatuses).optional(),
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
    accountID: HashID,
});

export const AccountFilter = ItemFilter;

// ---------------------------------------------------------------------------------------------------------------------
