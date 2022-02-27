//----------------------------------------------------------------------------------------------------------------------
// AuthResourceAccess
//
// @module
//----------------------------------------------------------------------------------------------------------------------

import $http from 'axios';

// Models
import AccountModel from '../models/account';

//----------------------------------------------------------------------------------------------------------------------

class AuthResourceAccess
{
    completeSignIn(idToken)
    {
        return $http.post('/auth/google', { idToken })
            .then(({ data }) => new AccountModel(data));
    } // end completeSignIn

    async save(account)
    {
        const { data } = await $http.patch(`/api/accounts/${ account.id }`, account);
        account.update(data);

        return account;
    }
} // end AuthResourceAccess

//----------------------------------------------------------------------------------------------------------------------

export default new AuthResourceAccess();

//----------------------------------------------------------------------------------------------------------------------
