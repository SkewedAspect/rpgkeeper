//----------------------------------------------------------------------------------------------------------------------
// BaseSystem
//----------------------------------------------------------------------------------------------------------------------

class BaseSystem
{
    constructor(id, name, description)
    {
        this._id = id;
        this._name = name;
        this._description = description;

        this._router = undefined;
        this._disabled = false;
    } // end constructor

    //------------------------------------------------------------------------------------------------------------------
    // Properties
    //------------------------------------------------------------------------------------------------------------------

    get id(){ return this._id; }
    get name(){ return this._name; }
    get description(){ return this._description; }
    get router(){ return this._router; }
    get disabled(){ return this._disabled; }

    //------------------------------------------------------------------------------------------------------------------
    // API
    //------------------------------------------------------------------------------------------------------------------

    async init()
    {
        /* No work to do here! */
    } // end init

    async getSchema()
    {
        return {};
    } // end getSchema

    async validate(charDetails)
    {
        return true;
    } // end validate

    toJSON()
    {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            disabled: this.disabled
        };
    } // end toJSON
} // end BaseSystem

//----------------------------------------------------------------------------------------------------------------------
module.exports = BaseSystem;

//----------------------------------------------------------------------------------------------------------------------
