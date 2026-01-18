<!----------------------------------------------------------------------------------------------------------------------
  -- Campaign Page
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <BContainer id="campaign-page" class="mt-2 mb-3" fluid>
        <!-- Error Handling -->
        <BContainer v-if="pageError">
            <BAlert variant="danger" :model-value="true">
                <h5 class="m-0">
                    <Fa icon="exclamation-triangle" />
                    Error loading campaign
                </h5>
                <div v-for="(line, index) in pageError?.stack?.split('\n')" :key="index">
                    {{ line }}
                </div>
                <div class="text-end">
                    <BButton to="/dashboard" variant="danger">
                        <Fa icon="arrow-left" />
                        Back to Dashboard
                    </BButton>
                </div>
            </BAlert>
        </BContainer>

        <!-- Loading -->
        <LoadingWidget v-else-if="!campaign" />

        <!-- Main Campaign View -->
        <div v-else>
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h1>
                    <Fa icon="flag" class="me-2" />
                    {{ campaign.name }}
                </h1>
                <div>
                    <BButton to="/campaigns" variant="secondary" class="me-2">
                        <Fa icon="arrow-left" />
                        Back to Campaigns
                    </BButton>
                </div>
            </div>

            <!-- Campaign Details Card -->
            <RpgkCard>
                <template #header>
                    <h3>Campaign Overview</h3>
                </template>
                <BRow>
                    <BCol md="6">
                        <div class="mb-3">
                            <strong>Created:</strong> {{ campaign.created }}
                        </div>
                        <div class="mb-3">
                            <strong>Last Updated:</strong> {{ campaign.updated }}
                        </div>
                    </BCol>
                    <BCol md="6">
                        <div class="mb-3">
                            <strong>Description:</strong>
                            <div class="mt-1">
                                {{ campaign.description || 'No description provided.' }}
                            </div>
                        </div>
                    </BCol>
                </BRow>
            </RpgkCard>

            <!-- Placeholder sections for future features -->
            <BRow class="mt-4">
                <BCol md="6">
                    <RpgkCard>
                        <template #header>
                            <h5 class="m-0">
                                Characters
                            </h5>
                        </template>
                        <div class="text-muted">
                            Character management coming soon...
                        </div>
                    </RpgkCard>
                </BCol>
                <BCol md="6">
                    <RpgkCard>
                        <template #header>
                            <h5 class="m-0">
                                Sessions
                            </h5>
                        </template>
                        <div class="text-muted">
                            Session tracking coming soon...
                        </div>
                    </RpgkCard>
                </BCol>
            </BRow>

            <BRow class="mt-4">
                <BCol>
                    <RpgkCard>
                        <template #header>
                            <h5 class="m-0">
                                Notes
                            </h5>
                        </template>
                        <div class="text-muted">
                            Campaign notes coming soon...
                        </div>
                    </RpgkCard>
                </BCol>
            </BRow>
        </div>
    </BContainer>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss" scoped>
    #campaign-page
    {
        // .flash
        // {
        //     animation: flash 1s;
        // }

        // @keyframes flash
        // {
        //     0%, 50%, 100%
        //     {
        //         opacity: 1;
        //     }
        //     25%, 75%
        //     {
        //         opacity: 0.5;
        //     }
        // }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script setup lang="ts">
    import { computed, onBeforeMount, ref } from 'vue';
    import { useRoute } from 'vue-router';

    // Models
    import type { Campaign } from '@rpgk/core';

    // Components
    import LoadingWidget from '../components/ui/loadingWidget.vue';
    import RpgkCard from '../components/ui/rpgkCard.vue';

    // Managers
    import campMan from '../lib/managers/campaign';

    // Stores
    import { useAccountStore } from '../lib/resource-access/stores/account';
    import { useCampaignStore } from '../lib/resource-access/stores/campaign';

    //------------------------------------------------------------------------------------------------------------------
    // Component State
    //------------------------------------------------------------------------------------------------------------------

    const route = useRoute();
    const accountStore = useAccountStore();
    const campaignStore = useCampaignStore();

    const pageError = ref<Error | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Computed Properties
    //------------------------------------------------------------------------------------------------------------------

    const account = computed(() => accountStore.account);

    const campaignID = computed(() : string =>
    {
        return route.params.campaignID as string;
    });

    const campaign = computed(() : Campaign | null =>
    {
        return campaignStore.current;
    });

    const isParticipant = computed(() =>
    {
        if(account.value && campaign.value)
        {
            return campaign.value.participants?.some((participant) => participant.accountID === account.value?.id);
        }

        return false;
    });

    const isOwner = computed(() =>
    {
        if(account.value && campaign.value)
        {
            return campaign.value.participants
                ?.some((participant) => participant.accountID === account.value?.id && participant.role === 'owner');
        }

        return false;
    });

    const isAuthorized = computed(() =>
    {
        return isParticipant.value || isOwner.value;
    });

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    // TODO: Implement shit

    //------------------------------------------------------------------------------------------------------------------
    // Lifecycle
    //------------------------------------------------------------------------------------------------------------------

    onBeforeMount(() =>
    {
        // We always select the campaign that matches our route, so we handle navigation.
        campMan.select(campaignID.value)
            .catch((err) => pageError.value = err);
    });

</script>

<!--------------------------------------------------------------------------------------------------------------------->
