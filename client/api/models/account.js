//----------------------------------------------------------------------------------------------------------------------
// AccountModel
//----------------------------------------------------------------------------------------------------------------------

class AccountModel
{
    constructor(def)
    {
        // Set our properties
        this.$state = Object.assign({
            id: undefined,
            email: undefined,
            name: undefined,
            avatar: undefined,
            permissions: [],
            groups: [],
            settings: {},
            created: Date.now()
        }, def);
    } // end constructor

    //------------------------------------------------------------------------------------------------------------------
    // Properties
    //------------------------------------------------------------------------------------------------------------------

    get id(){ return this.$state.id; }
    get email(){ return this.$state.email; }
    get name(){ return this.$state.name; }
    get displayName(){ return this.$state.name || this.$state.email; }
    get avatar(){ return this.$state.avatar; }
    get avatarUrl()
    {
        const id = this.id.replace(/-/g, '');
        return this.$state.avatar || `https://identicons.github.com/${ id }.png`;
    }
    get groups(){ return this.$state.groups; }

    get permissions(){ return this.$state.permissions; }
    set permissions(val){ this.$state.permissions = val; }
    get settings(){ return this.$state.permissions; }
    set settings(val){ this.$state.settings = val; }

    //------------------------------------------------------------------------------------------------------------------
    // Model API
    //------------------------------------------------------------------------------------------------------------------

    update(def)
    {
        this.$state = Object.assign(this.$state, def);
    } // end update

    toJSON()
    {
        return Object.assign({}, this.$state);
    } // end toJSON
} // end AccountModel

//----------------------------------------------------------------------------------------------------------------------

export default AccountModel;

//----------------------------------------------------------------------------------------------------------------------
