// ---------------------------------------------------------------------------------------------------------------------
// System
// ---------------------------------------------------------------------------------------------------------------------

export const validSupportStatuses = [ 'dev', 'beta', 'disabled', 'stable' ] as const;
export type ValidSupportStatus = typeof validSupportStatuses[number];

export const enum SupportStatus
{
    InDevelopment = 'dev',
    PublicBeta = 'beta',
    Disabled = 'disabled',
    Stable = 'stable',
}

export interface System<Defaults extends Record<string, unknown>>
{
    id : string;
    name : string;
    description : string;
    defaults : Defaults;
    status : SupportStatus;
}

// ---------------------------------------------------------------------------------------------------------------------
