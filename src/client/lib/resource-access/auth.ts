//----------------------------------------------------------------------------------------------------------------------
// AuthResourceAccess
//----------------------------------------------------------------------------------------------------------------------

import axios from 'axios';

// Models
import { Account as ServerAccount } from '../../../common/models';
import { Account } from '../models/account';

//----------------------------------------------------------------------------------------------------------------------

class AuthResourceAccess
{
    _buildModel(account : ServerAccount) : Account
    {
        return {
            ...account,
            displayName: (account.name || account.email) ?? 'Unknown',
            avatarUrl: account.avatar || `https://identicons.github.com/${ account.id.replace(/-/g, '') }.png`,
        };
    }

    async getCurrentUser() : Promise<Account | null>
    {
        try
        {
            const { data } = await axios.get('/auth/user', { withCredentials: true });
            return this._buildModel(data);
        }
        catch (_error)
        {
            return null;
        }
    }

    async signOut() : Promise<void>
    {
        await axios.post('/auth/logout');
    }

    async save(account : Account) : Promise<Account>
    {
        const { data } = await axios.patch(`/api/accounts/${ account.id }`, account);
        return this._buildModel(data);
    }
}

//----------------------------------------------------------------------------------------------------------------------

export default new AuthResourceAccess();

//----------------------------------------------------------------------------------------------------------------------
