//----------------------------------------------------------------------------------------------------------------------
// Alert Database Transform
//----------------------------------------------------------------------------------------------------------------------

import type { Alert, AlertLevel } from '@rpgk/core/models/alert';

// Utils
import { fromDBTimestamp, toDBTimestamp } from './utils/timestamp.ts';

//----------------------------------------------------------------------------------------------------------------------

export interface AlertDBSchema
{
    alert_id : string;
    account_id : string;
    message : string;
    level : AlertLevel;
    link : string | null;
    active : number; // SQLite stores booleans as 0/1
    created : string;
    expires_at : string | null;
}

//----------------------------------------------------------------------------------------------------------------------

export function toDB(alert : Alert) : AlertDBSchema
{
    return {
        alert_id: alert.id,
        account_id: alert.accountID,
        message: alert.message,
        level: alert.level,
        link: alert.link,
        active: alert.active ? 1 : 0,
        created: toDBTimestamp(alert.created),
        expires_at: alert.expiresAt ? toDBTimestamp(alert.expiresAt) : null,
    };
}

export function fromDB(alert : AlertDBSchema) : Alert
{
    return {
        id: alert.alert_id,
        accountID: alert.account_id,
        message: alert.message,
        level: alert.level,
        link: alert.link,
        active: Boolean(alert.active),
        created: fromDBTimestamp(alert.created),
        expiresAt: alert.expires_at ? fromDBTimestamp(alert.expires_at) : null,
    };
}

//----------------------------------------------------------------------------------------------------------------------
