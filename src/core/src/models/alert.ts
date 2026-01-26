//----------------------------------------------------------------------------------------------------------------------
// Alert Models
//----------------------------------------------------------------------------------------------------------------------

/** Valid alert levels. */
export const alertLevels = [ 'info', 'warning', 'danger' ] as const;
export type AlertLevel = typeof alertLevels[number];

/**
 * A site-wide alert banner.
 */
export interface Alert
{
    /** Unique alert identifier. */
    id : string;
    /** Account ID of the creator. */
    accountID : string;
    /** Short alert message. */
    message : string;
    /** Alert severity level. */
    level : AlertLevel;
    /** Optional link for more information. */
    link : string | null;
    /** Whether the alert is currently active. */
    active : boolean;
    /** Unix timestamp of creation. */
    created : number;
    /** Unix timestamp when alert expires (null if no expiration). */
    expiresAt : number | null;
}

//----------------------------------------------------------------------------------------------------------------------
