//----------------------------------------------------------------------------------------------------------------------
// CharacterModel
//----------------------------------------------------------------------------------------------------------------------

import _ from 'lodash';

// Utils
import { shortID, colorize } from '../../../common/utils/misc';
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
            name: '',
            description: '',
            portrait: '',
            thumbnail: '',
            color: colorize(shortID()),
            campaign: '',
            details: this._sysDefaults,
            accountID: undefined,
            noteID: undefined
        };
    }

    get dirty() { return !_.isEqual(this.$state, this.$refState); }
    get original() { return { ...this.$refState }; }

    get id() { return this.$state.id; }
    get details() { return this.$state.details; }
    get accountID() { return this.$state.accountID; }
    get noteID() { return this.$state.noteID; }
    get initial() { return (_.get(this.name, '0', '?')).toUpperCase(); }

    get system() { return this.$state.system; }
    set system(val) { this.$state.system = val; }
    get name() { return this.$state.name; }
    set name(val) { this.$state.name = val; }
    get description() { return this.$state.description; }
    set description(val) { this.$state.description = val; }
    get portrait() { return this.$state.portrait; }
    set portrait(val) { this.$state.portrait = val; }
    get thumbnail() { return this.$state.thumbnail; }
    set thumbnail(val) { this.$state.thumbnail = val; }
    get color() { return this.$state.color; }
    set color(val) { this.$state.color = val; }
    get campaign() { return this.$state.campaign; }
    set campaign(val) { this.$state.campaign = val; }

    //------------------------------------------------------------------------------------------------------------------
    // Model API
    //------------------------------------------------------------------------------------------------------------------

    revert()
    {
        this.$state = _.cloneDeep(this.$refState);
    } // end revert

    update(def)
    {
        // TODO: Decide if this is even worth it, as it's caused bugs in the past. It basically means that if a user
        // deletes something, it reverts back to the default, instead of staying removed. I don't think that's right.
        const defaults = _.cloneDeep(this.$defaults);
        this.$state = _.assign({}, defaults, _.cloneDeep(def));
        this.$refState = _.assign({}, defaults, _.cloneDeep(def));
    } // end update

    updateSysDefaults(sysDef)
    {
        this._sysDefaults = sysDef;

        // We only update the details if this is a 'new' instance of a character, otherwise we would be overwriting
        // user data, a bug that lead directly to this code.
        if(!this.id)
        {
            this.$refState.details = _.cloneDeep(sysDef);
            this.$state.details = _.cloneDeep(sysDef);
        } // end if
    } // end updateSysDefaults

    toJSON()
    {
        return _.cloneDeep(this.$state);
    } // end toJSON
} // end CharacterModel

//----------------------------------------------------------------------------------------------------------------------

export default CharacterModel;

//----------------------------------------------------------------------------------------------------------------------
