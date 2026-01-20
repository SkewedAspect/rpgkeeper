//----------------------------------------------------------------------------------------------------------------------
// Notebook Manager
//----------------------------------------------------------------------------------------------------------------------
// Thin wrapper around NotebookEngine for route compatibility.
// Internal managers (Character, Campaign) use NotebookEngine directly.
//----------------------------------------------------------------------------------------------------------------------

// Models
import type { Notebook, NotebookPage } from '@rpgk/core/models/notebook';

// Engines
import type { NotebookEngine } from '../engines/notebook.ts';

// Resource Access (for type re-export)
import type { NotebookFilters } from '../resource-access/index.ts';

//----------------------------------------------------------------------------------------------------------------------

export class NotebookManager
{
    private engine : NotebookEngine;

    constructor(engine : NotebookEngine)
    {
        this.engine = engine;
    }

    //------------------------------------------------------------------------------------------------------------------

    async get(notebookID : string) : Promise<Notebook>
    {
        return this.engine.get(notebookID);
    }

    async list(filters : NotebookFilters) : Promise<Notebook[]>
    {
        return this.engine.list(filters);
    }

    async getPage(pageID : string) : Promise<NotebookPage>
    {
        return this.engine.getPage(pageID);
    }

    async add(pages : NotebookPage[] = []) : Promise<Notebook>
    {
        return this.engine.add(pages);
    }

    async addPage(notebookID : string, page : NotebookPage) : Promise<NotebookPage>
    {
        return this.engine.addPage(notebookID, page);
    }

    async updatePage(pageID : string, pageUpdate : Partial<NotebookPage>) : Promise<NotebookPage>
    {
        return this.engine.updatePage(pageID, pageUpdate);
    }

    async remove(notebookID : string) : Promise<{ status : 'ok' }>
    {
        return this.engine.remove(notebookID);
    }

    async removePage(pageID : string) : Promise<{ status : 'ok' }>
    {
        return this.engine.removePage(pageID);
    }
}

//----------------------------------------------------------------------------------------------------------------------
