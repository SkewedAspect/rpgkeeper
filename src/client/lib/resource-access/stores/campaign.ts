//----------------------------------------------------------------------------------------------------------------------
// Campaign Store
//----------------------------------------------------------------------------------------------------------------------

import { defineStore } from 'pinia';

// Models
import { Campaign } from '../../../../common/models';

// Resource Access
import campaignRA from '../campaign';

//----------------------------------------------------------------------------------------------------------------------

export type CampaignStoreStatus = 'unloaded' | 'loading' | 'loaded';

export interface CampaignsStoreState
{
    status : CampaignStoreStatus;
    saving : boolean;
    current : Campaign | null;
    campaigns : Campaign[];
}

//----------------------------------------------------------------------------------------------------------------------

export const useCampaignStore = defineStore('campaigns', {
    state() : CampaignsStoreState
    {
        return {
            status: 'unloaded',
            saving: false,
            current: null,
            campaigns: [],
        };
    },
    getters: {
        recentCampaigns() : Campaign[]
        {
            return this.campaigns
                .slice()
                .sort((campaignA, campaignB) => campaignB.updated - campaignA.updated);
        },
    },
    actions: {
        async load(email ?: string) : Promise<void>
        {
            this.$reset();

            this.status = 'loading';
            this.campaigns = await campaignRA.list(email);
            this.status = 'loaded';
        },
        async save(campaign ?: Campaign) : Promise<void>
        {
            campaign = campaign ?? this.current ?? undefined;
            if(campaign)
            {
                this.saving = true;
                this.update(await campaignRA.update(campaign));
            }
        },
        find(campaignID : string) : Campaign | undefined
        {
            return this.campaigns.find((campaign) => campaign.id === campaignID);
        },
        setCurrent(campaignID : string | null) : void
        {
            if(campaignID === null)
            {
                this.current = null;
            }
            else
            {
                const campaign = this.find(campaignID);
                if(campaign)
                {
                    this.current = campaign;
                }
            }
        },
        update(campaign : Campaign) : void
        {
            // Is this the current character? If so, replace.
            if(this.current?.id === campaign.id)
            {
                this.current = campaign;
            }

            // Now, find it in the list, and update.
            let charIdx = this.campaigns.findIndex((item) => item.id === campaign.id);
            if(charIdx === -1)
            {
                charIdx = this.campaigns.length;
            }

            this.campaigns.splice(charIdx, 1, campaign);
        },
        remove(campaign : { id : string | null }) : void
        {
            // Is this the current character? If so, we be null, boys!
            if(this.current?.id === campaign.id)
            {
                this.current = null;
            }

            // Now, find it in the list, and remove.
            const charIdx = this.campaigns.findIndex((item) => item.id === campaign.id);
            if(charIdx !== -1)
            {
                this.campaigns.splice(charIdx, 1);
            }
        },
    },
});

//----------------------------------------------------------------------------------------------------------------------
