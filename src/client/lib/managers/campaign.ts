//----------------------------------------------------------------------------------------------------------------------
// CampaignManager
//----------------------------------------------------------------------------------------------------------------------

import { Socket, io } from 'socket.io-client';

// Models
import { Account, Campaign, RPGKMessage } from '../../../common/models';

// Stores
import { useAccountStore } from '../resource-access/stores/account';
import { useCampaignStore } from '../resource-access/stores/campaign';

// Resource Access
import campaignRA from '../resource-access/campaign';

//----------------------------------------------------------------------------------------------------------------------

class CampaignManager
{
    #socket : Socket;
    #calledWhileSaving = false;
    #savingPromise : Promise<void> | null = null;

    constructor()
    {
        // Listen for messages on the socket.
        this.#socket = io('/campaign');
        this.#socket.on('message', this._onMessage.bind(this));
    }

    //------------------------------------------------------------------------------------------------------------------
    // Subscriptions
    //------------------------------------------------------------------------------------------------------------------

    async _onAccountChanged(account : Account | null) : Promise<void>
    {
        const campaignStore = useCampaignStore();
        if(account && account.email)
        {
            await campaignStore.load(account.email);
        }
        else
        {
            campaignStore.$reset();
        }
    }

    _onMessage(envelope : RPGKMessage) : void
    {
        const campaignStore = useCampaignStore();
        switch (envelope.type)
        {
            case 'add':
            case 'update':
                campaignStore.update(envelope.payload as Campaign);
                break;

            case 'remove':
                campaignStore.remove({ id: envelope.resource });
                break;
            default:
                console.error(`Unknown message type: ${ envelope.type }`);
                break;
        }
    }

    //------------------------------------------------------------------------------------------------------------------

    async init() : Promise<void>
    {
        const authStore = useAccountStore();

        // Subscriptions
        authStore.$subscribe((_mutation, state) =>
        {
            this._onAccountChanged(state.account);
        });

        if(authStore.account)
        {
            await this._onAccountChanged(authStore.account);
        }
    }

    //------------------------------------------------------------------------------------------------------------------
    // Actions
    //------------------------------------------------------------------------------------------------------------------

    async load() : Promise<void>
    {
        const campaignStore = useCampaignStore();
        await campaignStore.load();
    }

    async select(campaignID : string | null) : Promise<void>
    {
        const campaignStore = useCampaignStore();
        if(campaignID === null)
        {
            campaignStore.current = null;
        }
        else
        {
            let campaign = campaignStore.find(campaignID);
            if(!campaign)
            {
                // We attempt to load a campaign if we don't have it in our list.
                campaign = await campaignRA.get(campaignID);
                campaignStore.update(campaign);
            }

            campaignStore.setCurrent(campaignID);
        }
    }

    async save(campaign ?: Campaign) : Promise<void>
    {
        const campaignStore = useCampaignStore();
        campaign = campaign ?? campaignStore.current ?? undefined;

        if(!campaign)
        {
            console.trace('Attempted to save a campaign without one selected or passed in. This is a bug.');
            return;
        }

        if(this.#savingPromise)
        {
            this.#calledWhileSaving = true;
            return this.#savingPromise;
        }

        // We debounce saves, so we only save once at a time. If save is called while an ongoing save is happening, we
        // will call save again.
        this.#savingPromise = (async () =>
        {
            do
            {
                this.#calledWhileSaving = false;
                // eslint-disable-next-line no-await-in-loop
                await campaignStore.save(campaign);
            } while(this.#calledWhileSaving);
            this.#savingPromise = null;
        })();

        return this.#savingPromise;
    }

    async delete(campaignID : string) : Promise<void>
    {
        const campaignStore = useCampaignStore();
        campaignStore.remove({ id: campaignID });
        await campaignRA.delete(campaignID);
    }
}

//----------------------------------------------------------------------------------------------------------------------

export default new CampaignManager();

//----------------------------------------------------------------------------------------------------------------------
