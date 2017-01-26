//----------------------------------------------------------------------------------------------------------------------
// CharacterService
//
// @module
//----------------------------------------------------------------------------------------------------------------------

import $http from 'axios';
import Promise from 'bluebird';

import CharacterModel from '../models/character';

//----------------------------------------------------------------------------------------------------------------------

class CharacterService
{
    constructor()
    {
        this.$cache = {};
    } // end constructor

    //------------------------------------------------------------------------------------------------------------------

    get characters(){ return _.values(this.$cache); }

    //------------------------------------------------------------------------------------------------------------------

    _buildHandler()
    {
        return {
            get(target, name)
            {
                if(name in target)
                {
                    return target[name];
                }
                else if(name in target.$base)
                {
                    return target.$base[name];
                }
                else
                {
                    return target.$system[name];
                } // end if
            }
        };
    } // end _buildHandler()

    _buildProxy(baseState)
    {
        // Create a new model, and then wrap it in a proxy for Vue magic!
        const inst = new CharacterModel(baseState);
        return new Proxy(inst, this._buildHandler());
    } // end _buildProxy

    //------------------------------------------------------------------------------------------------------------------

    get(id)
    {
        if(id in this.$cache)
        {
            return Promise.resolve(this.$cache[id]);
        }
        else
        {
            return $http.get(`/characters/${ id }`)
                .get('data')
                .then((baseState) =>
                {
                    return this._buildProxy(baseState);
                })
                .then((proxy) =>
                {
                    // Store the proxy in our cache
                    this.$cache[id] = proxy;

                    // Return the newly created proxy
                    return proxy;
                });
        } // end if
    } // end get

    refresh()
    {
        this.$cache = {};

        return $http.get('/characters')
            .get('data')
            .map((baseState) =>
            {
                const proxy = this._buildProxy(baseState);

                // Store the proxy in our cache
                this.$cache[proxy.id] = proxy;

                // Return the newly created proxy
                return proxy;
            });
    } // end refresh
} // end CharacterService

//----------------------------------------------------------------------------------------------------------------------

export default new CharacterService();

//----------------------------------------------------------------------------------------------------------------------