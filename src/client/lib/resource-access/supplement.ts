//----------------------------------------------------------------------------------------------------------------------
// SupplementResourceAccess
//----------------------------------------------------------------------------------------------------------------------

import axios from 'axios';

// Interfaces
import { Supplement } from '../../../common/interfaces/common';

//----------------------------------------------------------------------------------------------------------------------

class SupplementResourceAccess
{
    async list(system : string, path : string) : Promise<Supplement[]>
    {
        return axios.get(`/api/systems/${ system }/${ path }`)
            .then(({ data }) => data);
    }

    async search(system : string, path : string, query : string, key = 'name') : Promise<Supplement>
    {
        const params = {};
        params[key] = `@>${ query }`;

        return axios.get(`/api/systems/${ system }/${ path }`, { params })
            .then(({ data }) => data);
    }

    async add(system : string, path : string, supplement : Supplement) : Promise<Supplement>
    {
        return axios.post(`/api/systems/${ system }/${ path }`, supplement)
            .then(({ data }) => data);
    }

    async update(system : string, path : string, supplement : Supplement) : Promise<Supplement>
    {
        return axios.patch(`/api/systems/${ system }/${ path }/${ supplement.id }`, supplement)
            .then(({ data }) => data);
    }

    async delete(system : string, path : string, id : string) : Promise<void>
    {
        return axios.delete(`/api/systems/${ system }/${ path }/${ id }`)
            .then(() => undefined);
    }
}

//----------------------------------------------------------------------------------------------------------------------

export default new SupplementResourceAccess();

//----------------------------------------------------------------------------------------------------------------------
