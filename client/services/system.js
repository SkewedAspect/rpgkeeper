//----------------------------------------------------------------------------------------------------------------------
// SystemService
//
// @module
//----------------------------------------------------------------------------------------------------------------------

import _ from 'lodash';
import $http from 'axios';

import BaseService from './base';

//----------------------------------------------------------------------------------------------------------------------

class SystemService extends BaseService
{
    constructor()
    {
        super();

        // State properties
        this.$defineProperty('systems', []);
    } // end constructor

    //------------------------------------------------------------------------------------------------------------------

    get(id)
    {
        return _.find(this.systems, { id }) || id;
    } // end get

    refresh()
    {
        return this.loading = $http.get('/systems')
            .get('data')
            .then((systems) =>
            {
                return this.systems = (systems || []);
            });
    } // end refresh
} // end SystemService

//----------------------------------------------------------------------------------------------------------------------

export default new SystemService();

//----------------------------------------------------------------------------------------------------------------------