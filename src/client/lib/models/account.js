//----------------------------------------------------------------------------------------------------------------------
// AccountModel
//----------------------------------------------------------------------------------------------------------------------

class AccountModel
{
    constructor(def)
    {
        // Set our properties
        this.$state = { id: undefined,
            email: undefined,
            name: undefined,
            avatar: undefined,
            permissions: [],
            groups: [],
            settings: {},
            created: Date.now(),
            ...def };
    }

    //------------------------------------------------------------------------------------------------------------------
    // Properties
    //------------------------------------------------------------------------------------------------------------------

    get id() { return this.$state.id; }
    get email() { return this.$state.email; }
    get displayName() { return this.$state.name || this.$state.email; }
    get avatar() { return this.$state.avatar; }
    get avatarUrl()
    {
        const id = this.id.replace(/-/g, '');
        return this.$state.avatar || `https://identicons.github.com/${ id }.png`;
    }

    get groups() { return this.$state.groups; }

    get name() { return this.$state.name; }
    set name(val) { this.$state.name = val; }
    get permissions() { return this.$state.permissions; }
    set permissions(val) { this.$state.permissions = val; }
    get settings() { return this.$state.permissions; }
    set settings(val) { this.$state.settings = val; }

    //------------------------------------------------------------------------------------------------------------------
    // Model API
    //------------------------------------------------------------------------------------------------------------------

    update(def)
    {
        this.$state = Object.assign(this.$state, def);
    }

    toJSON()
    {
        return { ...this.$state };
    }
}

//----------------------------------------------------------------------------------------------------------------------

export default AccountModel;

//----------------------------------------------------------------------------------------------------------------------
