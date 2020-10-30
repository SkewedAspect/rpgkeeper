//----------------------------------------------------------------------------------------------------------------------
// NotebookModel
//----------------------------------------------------------------------------------------------------------------------

class NotebookModel
{
    constructor(def)
    {
        this._id = def.id;
        this._pages = def.pages || [];
    } // end constructor

    //------------------------------------------------------------------------------------------------------------------
    // Properties
    //------------------------------------------------------------------------------------------------------------------

    get id() { return this._id; }
    get pages() { return this._pages; }

    //------------------------------------------------------------------------------------------------------------------
    // Model API
    //------------------------------------------------------------------------------------------------------------------

    revert()
    {
        this.pages.forEach((page) => page.revert());
    } // end revert

    update(def)
    {
        this._id = def.id;
        this._pages = def.pages || [];
    } // end update

    toJSON()
    {
        return {
            id: this._id,
            pages: this.pages.map((page) => page.toJSON())
        };
    } // end toJSON
} // end NotebookModel

//----------------------------------------------------------------------------------------------------------------------

export default NotebookModel;

//----------------------------------------------------------------------------------------------------------------------