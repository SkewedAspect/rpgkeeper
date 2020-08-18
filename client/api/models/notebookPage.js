//----------------------------------------------------------------------------------------------------------------------
// NotebookPageModel
//----------------------------------------------------------------------------------------------------------------------

// Utils
import { markNonConfigurable } from '../utils/nonreactive';

//----------------------------------------------------------------------------------------------------------------------

class NotebookPageModel
{
    constructor(def)
    {
        // Set our properties
        this.$state = { id: undefined, title: undefined, content: undefined, ...def };

        // Store our reference model to revert back to
        this.$refState = { id: undefined, title: undefined, content: undefined, ...def };

        // Mark the ref state as non-configurable, so vue ignores it.
        markNonConfigurable(this, '$refState');
    } // end constructor

    //------------------------------------------------------------------------------------------------------------------
    // Properties
    //------------------------------------------------------------------------------------------------------------------

    get id() { return this.$state.id; }

    get title() { return this.$state.title; }
    set title(title) { this.$state.title = title; }
    get content() { return this.$state.content; }
    set content(content) { this.$state.content = content; }

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
        this.$refState = { id: undefined, title: undefined, content: undefined, ...def };
    } // end update

    toJSON()
    {
        return {
            id: this.$state.id,
            title: this.$state.title,
            content: this.$state.content
        };
    } // end toJSON
} // end NotebookPageModel

//----------------------------------------------------------------------------------------------------------------------

export default NotebookPageModel;

//----------------------------------------------------------------------------------------------------------------------
