//----------------------------------------------------------------------------------------------------------------------
// CharacterModel
//----------------------------------------------------------------------------------------------------------------------

import _ from 'lodash';

// Utils
import { shortID, colorize } from '../../../server/utils/misc';
import { markNonConfigurable } from '../utils/nonreactive';

//----------------------------------------------------------------------------------------------------------------------

class CharacterModel
{
    constructor(def, sysDefaults = {})
    {
        // Save off the defaults for the system specific portion.
        this._sysDefaults = _.cloneDeep(sysDefaults);

        // Set our properties
        this.update(def);

        // Mark the ref state as non-configurable, so vue ignores it.
        markNonConfigurable(this, '$refState');
    } // end constructor

    //------------------------------------------------------------------------------------------------------------------
    // Properties
    //------------------------------------------------------------------------------------------------------------------

    get $defaults()
    {
        return {
            id: undefined,
            system: undefined,
            name: "",
            description: "",
            portrait: "",
            thumbnail: "",
            color: colorize(shortID()),
            biography: "",
            details: this._sysDefaults,
            account_id: undefined,
            note_id: undefined
        };
    }

    get dirty(){ return !_.isEqual(this.$state, this.$refState); }
    get original(){ return Object.assign({}, this.$refState); }

    get id(){ return this.$state.id; }
    get details(){ return this.$state.details; }
    get account_id(){ return this.$state.account_id; }
    get note_id(){ return this.$state.note_id; }
    get initial(){ return (_.get(this.name, '0', '?')).toUpperCase(); }

    get system(){ return this.$state.system; }
    set system(val){ this.$state.system = val; }
    get name(){ return this.$state.name; }
    set name(val){ this.$state.name = val; }
    get description(){ return this.$state.description; }
    set description(val){ this.$state.description = val; }
    get portrait(){ return this.$state.portrait; }
    set portrait(val){ this.$state.portrait = val; }
    get thumbnail(){ return this.$state.thumbnail; }
    set thumbnail(val){ this.$state.thumbnail = val; }
    get color(){ return this.$state.color; }
    set color(val){ this.$state.color = val; }
    get biography(){ return this.$state.biography; }
    set biography(val){ this.$state.biography = val; }

    //------------------------------------------------------------------------------------------------------------------
    // Model API
    //------------------------------------------------------------------------------------------------------------------

    revert()
    {
        this.$state = _.cloneDeep(this.$refState);
    } // end revert

    update(def)
    {
        const defaults = _.cloneDeep(this.$defaults);
        this.$state = _.merge({}, defaults, _.cloneDeep(def));
        this.$refState = _.merge({}, defaults, _.cloneDeep(def));
    } // end update

    toJSON()
    {
        return Object.assign({}, this.$state);
    } // end toJSON
} // end CharacterModel

//----------------------------------------------------------------------------------------------------------------------

export default CharacterModel;

//----------------------------------------------------------------------------------------------------------------------
