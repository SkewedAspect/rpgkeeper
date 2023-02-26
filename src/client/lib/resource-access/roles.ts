//----------------------------------------------------------------------------------------------------------------------
// RolesResourceAccess
//----------------------------------------------------------------------------------------------------------------------

import $http from 'axios';

// Interfaces
import { Role } from '../../../common/interfaces/common';

//----------------------------------------------------------------------------------------------------------------------

class RolesResourceAccess
{
    async list() : Promise<Role[]>
    {
        const { data } = await $http.get('/api/roles');
        return data;
    }
}

//----------------------------------------------------------------------------------------------------------------------

export default new RolesResourceAccess();

//----------------------------------------------------------------------------------------------------------------------