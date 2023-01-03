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

    async getCurrentUser() : Promise<Account | undefined>
    {
        try
        {
            const { data } = await $http.get('/auth/user', { withCredentials: true });
            return this._buildModel(data);
        }
        catch (error)
        {
            return undefined;
        }
    }

    async signOut() : Promise<void>
    {
        await $http.post('/auth/logout');
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
