//----------------------------------------------------------------------------------------------------------------------
// AuthManager
//----------------------------------------------------------------------------------------------------------------------

// Models
import type { Account } from '@rpgk/core';

// Stores
import { useAccountStore } from '../resource-access/stores/account';

// Resource Access
import authRA from '../resource-access/auth';
import permRA from '../resource-access/permissions';

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
        accountStore.$patch({ account, redirectToDashboard: !!account });

        // Load Roles
        await permRA.load();
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

    hasPerm(perm : string) : boolean
    {
        const accountStore = useAccountStore();

        if(accountStore.account)
        {
            return permRA.hasPerm(accountStore.account, perm);
        }

        return false;
    }

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
