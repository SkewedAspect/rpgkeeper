//----------------------------------------------------------------------------------------------------------------------
// AuthResourceAccess
//----------------------------------------------------------------------------------------------------------------------

import $http from 'axios';

// Models
import { Account } from '../../../common/interfaces/common';
import { AccountModel } from '../models/account';

//----------------------------------------------------------------------------------------------------------------------

class AuthResourceAccess
{
    _buildModel(account : Account) : AccountModel
    {
        return {
            ...account,
            displayName: (account.name || account.email) ?? 'Unknown',
            avatarUrl: account.avatar || `https://identicons.github.com/${ account.id.replace(/-/g, '') }.png`
        };
    }

    async completeSignIn(idToken : string) : Promise<AccountModel>
    {
        const { data } = await $http.post('/auth/google', { idToken });
        return this._buildModel(data);
    }

    async save(account : AccountModel) : Promise<AccountModel>
    {
        const { data } = await $http.patch(`/api/accounts/${ account.id }`, account);
        return data;
    }
}

//----------------------------------------------------------------------------------------------------------------------

export default new AuthResourceAccess();

//----------------------------------------------------------------------------------------------------------------------
