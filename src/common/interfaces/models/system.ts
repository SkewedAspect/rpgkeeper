// ---------------------------------------------------------------------------------------------------------------------
// System
// ---------------------------------------------------------------------------------------------------------------------

export const enum SupportStatus
{
    InDevelopment = 'dev',
    PublicBeta = 'beta',
    Disabled = 'disabled',
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
