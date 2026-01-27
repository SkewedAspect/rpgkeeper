//----------------------------------------------------------------------------------------------------------------------
// Alert Resource Access
//----------------------------------------------------------------------------------------------------------------------

import type { Knex } from 'knex';

// Models
import type { Alert } from '@rpgk/core/models/alert';

// Transforms
import * as AlertTransforms from '../transforms/alert.ts';

// Utils
import { shortID } from '../../utils/misc.ts';

// Errors
import { MultipleResultsError, NotFoundError } from '../../errors.ts';

//----------------------------------------------------------------------------------------------------------------------

export class AlertResourceAccess
{
    private db : Knex;

    constructor(db : Knex)
    {
        this.db = db;
    }

    //------------------------------------------------------------------------------------------------------------------
    // Public CRUD Operations
    //------------------------------------------------------------------------------------------------------------------

    /**
     * Get an alert by ID.
     */
    async get(id : string) : Promise<Alert>
    {
        const alerts = await this.db('alert')
            .select()
            .where({ alert_id: id });

        if(alerts.length > 1)
        {
            throw new MultipleResultsError('alert');
        }
        else if(alerts.length === 0)
        {
            throw new NotFoundError(`No alert with id '${ id }' found.`);
        }

        return AlertTransforms.fromDB(alerts[0]);
    }

    /**
     * List active alerts that haven't expired.
     */
    async listActive() : Promise<Alert[]>
    {
        const now = new Date().toISOString();

        const alerts = await this.db('alert')
            .select()
            .where({ active: 1 })
            .andWhere((builder) =>
            {
                builder
                    .whereNull('expires_at')
                    .orWhere('expires_at', '>', now);
            })
            .orderBy('created', 'desc');

        return alerts.map(AlertTransforms.fromDB);
    }

    /**
     * List all alerts (for admin).
     */
    async listAll() : Promise<Alert[]>
    {
        const alerts = await this.db('alert')
            .select()
            .orderBy('created', 'desc');

        return alerts.map(AlertTransforms.fromDB);
    }

    /**
     * Add a new alert.
     */
    async add(accountID : string, newAlert : Omit<Alert, 'id' | 'accountID' | 'created'>) : Promise<Alert>
    {
        const now = Math.floor(Date.now() / 1000);

        const alert : Alert = {
            id: shortID(),
            accountID,
            message: newAlert.message,
            level: newAlert.level,
            link: newAlert.link,
            active: newAlert.active,
            created: now,
            expiresAt: newAlert.expiresAt,
        };

        await this.db('alert').insert(AlertTransforms.toDB(alert));

        return this.get(alert.id);
    }

    /**
     * Update an existing alert.
     */
    async update(
        alertID : string,
        updates : Partial<Pick<Alert, 'message' | 'level' | 'link' | 'active' | 'expiresAt'>>
    ) : Promise<Alert>
    {
        const existing = await this.get(alertID);

        const updated : Alert = {
            ...existing,
            message: updates.message ?? existing.message,
            level: updates.level ?? existing.level,
            link: updates.link !== undefined ? updates.link : existing.link,
            active: updates.active !== undefined ? updates.active : existing.active,
            expiresAt: updates.expiresAt !== undefined ? updates.expiresAt : existing.expiresAt,
        };

        await this.db('alert')
            .update(AlertTransforms.toDB(updated))
            .where({ alert_id: alertID });

        return this.get(alertID);
    }

    /**
     * Delete an alert.
     */
    async remove(alertID : string) : Promise<{ status : 'ok' }>
    {
        await this.db('alert')
            .where({ alert_id: alertID })
            .delete();

        return { status: 'ok' };
    }
}

//----------------------------------------------------------------------------------------------------------------------
