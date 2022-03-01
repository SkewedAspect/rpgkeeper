//----------------------------------------------------------------------------------------------------------------------
// NewsPostModel
//----------------------------------------------------------------------------------------------------------------------

class NewsPostModel
{
    constructor(def)
    {
        // Set our properties
        this.$state = { post_id: undefined,
            title: undefined,
            stinger: undefined,
            content: undefined,
            created: Date.now(),
            edited: Date.now(),
            ...def };
    }

    //------------------------------------------------------------------------------------------------------------------
    // Properties
    //------------------------------------------------------------------------------------------------------------------

    get id() { return this.$state.post_id; }
    get title() { return this.$state.title; }
    get stinger() { return this.$state.stinger; }
    get content() { return this.$state.content; }
    get created() { return this.$state.created; }
    get edited() { return this.$state.edited; }
    get account() { return this.$state.account; }

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

export default NewsPostModel;

//----------------------------------------------------------------------------------------------------------------------
