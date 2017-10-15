//----------------------------------------------------------------------------------------------------------------------
// BaseDataModel
//
// @module
//----------------------------------------------------------------------------------------------------------------------

import _ from 'lodash';
import deepFreeze from 'deep-freeze';

//----------------------------------------------------------------------------------------------------------------------

class BaseDataModel
{
    constructor(def, idPropName='id', isRef=false)
    {
        this.$privateVars = [];
        this.$idPropName = idPropName;

        if(!isRef)
        {
            this._ref = new (Object.getPrototypeOf(this).constructor)(def, idPropName, true);
        } // end if

        // Use our update logic for creation
        this.$buildState(def, isRef);
    } // end constructor

    //------------------------------------------------------------------------------------------------------------------
    // Internal methods
    //------------------------------------------------------------------------------------------------------------------

    /**
     * Adds a new property to this object that references our state.
     *
     * @param {string} prop - The name of the property to add.
     * @param {boolean} readOnly - Should this property be created read-only.
     *
     * @private
     */
    $buildProp(prop, readOnly)
    {
        const propConfig = {
            configurable: false,
            enumerable: true,
            get(){ return this.$state[prop]; },
        };

        if(!readOnly)
        {
            propConfig.set = (val) => { this.$state[prop] = val; };
        } // end if

        // Build a property on this object
        Object.defineProperty(this, prop, propConfig);
    } // end $buildProp

    /**
     * Build the getter/setter properties for this model. This should be overridden in base classes that need to change
     * how those getter/setters function.
     *
     * @param {boolean} readOnly - True if this object is considered read-only.
     *
     * @private
     */
    $buildProps(readOnly)
    {
        // Build getter/setter properties
        _.forIn(this.$state, (value, key) =>
        {
            const desc = Object.getOwnPropertyDescriptor(this, key);
            if(!desc || desc.configurable)
            {
                if(_.startsWith(key, '_') || _.startsWith(key, '$'))
                {
                    // Track this for copy/clone
                    this.$privateVars.push(key);

                    // This is an internal value, and shouldn't be reflected in the state.
                    this[key] = value;

                    // Remove this from the $state object
                    delete this.$state[key];
                }
                else
                {
                    // Build a state based getter/setter
                    this.$buildProp(key, readOnly);
                } // end if
            } // end if
        });
    } // end $buildProps

    $buildState(def, isRef)
    {
        this.$state = _.cloneDeep(def);

        // Build Properties
        this.$buildProps(isRef);

        if(isRef)
        {
            // We freeze the ref object to ensure it is never modified, except by explicit intention. However, we only
            // freeze the enumerable keys, to keep from messing with UI library frameworks that need to add their own
            // keys or other modifications.
            _.each(_.keys(this.$state), (key) =>
            {
                deepFreeze(this.$state[key]);
            });
        } // end isRef
    } // end $buildState

    //------------------------------------------------------------------------------------------------------------------
    // Public Properties
    //------------------------------------------------------------------------------------------------------------------

    // The reference state of the object; i.e. what was last retrieved from the database
    get ref(){ return this._ref; }

    // `_.isEqual` is very performant: `https://www.measurethat.net/Benchmarks/Show/1854/0/lodash-isequal-test`
    get dirty(){ return !_.isEqual(this.$state, this._ref.$state); }

    //------------------------------------------------------------------------------------------------------------------
    // Public Functions
    //------------------------------------------------------------------------------------------------------------------

    /**
     * Makes an exact state clone of the object, breaking any references to the original.
     *
     * @returns {Object}
     */
    clone()
    {
        // We return a new copy of our constructor, instead of 'BaseDataModel' so inheritance works.
        const inst = new (Object.getPrototypeOf(this).constructor)(this.$state, this.$idPropName);

        // Copy private variables
        inst.$privateVars = _.cloneDeep(this.$privateVars);
        _.each(this.$privateVars, (key) =>
        {
            inst[key] = this[key];
        });

        inst._ref.$privateVars = _.cloneDeep(this.$privateVars);
        _.each(this.$privateVars, (key) =>
        {
            inst._ref[key] = this[key];
        });

        // Set our reference state to match
        inst._ref.$state = _.cloneDeep(this._ref.$state);

        deepFreeze(inst._ref.$state);

        return inst;
    } // end clone

    /**
     * Makes a copy of the 'live' state of the object, and removed the id property, making it safe to save as a new
     * object.
     *
     * @returns {Object}
     */
    copy()
    {
        // We return a new copy of our constructor, instead of 'BaseDataModel' so inheritance works.
        const inst = new (Object.getPrototypeOf(this).constructor)(this.$state);

        // Copy private variables
        inst.$privateVars = _.cloneDeep(this.$privateVars);
        _.each(this.$privateVars, (key) =>
        {
            inst[key] = this[key];
        });

        inst._ref.$privateVars = _.cloneDeep(this.$privateVars);
        _.each(this.$privateVars, (key) =>
        {
            inst._ref[key] = this[key];
        });

        // We clear the id property.
        inst.$state[this.$idPropName] = undefined;

        return inst;
    } // end copy

    /**
     * Resets the model's state to match that of the reference state, i.e. the last state retrieved from the database.
     */
    reset()
    {
        this.$state = _.cloneDeep(this._ref.$state);
    } // end reset

    update(def)
    {
        this.$buildState(def);
        this._ref.$buildState(def, true);
    } // end update

    /**
     * Returns a JSON serializable version of the model.
     *
     * @returns {Object}
     */
    toJSON()
    {
        return _.cloneDeep(this.$state);
    } // end toJSON
} // end BaseDataModel

//----------------------------------------------------------------------------------------------------------------------

export default BaseDataModel;

//----------------------------------------------------------------------------------------------------------------------