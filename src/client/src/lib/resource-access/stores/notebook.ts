// ---------------------------------------------------------------------------------------------------------------------
// Notes Store
// ---------------------------------------------------------------------------------------------------------------------

import { defineStore } from 'pinia';

// Models
import type { Notebook, NotebookPage } from '@rpgk/core';

// ---------------------------------------------------------------------------------------------------------------------

export interface NotebookStoreState
{
    id : string | null;
    pages : NotebookPage[];
}

// ---------------------------------------------------------------------------------------------------------------------

export const useNotebookStore = defineStore('notes', {
    state() : NotebookStoreState
    {
        return {
            id: null,
            pages: [],
        };
    },
    actions:
    {
        update(notebook : Notebook) : void
        {
            if(this.id === notebook.id)
            {
                this.$patch({ id: notebook.id, pages: notebook.pages });
            }
        },

        updatePage(page : NotebookPage) : void
        {
            const pageIndex = this.pages.findIndex((pg) => pg.id === page.id);
            if(pageIndex !== -1)
            {
                this.pages[pageIndex] = page;
            }
        },

        addPage(page : NotebookPage) : void
        {
            if(page.notebookID === this.id)
            {
                this.pages.push(page);
            }
        },

        removePage(pageID : string) : void
        {
            const pageIndex = this.pages.findIndex((pg) => pg.id === pageID);
            if(pageIndex !== -1)
            {
                this.pages.splice(pageIndex, 1);
            }
        },

        clear() : void
        {
            this.$patch({ id: null, pages: [] });
        },
    },
});

// ---------------------------------------------------------------------------------------------------------------------
