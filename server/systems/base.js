//----------------------------------------------------------------------------------------------------------------------
// BaseSystem
//----------------------------------------------------------------------------------------------------------------------

class BaseSystem
{
    constructor(id, name, description, schema = { type: 'object' }, defaults = {}, disabled)
    {
        this._id = id;
        this._name = name;
        this._description = description;
        this._schema = schema;
        this._defaults = defaults;

        this._disabled = disabled;
    } // end constructor

    //------------------------------------------------------------------------------------------------------------------
    // Properties
    //------------------------------------------------------------------------------------------------------------------

    get id() { return this._id; }
    get name() { return this._name; }
    get description() { return this._description; }
    get disabled() { return this._disabled; }
    get schema() { return this._schema; }
    get defaults() { return this._defaults; }

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
            disabled: this.disabled
        };
    } // end toJSON
} // end BaseSystem

//----------------------------------------------------------------------------------------------------------------------
module.exports = BaseSystem;

//----------------------------------------------------------------------------------------------------------------------
