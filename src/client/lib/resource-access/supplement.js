//----------------------------------------------------------------------------------------------------------------------
// SupplementResourceAccess
//----------------------------------------------------------------------------------------------------------------------

import axios from 'axios';

//----------------------------------------------------------------------------------------------------------------------

class SupplementResourceAccess
{
    async list(system, path)
    {
        return axios.get(`/api/systems/${ system }/${ path }`)
            .then(({ data }) => data);
    }

    async search(system, path, query, key = 'name')
    {
        const params = {};
        params[key] = `@>${ query }`;

        return axios.get(`/api/systems/${ system }/${ path }`, { params })
            .then(({ data }) => data);
    }

    async add(system, path, supplement)
    {
        return axios.post(`/api/systems/${ system }/${ path }`, supplement)
            .then(({ data }) => data);
    }

    async update(system, path, supplement)
    {
        return axios.patch(`/api/systems/${ system }/${ path }/${ supplement.id }`, supplement)
            .then(({ data }) => data);
    }

    async delete(system, path, id)
    {
        return axios.delete(`/api/systems/${ system }/${ path }/${ id }`)
            .then(() => undefined);
    }
}

//----------------------------------------------------------------------------------------------------------------------

export default new SupplementResourceAccess();

//----------------------------------------------------------------------------------------------------------------------
