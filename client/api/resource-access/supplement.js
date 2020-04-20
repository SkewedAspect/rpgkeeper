//----------------------------------------------------------------------------------------------------------------------
// SupplementResourceAccess
//----------------------------------------------------------------------------------------------------------------------

import axios from 'axios';

//----------------------------------------------------------------------------------------------------------------------

class SupplementResourceAccess
{
    async list(system, path)
    {
        return axios.get(`/systems/${ system }/${ path }`)
            .then(({ data }) => data);
    } // end list

    async search(system, path, query, key = 'name')
    {
        const params = {};
        params[key] = `@>${ query }`;

        return axios.get(`/systems/${ system }/${ path }`, { params })
            .then(({ data }) => data);
    } // end search

    async add(system, path, supplement)
    {
        return axios.post(`/systems/${ system }/${ path }`, supplement)
            .then(({ data }) => data);
    } // end add

    async update(system, path, supplement)
    {
        return axios.patch(`/systems/${ system }/${ path }/${ supplement.name }`, supplement)
            .then(({ data }) => data);
    } // end update

    async delete(system, path, name)
    {
        return axios.delete(`/systems/${ system }/${ path }/${ name }`)
            .then(() => undefined);
    } // end delete
} // end SupplementResourceAccess

//----------------------------------------------------------------------------------------------------------------------

export default new SupplementResourceAccess();

//----------------------------------------------------------------------------------------------------------------------
