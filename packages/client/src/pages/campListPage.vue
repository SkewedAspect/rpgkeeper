<!----------------------------------------------------------------------------------------------------------------------
  -- Campaign List
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <BContainer id="camp-list" class="pb-0">
        <ListCard
            :icon="'notebook'"
            :title="'Campaigns'"
            :fill="true"
            :items="campaignItems"
            :loading="campsLoading"
        >
            <template #header-right>
                <BButton variant="primary" size="sm">
                    <Fa icon="plus" />
                    New
                </BButton>
            </template>

            <template #no-items>
                <div class="text-center text-muted">
                    No campaigns, yet.
                </div>
                <div class="text-center text-muted mt-2">
                    <small>To add one, click the 'New' button.</small>
                </div>
            </template>

            <template #item="{ item }">
                <div class="d-flex">
                    <div class="me-2 d-flex flex-column justify-content-center">
                        <Fa :icon="[ 'fas', 'book' ]" size="2x" />
                    </div>
                    <div class="flex-grow-1">
                        <h5 class="m-0">
                            {{ item.name }}
                            <small />
                        </h5>
                        <p class="m-0">
                            {{ item.description }}
                        </p>
                    </div>
                    <div class="ms-auto d-flex flex-column justify-content-center" style="width: 50px;">
                        <BBadge
                            class="w-100"
                            :variant="getCampaignRole(item) === 'owner' ? 'info' : 'secondary'"
                        >
                            {{ capitalize(getCampaignRole(item)) }}
                        </BBadge>
                    </div>
                </div>
            </template>
        </ListCard>
    </BContainer>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss">
    #camp-list {
        padding: 16px;

        .system-filter-checkbox {
            label {
                width: 100%;
                display: flex;
            }
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed } from 'vue';
    import { storeToRefs } from 'pinia';

    // Interfaces
    import type { Campaign, CampaignRole } from '@rpgk/core';

    // Stores
    import { useAccountStore } from '../lib/resource-access/stores/account';
    import { useCampaignStore } from '../lib/resource-access/stores/campaign';

    // Components
    import ListCard from '../components/ui/listCard.vue';
    import { FontAwesomeIcon as Fa } from '@fortawesome/vue-fontawesome';

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const { account } = storeToRefs(useAccountStore());
    const { campaigns, status } = storeToRefs(useCampaignStore());

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const campsLoading = computed(() => status.value === 'loading');

    const campaignItems = computed(() => campaigns.value.map((camp) => ({
        ...camp,
        to: `/campaigns/${ camp.id }`,
    })));

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function getCampaignRole(campaign : Campaign) : CampaignRole
    {
        const role = campaign.participants.find((part) => part.accountID === account.value.id);
        if(role)
        {
            return role.role;
        }

        console.warn('No role found for account', account.value.id, 'in campaign', campaign.id);

        return 'player';
    }

    function capitalize(value : string) : string
    {
        return value.charAt(0).toUpperCase() + value.slice(1);
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
