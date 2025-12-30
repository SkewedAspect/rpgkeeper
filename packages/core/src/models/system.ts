// ---------------------------------------------------------------------------------------------------------------------
// System
// ---------------------------------------------------------------------------------------------------------------------

export const validSupportStatuses = [ 'dev', 'beta', 'disabled', 'stable' ] as const;
export type ValidSupportStatus = typeof validSupportStatuses[number];

export enum SupportStatus
{
    Alpha = 'dev',
    Beta = 'beta',
    Disabled = 'disabled',
    Stable = 'stable',
}

export type SystemDefaults = object;

export interface SystemDefinition<Defaults extends SystemDefaults = SystemDefaults>
{
    id : string;
    name : string;
    description : string;
    defaults : Defaults;
    status : SupportStatus;
}

// ---------------------------------------------------------------------------------------------------------------------
