//----------------------------------------------------------------------------------------------------------------------
// BaseSystem
//----------------------------------------------------------------------------------------------------------------------

class BaseSystem
{
    constructor(id, name, description, schema = { type: 'object' }, defaults = {}, suppPaths = [], status = undefined)
    {
        this._id = id;
        this._name = name;
        this._description = description;
        this._schema = schema;
        this._defaults = defaults;
        this._supplementPaths = suppPaths;

        // Enum: 'dev', 'beta', 'disabled', or undefined.
        this._status = status;
    } // end constructor

    //------------------------------------------------------------------------------------------------------------------
    // Properties
    //------------------------------------------------------------------------------------------------------------------

    get id() { return this._id; }
    get name() { return this._name; }
    get description() { return this._description; }
    get status() { return this._status; }
    get schema() { return this._schema; }
    get defaults() { return this._defaults; }
    get supplementPaths() { return this._supplementPaths; }

    //------------------------------------------------------------------------------------------------------------------
    // API
    //------------------------------------------------------------------------------------------------------------------

    async init()
    {
        /* No work to do here! */
    } // end init

    toJSON()
    {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            defaults: this.defaults,
            supplementPaths: this.supplementPaths,
            status: this.status
        };
    } // end toJSON
} // end BaseSystem

//----------------------------------------------------------------------------------------------------------------------
module.exports = BaseSystem;

//----------------------------------------------------------------------------------------------------------------------
