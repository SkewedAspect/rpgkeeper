//----------------------------------------------------------------------------------------------------------------------
// SupplementResourceAccess
//----------------------------------------------------------------------------------------------------------------------

import axios from 'axios';

// Interfaces
import type { Supplement } from '@rpgk/core';
import type { Reference } from '@rpgk/core/models/reference';

//----------------------------------------------------------------------------------------------------------------------

class SupplementResourceAccess
{
    async list<T extends Supplement = Supplement>(system : string, path : string) : Promise<T[]>
    {
        return axios.get(`/api/systems/${ system }/${ path }`)
            .then(({ data }) => data);
    }

    async listReferences(system : string) : Promise<Reference[]>
    {
        return axios.get(`/api/systems/${ system }/references`)
            .then(({ data }) => data);
    }

    async search<T extends Supplement = Supplement>(
        system : string,
        path : string,
        query : string,
        key = 'name'
    ) : Promise<T>
    {
        const params : Record<string, string> = {};
        params[key] = `@>${ query }`;

        return axios.get(`/api/systems/${ system }/${ path }`, { params })
            .then(({ data }) => data);
    }

    async add<T extends Supplement = Supplement>(
        system : string,
        path : string,
        supplement : Omit<Supplement, 'id'>
    ) : Promise<T>
    {
        // Runtime safety: strip any id that might sneak through (e.g., via 'any' casts)
        const { id, ...safeSupp } = supplement as Supplement;

        return axios.post(`/api/systems/${ system }/${ path }`, safeSupp)
            .then(({ data }) => data);
    }

    async update<T extends Supplement = Supplement>(
        system : string,
        path : string,
        supplement : Supplement
    ) : Promise<T>
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
