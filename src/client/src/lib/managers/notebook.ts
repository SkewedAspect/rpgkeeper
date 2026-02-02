//----------------------------------------------------------------------------------------------------------------------
// NotesManager
//----------------------------------------------------------------------------------------------------------------------

import { type Socket, io } from 'socket.io-client';

// Model
import type { Notebook, NotebookPage, RPGKMessage } from '@rpgk/core';

// Store
import { useNotebookStore } from '../resource-access/stores/notebook';

// Resource Access
import noteRA from '../resource-access/notebook';

//----------------------------------------------------------------------------------------------------------------------

class NotesManager
{
    #pageSocket : Socket;
    #notebookSocket : Socket;

    constructor()
    {
        this.#pageSocket = io('/notebook/page');
        this.#pageSocket.on('message', this._onPageMessage.bind(this));

        this.#notebookSocket = io('/notebook');
        this.#notebookSocket.on('message', this._onNotebookMessage.bind(this));
    }

    //------------------------------------------------------------------------------------------------------------------
    // Message Handlers
    //------------------------------------------------------------------------------------------------------------------

    _onPageMessage(envelope : RPGKMessage) : void
    {
        const store = useNotebookStore();
        switch (envelope.type)
        {
            case 'add':
                store.addPage(envelope.payload as NotebookPage);
                break;

            case 'update':
                store.updatePage(envelope.payload as NotebookPage);
                break;

            case 'remove':
                store.removePage(envelope.resource);
                break;

            default:
                break;
        }
    }

    _onNotebookMessage(envelope : RPGKMessage) : void
    {
        const store = useNotebookStore();
        switch (envelope.type)
        {
            case 'add':
            case 'update':
                store.update(envelope.payload as Notebook);
                break;

            case 'remove':
                if(store.id === envelope.resource)
                {
                    store.clear();
                }
                break;

            default:
                break;
        }
    }

    //------------------------------------------------------------------------------------------------------------------
    // Helpers
    //------------------------------------------------------------------------------------------------------------------

    private _updateStore(notebook ?: Notebook) : void
    {
        const store = useNotebookStore();
        if(notebook)
        {
            store.$patch({ id: notebook.id, pages: notebook.pages });
        }
        else
        {
            store.clear();
        }
    }

    //------------------------------------------------------------------------------------------------------------------
    // Public API
    //------------------------------------------------------------------------------------------------------------------

    async select(noteID : string) : Promise<void>
    {
        let notebook : Notebook | undefined = undefined;
        if(noteID)
        {
            notebook = await noteRA.getNotebook(noteID);
        }

        this._updateStore(notebook);
    }

    async addPage(noteID : string, page : NotebookPage) : Promise<void>
    {
        await noteRA.addPage(noteID, page);
    }

    async updatePage(noteID : string, page : NotebookPage) : Promise<void>
    {
        await noteRA.updatePage(noteID, page);
    }

    async deletePage(noteID : string, page : NotebookPage) : Promise<void>
    {
        await noteRA.deletePage(noteID, page);
    }
}

//----------------------------------------------------------------------------------------------------------------------

export default new NotesManager();

//----------------------------------------------------------------------------------------------------------------------
