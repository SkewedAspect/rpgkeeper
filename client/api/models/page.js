//----------------------------------------------------------------------------------------------------------------------
// NotePageModel
//----------------------------------------------------------------------------------------------------------------------

// Utils
import { markNonConfigurable } from '../utils/nonreactive';

//----------------------------------------------------------------------------------------------------------------------

class NotePageModel
{
    constructor(def)
    {
        // Set our properties
        this.$state = Object.assign({ page_id: undefined, title: undefined, content: undefined }, def);

        // Store our reference model to revert back to
        this.$refState = Object.assign({ page_id: undefined, title: undefined, content: undefined }, def);

        // Mark the ref state as non-configurable, so vue ignores it.
        markNonConfigurable(this, '$refState');
    } // end constructor

    //------------------------------------------------------------------------------------------------------------------
    // Properties
    //------------------------------------------------------------------------------------------------------------------

    get id(){ return this.$state.page_id; }

    get title(){ return this.$state.title; }
    set title(title){ return this.$state.title = title; }
    get content(){ return this.$state.content; }
    set content(content){ return this.$state.content = content; }

    //------------------------------------------------------------------------------------------------------------------
    // Model API
    //------------------------------------------------------------------------------------------------------------------

    revert()
    {
        this.$state = Object.assign(this.$state, this.$refState);
    } // end revert

    update(def)
    {
        this.$state = Object.assign(this.$state, def);
        this.$refState = Object.assign({ page_id: undefined, title: undefined, content: undefined }, def);
    } // end update

    toJSON()
    {
        return {
            page_id: this.$state.page_id,
            title: this.$state.title,
            content: this.$state.content
        };
    } // end toJSON
} // end NotePageModel

//----------------------------------------------------------------------------------------------------------------------

export default NotePageModel;

//----------------------------------------------------------------------------------------------------------------------
