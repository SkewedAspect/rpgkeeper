//----------------------------------------------------------------------------------------------------------------------
// AuthManager
//----------------------------------------------------------------------------------------------------------------------

// Models
import { Account } from '../models/account';

// Stores
import { useAccountStore } from '../stores/account';

// Resource Access
import authRA from '../resource-access/auth';

//----------------------------------------------------------------------------------------------------------------------

class AuthManager
{
    //------------------------------------------------------------------------------------------------------------------
    // Properties
    //------------------------------------------------------------------------------------------------------------------

    get account() : Account | null
    {
        const accountStore = useAccountStore();
        return accountStore.account;
    }

    //------------------------------------------------------------------------------------------------------------------

    async load() : Promise<void>
    {
        const accountStore = useAccountStore();

        // Attempt to get the current user
        const account = await authRA.getCurrentUser();

        // Update the store
        accountStore.$patch({ account, signedInBeforeLoad: true });
    }

    //------------------------------------------------------------------------------------------------------------------
    // Public
    //------------------------------------------------------------------------------------------------------------------

    async signOut() : Promise<void>
    {
        await authRA.signOut();

        // Normally we'd have to update the store, but we just reload the whole page.
        window.location.reload();
    }

    //------------------------------------------------------------------------------------------------------------------
    // API
    //------------------------------------------------------------------------------------------------------------------

    async saveAccount(account : Account) : Promise<void>
    {
        const accountStore = useAccountStore();

        // Attempt to save the account
        const newAccount = await authRA.save(account);

        // Update the store
        accountStore.$patch({ account: newAccount });
    }
}

//----------------------------------------------------------------------------------------------------------------------

export default new AuthManager();

//----------------------------------------------------------------------------------------------------------------------
