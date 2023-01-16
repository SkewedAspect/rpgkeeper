//----------------------------------------------------------------------------------------------------------------------
// CharacterModel
//----------------------------------------------------------------------------------------------------------------------

import _ from 'lodash';

// Interfaces
import { Character } from '../../../common/interfaces/common';

// Utils
import { shortID, colorize } from '../../../common/utils/misc';
import { markNonConfigurable } from '../utils/nonreactive';

//----------------------------------------------------------------------------------------------------------------------

class CharacterModel<SystemDetails extends Record<string, unknown> = Record<string, unknown>>
{
    private _state : Partial<Character<SystemDetails>>;
    private _refState : Partial<Character<SystemDetails>>;
    private _sysDefaults : Record<string, unknown>;

    constructor(def : Partial<Character<SystemDetails>>, sysDefaults : Record<string, unknown> = {})
    {
        // Save off the defaults for the system specific portion.
        this._sysDefaults = _.cloneDeep(sysDefaults);

        // Set some defaults
        this._state = { ...this.$defaults };
        this._refState = { ...this.$defaults };

        // Set our properties
        this.update(def);

        // Mark the ref state as non-configurable, so vue ignores it.
        markNonConfigurable(this, '_refState');
    }

    //------------------------------------------------------------------------------------------------------------------
    // Properties
    //------------------------------------------------------------------------------------------------------------------

    get $defaults() : Partial<Character<SystemDetails>>
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
            details: this._sysDefaults as SystemDetails,
            accountID: undefined,
            noteID: undefined
        };
    }

    get dirty() : boolean { return !_.isEqual(this._state, this._refState); }
    get original() : Partial<Character<SystemDetails>> { return { ...this._refState }; }

    get id() : string | undefined { return this._state.id; }
    get details() : SystemDetails { return this._state.details ?? {} as SystemDetails; }
    get accountID() : string | undefined { return this._state.accountID; }
    get noteID() : string | undefined { return this._state.noteID; }
    get initial() : string
    {
        if(this.name)
        {
            const nameParts = this.name.split(' ');
            const initials = nameParts[0][0] + (nameParts[1]?.[0] ?? '');

            return initials.toUpperCase();
        }
        else
        {
            return '-';
        }
    }

    get system() : string | undefined { return this._state.system; }
    set system(val : string | undefined) { this._state.system = val; }
    get name() : string | undefined { return this._state.name; }
    set name(val : string | undefined) { this._state.name = val; }
    get description() : string | undefined { return this._state.description; }
    set description(val : string | undefined) { this._state.description = val; }
    get portrait() : string | undefined { return this._state.portrait; }
    set portrait(val : string | undefined) { this._state.portrait = val; }
    get thumbnail() : string | undefined { return this._state.thumbnail; }
    set thumbnail(val : string | undefined) { this._state.thumbnail = val; }
    get color() : string | undefined { return this._state.color; }
    set color(val : string | undefined) { this._state.color = val; }
    get campaign() : string | undefined { return this._state.campaign; }
    set campaign(val : string | undefined) { this._state.campaign = val; }

    //------------------------------------------------------------------------------------------------------------------
    // Model API
    //------------------------------------------------------------------------------------------------------------------

    revert() : void
    {
        this._state = _.cloneDeep(this._refState);
    }

    update(def : Partial<Character<SystemDetails>>) : void
    {
        // TODO: Decide if this is even worth it, as it's caused bugs in the past. It basically means that if a user
        // deletes something, it reverts back to the default, instead of staying removed. I don't think that's right.
        const defaults = _.cloneDeep(this.$defaults);
        this._state = _.assign({}, defaults, _.cloneDeep(def));
        this._refState = _.assign({}, defaults, _.cloneDeep(def));
    }

    updateSysDefaults(sysDef : SystemDetails) : void
    {
        this._sysDefaults = sysDef;

        // We only update the details if this is a 'new' instance of a character, otherwise we would be overwriting
        // user data, a bug that lead directly to this code.
        if(!this.id)
        {
            this._refState.details = _.cloneDeep(sysDef);
            this._state.details = _.cloneDeep(sysDef);
        }
    }

    toJSON() : Partial<Character<SystemDetails>>
    {
        return _.cloneDeep(this._state);
    }
}

//----------------------------------------------------------------------------------------------------------------------

export default CharacterModel;

//----------------------------------------------------------------------------------------------------------------------
