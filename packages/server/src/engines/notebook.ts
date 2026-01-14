//----------------------------------------------------------------------------------------------------------------------
// Notebook Engine
//----------------------------------------------------------------------------------------------------------------------

// Models
import type { Notebook, NotebookPage } from '@rpgk/core/models/notebook';

// Resource Access
import type { EntityResourceAccess, NotebookFilters } from '../resource-access/index.ts';

// Utils
import { broadcast } from '../utils/sio.ts';

//----------------------------------------------------------------------------------------------------------------------

/**
 * NotebookEngine handles notebook operations including persistence and broadcasting.
 * This is a shared engine used by CharacterManager and CampaignManager for their
 * associated notebooks.
 */
export class NotebookEngine
{
    private entities : EntityResourceAccess;

    constructor(entities : EntityResourceAccess)
    {
        this.entities = entities;
    }

    //------------------------------------------------------------------------------------------------------------------

    async get(notebookID : string) : Promise<Notebook>
    {
        return this.entities.notebook.get(notebookID);
    }

    async list(filters : NotebookFilters) : Promise<Notebook[]>
    {
        return this.entities.notebook.list(filters);
    }

    async getPage(pageID : string) : Promise<NotebookPage>
    {
        return this.entities.notebook.getPage(pageID);
    }

    async add(pages : NotebookPage[] = []) : Promise<Notebook>
    {
        const newNotebook = await this.entities.notebook.add(pages);

        // Broadcast the add
        await broadcast('/notebook', {
            type: 'add',
            resource: newNotebook.id,
            payload: newNotebook,
        });

        return newNotebook;
    }

    async addPage(notebookID : string, page : NotebookPage) : Promise<NotebookPage>
    {
        const newPage = await this.entities.notebook.addPage(notebookID, page);

        // Broadcast the add
        await broadcast('/notebook/page', {
            type: 'add',
            resource: newPage.id,
            payload: newPage,
        });

        return newPage;
    }

    async updatePage(pageID : string, pageUpdate : Partial<NotebookPage>) : Promise<NotebookPage>
    {
        const newPage = await this.entities.notebook.updatePage(pageID, pageUpdate);

        // Broadcast the update
        await broadcast('/notebook/page', {
            type: 'update',
            resource: pageID,
            payload: newPage,
        });

        return newPage;
    }

    async remove(notebookID : string) : Promise<{ status : 'ok' }>
    {
        await this.entities.notebook.remove(notebookID);

        // Broadcast the removal
        await broadcast('/notebook', {
            type: 'remove',
            resource: notebookID,
        });

        return { status: 'ok' };
    }

    async removePage(pageID : string) : Promise<{ status : 'ok' }>
    {
        await this.entities.notebook.removePage(pageID);

        // Broadcast the removal
        await broadcast('/notebook/page', {
            type: 'remove',
            resource: pageID,
        });

        return { status: 'ok' };
    }
}

//----------------------------------------------------------------------------------------------------------------------
