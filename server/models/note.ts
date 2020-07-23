//----------------------------------------------------------------------------------------------------------------------
// Note
//----------------------------------------------------------------------------------------------------------------------

// Utils
import { shortID } from '../utils/misc';

// Errors
import { AppError, ValidationError } from '../api/errors';

//----------------------------------------------------------------------------------------------------------------------

export interface NoteLike {
    id ?: string;
    pages ?: NotePageLike[]
}

export interface NoteDBRecord {
    hash_id : string;
}

export interface NotePageLike {
    id ?: string;
    title : string;
    content : string;
    noteID : string;
}

export interface NotePageDBRecord extends Omit<NotePageLike, 'noteID'> {
    note_id : string;
}

//----------------------------------------------------------------------------------------------------------------------

export class NotePage implements NotePageLike
{
    #id ?: string;
    #noteID = '';

    public title = '';
    public content = '';

    constructor(definition ?: NotePageLike)
    {
        if(definition)
        {
            this.#id = definition.id;
            this.#noteID = definition.noteID;
            this.title = definition.title;
            this.content = definition.content;
        } // end if
    } // end constructor

    //------------------------------------------------------------------------------------------------------------------
    // Properties
    //------------------------------------------------------------------------------------------------------------------

    public get id() : string | undefined
    {
        return this.#id;
    }

    public get noteID() : string
    {
        return this.#noteID;
    }

    //------------------------------------------------------------------------------------------------------------------

    public generateID() : string
    {
        if(!this.#id)
        {
            return this.#id = shortID();
        }
        else
        {
            throw new AppError('Unable to change the ID of an existing note.', 'CannotChangeNoteID');
        } // end if
    } // end generateID

    //------------------------------------------------------------------------------------------------------------------
    // Serialization
    //------------------------------------------------------------------------------------------------------------------

    public toJSON() : NotePageLike
    {
        return {
            id: this.id,
            title: this.title,
            content: this.content,
            noteID: this.noteID
        };
    } // end

    public toDB() : NotePageDBRecord
    {
        const { noteID, ...jsonObj } = this.toJSON();
        return {
            ...jsonObj,
            note_id: noteID
        };
    } // end toDB

    //------------------------------------------------------------------------------------------------------------------
    // Deserialization
    //------------------------------------------------------------------------------------------------------------------

    static fromDB(noteRecord : NotePageDBRecord) : NotePage
    {
        const { note_id, ...noteRecordRest } = noteRecord;
        return new NotePage({ ...noteRecordRest, noteID: note_id });
    } // end fromDB

    static async fromJSON(jsonObj : Record<string, unknown>) : Promise<NotePage>
    {
        const notePage : NotePageLike = {
            title: jsonObj.title as string,
            content: jsonObj.content as string,
            noteID: jsonObj.noteID as string
        };

        return new NotePage(notePage);
    } // end fromJSON
} // end NotePage

//----------------------------------------------------------------------------------------------------------------------

export class Note implements NoteLike
{
    #id ?: string;

    public pages : NotePage[] = [];

    constructor(definition ?: NoteLike)
    {
        if(definition)
        {
            this.#id = definition.id;
            this.pages = (definition.pages ?? [])
                .map((page) =>
                {
                    if(page instanceof NotePage)
                    {
                        return page;
                    }
                    else
                    {
                        return new NotePage(page);
                    } // else if
                });
        } // end if
    } // end constructor

    //------------------------------------------------------------------------------------------------------------------
    // Properties
    //------------------------------------------------------------------------------------------------------------------

    get id() : string | undefined
    {
        return this.#id;
    }

    //------------------------------------------------------------------------------------------------------------------

    public generateID() : string
    {
        if(!this.#id)
        {
            return this.#id = shortID();
        }
        else
        {
            throw new AppError('Unable to change the ID of an existing note.', 'CannotChangeNoteID');
        } // end if
    } // end generateID

    //------------------------------------------------------------------------------------------------------------------
    // Serialization
    //------------------------------------------------------------------------------------------------------------------

    public toJSON() : NoteLike
    {
        return {
            id: this.id,
            pages: this.pages.map((page) => (page as NotePage).toJSON())
        };
    } // end

    public toDB() : NoteDBRecord
    {
        if(!this.id)
        {
            this.generateID();
        } // end if

        return {
            hash_id: this.id as string
        };
    } // end toDB

    //------------------------------------------------------------------------------------------------------------------
    // Deserialization
    //------------------------------------------------------------------------------------------------------------------

    static fromDB(noteRecord : NoteLike) : Note
    {
        return new Note(noteRecord);
    } // end fromDB

    static async fromJSON(jsonObj : Record<string, unknown>) : Promise<Note>
    {
        let newPages : NotePage[] = [];
        const { id, pages } = jsonObj;

        if(typeof id !== 'string' || typeof id !== 'undefined')
        {
            throw new ValidationError('id', 'not a string');
        } // end if

        if(!Array.isArray(pages) && typeof pages !== 'undefined')
        {
            throw new ValidationError('pages', 'not a string');
        } // end if

        if(pages && pages.length > 0)
        {
            newPages = await Promise.all(pages.map((page) => NotePage.fromJSON(page)));
        } // end if

        return new Note({
            id,
            pages: newPages
        });
    } // end fromJSON
} // end Note

//----------------------------------------------------------------------------------------------------------------------

