<!----------------------------------------------------------------------------------------------------------------------
  -- Main Application Dashboard
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <BContainer id="dashboard" class="pb-0">
        <div v-if="recentCharacters.length > 0" class="my-2">
            <h3>Recent Characters</h3>
            <div class="d-flex gap-2 flex-wrap">
                <CharCard v-for="char in recentCharacters" :key="char.id" :character="char" class="flex-fill" />
            </div>
        </div>
        <BFormRow :class="recentCharacters.length == 0 ? 'mt-3' : ''">
            <!-- Campaigns Column -->
            <BCol v-if="features.campaigns" cols="12" lg="6" class="mb-3">
                <ListCard
                    icon="notebook"
                    title="Campaigns"
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
            </BCol>

            <!-- Characters Column -->
            <BCol cols="12" :lg="features.campaigns ? 6 : 12" class="mb-3">
                <!-- Characters Card -->
                <BCard header-bg-variant="dark" header-text-variant="white" class="shadow-sm h-100" no-body>
                    <template #header>
                        <div class="d-flex">
                            <h5 class="align-items-center d-flex text-nowrap m-0 me-2 flex-grow-0 flex-shrink-0 w-auto">
                                <Fa class="me-1" icon="users" />
                                <span class="d-none d-md-inline">Characters</span>
                            </h5>
                            <BInputGroup class="flex-fill ms-auto" style="max-width: 400px">
                                <BFormInput v-model="charFilter" placeholder="Search Characters..." />
                                <template #append>
                                    <BButton variant="primary">
                                        <Fa icon="search" />
                                    </BButton>
                                </template>
                            </BInputGroup>

                            <!-- System Filter Dropdown -->
                            <BDropdown id="filterSystems" class="ms-2 flex-grow-0 flex-shrink-0 w-auto" right>
                                <template #button-content>
                                    <Fa icon="filter" />
                                    Systems
                                </template>

                                <template v-for="(group, groupIndex) in groupedSystems" :key="groupIndex">
                                    <BDropdownDivider v-if="groupIndex > 0" />
                                    <BDropdownForm class="system-filter-checkbox">
                                        <BFormCheckbox
                                            v-for="system in group"
                                            :key="system.id"
                                            v-model="systemsFilter"
                                            :value="system.id"
                                            class="block-labels"
                                            @click.stop
                                        >
                                            <div class="text-nowrap d-flex w-100" @click.stop>
                                                <div class="me-3">
                                                    {{ system.name }}
                                                </div>
                                                <div class="ms-auto">
                                                    <BBadge
                                                        v-if="system.status && system.status !== 'stable'"
                                                        :variant="getStatusVariant(system.status)"
                                                        :title="getStatusDescription(system.status)"
                                                    >
                                                        <Fa :icon="getStatusIcon(system.status)" />
                                                        {{ getStatusDisplay(system.status) }}
                                                    </BBadge>
                                                </div>
                                            </div>
                                        </BFormCheckbox>
                                    </BDropdownForm>
                                </template>
                                <BDropdownDivider />
                                <BDropdownItem style="pointer-events: none">
                                    <div style="pointer-events: all" @click.stop="selectAllSystems()">
                                        <Fa icon="check-square" />
                                        Select All
                                    </div>
                                </BDropdownItem>
                                <BDropdownItem style="pointer-events: none">
                                    <div style="pointer-events: all" @click.stop="selectNoneSystems()">
                                        <Fa :icon="['far', 'square']" />
                                        Select None
                                    </div>
                                </BDropdownItem>
                            </BDropdown>
                        </div>
                    </template>

                    <!-- List of Characters -->
                    <div v-if="charsLoading" class="card-body">
                        <LoadingWidget />
                    </div>

                    <BListGroup v-else-if="characters.length > 0" id="char-list" flush>
                        <BListGroupItem v-for="char in characters" :key="char.id" :to="`/characters/${ char.id }`">
                            <div class="d-flex">
                                <CharThumbnail :char="char" />
                                <div class="ms-2 flex-column d-flex justify-content-center flex-fill">
                                    <h5 class="mb-1">
                                        {{ char.name }}
                                    </h5>
                                    <p class="text-muted m-0">
                                        <BBadge class="me-1">
                                            {{ getSystem(char.system)?.name }}
                                        </BBadge>
                                        <small>{{ char.campaign }}</small>
                                    </p>
                                </div>
                                <div
                                    class="me-2 flex-column d-flex justify-content-center flex-nowrap"
                                    style="flex: 0 0 auto"
                                >
                                    <CloseButton title="Edit User" @click.prevent.stop="openAddEditModal(char)">
                                        <Fa icon="user-edit" size="xl" />
                                    </CloseButton>
                                </div>
                                <div
                                    class="ms-2 flex-column d-flex justify-content-center flex-nowrap"
                                    style="flex: 0 0 auto"
                                >
                                    <CloseButton
                                        class="btn-close"
                                        title="Delete Character"
                                        @click.prevent.stop="openDelCharacter(char)"
                                    >
                                        <Fa icon="trash-alt" size="xl" />
                                    </CloseButton>
                                </div>
                            </div>
                        </BListGroupItem>
                    </BListGroup>

                    <div v-else class="card-body">
                        <h6 class="text-center text-muted">
                            No Characters found.
                        </h6>
                    </div>

                    <div class="card-body text-end">
                        <BButton variant="primary" @click="openAddEditModal()">
                            <Fa icon="user-plus" />
                            New Character
                        </BButton>
                    </div>
                </BCard>
            </BCol>
        </BFormRow>

        <!-- Modals -->
        <AddEditModal ref="addEditModal" @save="onSave" />
        <DeleteModal ref="delModal" @delete="onDelete" />
    </BContainer>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss">
    #dashboard {
        max-height: calc(100vh - 156px);
        padding-left: 16px;
        padding-right: 16px;
        overflow: hidden;

        #char-list {
            max-height: calc(100vh - 460px);
            overflow-y: auto;
        }

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
    import { computed, onMounted, ref, useTemplateRef } from 'vue';
    import { storeToRefs } from 'pinia';
    import { useRouter } from 'vue-router';
    import type { BaseColorVariant } from 'bootstrap-vue-next';

    // Interfaces
    import type { Campaign, CampaignRole, Character, SystemDefinition } from '@rpgk/core';

    // Stores
    import { useAccountStore } from '../lib/resource-access/stores/account';
    import { useSystemStore } from '../lib/resource-access/stores/systems';
    import { useCharacterStore } from '../lib/resource-access/stores/characters';
    import { useCampaignStore } from '../lib/resource-access/stores/campaign';

    // Managers
    import systemsMan from '../lib/managers/systems';
    import characterMan from '../lib/managers/character';
    import campaignMan from '../lib/managers/campaign';

    // Config
    import { features } from '../lib/config/features';

    // Components
    import LoadingWidget from '../components/ui/loadingWidget.vue';
    import AddEditModal from '../components/character/addEditModal.vue';
    import CharCard from '../components/character/charCard.vue';
    import DeleteModal from '../components/character/deleteModal.vue';
    import CharThumbnail from '../components/character/charThumbnail.vue';
    import CloseButton from '../components/ui/closeButton.vue';
    import ListCard from '../components/ui/listCard.vue';

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const { account, redirectToDashboard } = storeToRefs(useAccountStore());
    const router = useRouter();
    const sysStore = useSystemStore();
    const charStore = useCharacterStore();
    const campaignStore = useCampaignStore();

    const charFilter = ref('');
    const systemsFilter = ref<string[]>([]);

    const addEditModal = useTemplateRef<InstanceType<typeof AddEditModal>>('addEditModal');
    const delModal = useTemplateRef<InstanceType<typeof DeleteModal>>('delModal');

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const charsLoading = computed(() =>
    {
        return !account.value || sysStore.status !== 'loaded' || charStore.status !== 'loaded';
    });

    const campsLoading = computed(() => campaignStore.status === 'loading');

    const systems = computed(() => sysStore.filteredSystems);

    const groupedSystems = computed(() =>
    {
        const statusOrder = [ 'stable', 'beta', 'dev', 'disabled' ];
        return statusOrder
            .map((status) => systems.value.filter((sys) => sys.status === status))
            .filter((group) => group.length > 0);
    });

    const characters = computed(() =>
    {
        if(account.value)
        {
            return charStore.characters
                .filter((char) => char.accountID == account.value?.id)
                .filter((char) =>
                {
                    return systemsFilter.value.includes(char.system);
                })
                .filter((char) =>
                {
                    return !charFilter.value || char.name.toLowerCase()
                        .includes(charFilter.value.toLocaleLowerCase());
                });
        }

        return [];
    });

    const recentCharacters = computed(() =>
    {
        if(account.value)
        {
            return charStore.recentCharacters
                .filter((char) => char.accountID == account.value?.id)
                .slice(0, 5);
        }

        return [];
    });

    const campaignItems = computed(() => campaignStore.campaigns.map((camp) => ({
        ...camp,
        to: `/campaigns/${ camp.id }`,
    })));

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function getSystem<T extends Record<string, unknown>>(systemID : string) : SystemDefinition<T> | undefined
    {
        return sysStore.find(systemID);
    }

    function getStatusDisplay(desc : string) : string
    {
        return systemsMan.getStatusDisplay(desc);
    }

    function getStatusDescription(desc : string) : string
    {
        return systemsMan.getStatusDescription(desc);
    }

    function getStatusIcon(desc : string) : string | undefined
    {
        return systemsMan.getStatusIcon(desc);
    }

    function getStatusVariant(desc : string) : keyof BaseColorVariant | null
    {
        return systemsMan.getStatusVariant(desc);
    }

    function selectAllSystems() : void
    {
        systemsFilter.value = systems.value.map((sys) => sys.id);
    }

    function selectNoneSystems() : void
    {
        systemsFilter.value = [];
    }

    function getCampaignRole(campaign : Campaign) : CampaignRole
    {
        const role = campaign.participants.find((part) => part.accountID === account.value?.id);
        if(role)
        {
            return role.role;
        }

        console.warn('No role found for account', account.value?.id, 'in campaign', campaign.id);

        return 'player';
    }

    function capitalize(value : string) : string
    {
        return value.charAt(0).toUpperCase() + value.slice(1);
    }

    // Add/Edit Modal
    async function openAddEditModal(char ?: Character) : Promise<void>
    {
        // If we don't have a character, we build once from scratch.
        if(!char)
        {
            char = await characterMan.create({});
        }

        addEditModal.value?.show(char);
    }

    async function onSave(charUpdate : Partial<Character>) : Promise<void>
    {
        let char : Character;
        if(!charUpdate.id)
        {
            // Take the partial, and apply system details defaults to it.
            char = await characterMan.create(charUpdate);
        }
        else
        {
            // Update the existing character with this partial
            const existing = charStore.find(charUpdate.id);
            if(!existing)
            {
                // Character not found, create as new
                char = await characterMan.create(charUpdate);
            }
            else
            {
                char = {
                    ...existing,
                    ...charUpdate,
                };
            }
        }

        await characterMan.save(char);
    }

    // Delete Modal
    function openDelCharacter(char : Character) : void
    {
        delModal.value?.show(char);
    }

    async function onDelete(char : Character<any>) : Promise<void>
    {
        if(char.id)
        {
            return characterMan.delete({ id: char.id });
        }
    }

    //------------------------------------------------------------------------------------------------------------------
    // Lifecycle Hooks
    //------------------------------------------------------------------------------------------------------------------

    onMounted(() =>
    {
        if(!account.value)
        {
            // We've finished loading, and we're not signed in
            router.push('/');
        }

        // We've loaded the dashboard, no need to redirect here anymore.
        redirectToDashboard.value = false;

        // Initialize campaign manager (if enabled)
        if(features.campaigns)
        {
            campaignMan.init();
        }

        // Select all systems by default
        selectAllSystems();
    });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
