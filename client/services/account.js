//----------------------------------------------------------------------------------------------------------------------
// AccountService
//
// @module
//----------------------------------------------------------------------------------------------------------------------

import _ from 'lodash';
import Vue from 'vue';
import $http from 'axios';
import Promise from 'bluebird';

import BaseService from './base';

//----------------------------------------------------------------------------------------------------------------------

class AccountService extends BaseService
{
    constructor()
    {
        super();

        // Use this internally to group calls to save that come near each other.
        this._debouncedSave = _.debounce(this.save, 200, { maxWait: 1000});

        // State properties
        this.$defineProperty('account');
    } // end constructor

    getSetting(prop)
    {
        if(this.account)
        {
            return this.account.settings[prop];
        } // end if
    } // end get

    setSetting(prop, value)
    {
        if(this.account)
        {
            Vue.set(this.account.settings, prop, value);
            this._debouncedSave();
        } // end if
    } // end set

    save()
    {
        if(!this.account)
        {
            return Promise.reject(new Error('No Account to save.'));
        } // end if

        return $http.put(`/accounts/${ this.account.id }`, this.account)
            .get('data')
            .then((account) =>
            {
                this.account = account;
            })
            .catch({ status: 403 }, (error) =>
            {
                console.error('Not authorized to change account:', error);
            })
            .catch((error) =>
            {
                console.error('Error saving account:', error);
            });
    } // end save
} // end AccountService

//----------------------------------------------------------------------------------------------------------------------

export default new AccountService();

//----------------------------------------------------------------------------------------------------------------------
