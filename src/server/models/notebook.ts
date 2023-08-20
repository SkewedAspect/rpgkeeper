//----------------------------------------------------------------------------------------------------------------------
// Note
//----------------------------------------------------------------------------------------------------------------------

import * as JsonDecoder from 'decoders';
import { notebookDecoder, notebookPageDecoder } from '../decoders/notebook';

// Models
import { NotebookOptions, NotebookPageOptions } from '../../common/interfaces/models/notebook';

//----------------------------------------------------------------------------------------------------------------------

export class NotebookPage
{
    public readonly id : string;
    public readonly notebookID : string;

    public title = '';
    public content = '';

    constructor(options : NotebookPageOptions)
    {
        this.id = options.id;
        this.notebookID = options.notebookID;
        this.title = options.title;
        this.content = options.content;
    }

    //------------------------------------------------------------------------------------------------------------------
    // Serialization
    //------------------------------------------------------------------------------------------------------------------

    public toJSON() : Record<string, unknown>
    {
        return {
            id: this.id,
            title: this.title,
            content: this.content,
            notebookID: this.notebookID
        };
    } // end

    public toDB() : Record<string, unknown>
    {
        const { id, notebookID, ...jsonObj } = this.toJSON();
        return {
            ...jsonObj,
            page_id: id,
            note_id: notebookID
        };
    }

    //------------------------------------------------------------------------------------------------------------------
    // Deserialization
    //------------------------------------------------------------------------------------------------------------------

    static fromDB(noteRecord : Record<string, unknown>) : NotebookPage
    {
        const decoder = JsonDecoder.guard(notebookPageDecoder);
        return new NotebookPage(decoder(noteRecord) as NotebookPageOptions);
    }

    static fromJSON(jsonObj : Record<string, unknown>) : NotebookPage
    {
        const decoder = JsonDecoder.guard(notebookPageDecoder);
        return new NotebookPage(decoder(jsonObj) as NotebookPageOptions);
    }
}

//----------------------------------------------------------------------------------------------------------------------

export class Notebook
{
    public readonly id : string;
    public pages : NotebookPage[] = [];

    constructor(options : NotebookOptions)
    {
        this.id = options.id;

        if(options.pages)
        {
            this.pages = options.pages.map((page) => new NotebookPage(page));
        }
    }

    //------------------------------------------------------------------------------------------------------------------
    // Serialization
    //------------------------------------------------------------------------------------------------------------------

    public toJSON() : Record<string, unknown>
    {
        return {
            id: this.id,
            pages: this.pages.map((page) => page.toJSON())
        };
    } // end

    public toDB() : Record<string, unknown>
    {
        return {
            hash_id: this.id
        };
    }

    //------------------------------------------------------------------------------------------------------------------
    // Deserialization
    //------------------------------------------------------------------------------------------------------------------

    static fromDB(noteRecord : Record<string, unknown>) : Notebook
    {
        const decoder = JsonDecoder.guard(notebookDecoder);
        return new Notebook(decoder(noteRecord) as NotebookOptions);
    }

    static fromJSON(jsonObj : Record<string, unknown>) : Notebook
    {
        const decoder = JsonDecoder.guard(notebookDecoder);
        return new Notebook(decoder(jsonObj) as NotebookOptions);
    }
}

//----------------------------------------------------------------------------------------------------------------------

