//----------------------------------------------------------------------------------------------------------------------
/// SystemsService
///
/// @module
//----------------------------------------------------------------------------------------------------------------------

import _ from 'lodash';
import $http from 'axios';

//----------------------------------------------------------------------------------------------------------------------

class SystemsService {
    constructor()
    {
        this.systems = [];
        this.loading = this.refresh();
    } // end constructor

    get(id)
    {
        return _.find(this.systems, { id });
    } // end get

    getChar(system, charID)
    {
        return $http.get(`/systems/${ system }/character/${ charID }`)
            .then((response) =>
            {
                return response.data;
            })
            .catch((response) =>
            {
                if(response.status !== 404)
                {
                    console.error('Error getting system character:', response.data);
                } // end if
            });
    } // end getChar

    refresh()
    {
        return $http.get('/systems')
            .then((response) =>
            {
                this.systems = response.data || [];
                return this.systems;
            });
    } // end refresh
} // end SystemsService

//----------------------------------------------------------------------------------------------------------------------

export default new SystemsService();

//----------------------------------------------------------------------------------------------------------------------