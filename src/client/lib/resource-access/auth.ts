//----------------------------------------------------------------------------------------------------------------------
// AuthResourceAccess
//----------------------------------------------------------------------------------------------------------------------

import $http from 'axios';

// Models
import { Account as ServerAccount } from '../../../common/interfaces/common';
import { Account } from '../models/account';

//----------------------------------------------------------------------------------------------------------------------

class AuthResourceAccess
{
    _buildModel(account : ServerAccount) : Account
    {
        return {
            ...account,
            displayName: (account.name || account.email) ?? 'Unknown',
            avatarUrl: account.avatar || `https://identicons.github.com/${ account.id.replace(/-/g, '') }.png`
        };
    }

    async completeSignIn(idToken : string) : Promise<Account>
    {
        const { data } = await $http.post('/auth/google', { idToken });
        return this._buildModel(data);
    }

    async save(account : Account) : Promise<Account>
    {
        const { data } = await $http.patch(`/api/accounts/${ account.id }`, account);
        return data;
    }
}

//----------------------------------------------------------------------------------------------------------------------

export default new AuthResourceAccess();

//----------------------------------------------------------------------------------------------------------------------
