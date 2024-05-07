<!----------------------------------------------------------------------------------------------------------------------
  -- Main Application Dashboard
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <b-container id="dashboard" class="pb-0">
        <b-form-row>
            <!--<b-col cols="12" lg="6" class="mb-3">-->
            <!--<BCard header-bg-variant="dark" header-text-variant="white" class="shadow-sm h-100">-->
            <!--<template #header>-->
            <!--<div class="d-flex">-->
            <!--<h5 class="align-items-center d-flex text-nowrap m-0 flex-grow-0 flex-shrink-0 w-auto">-->
            <!--<fa class="mr-1" icon="books"></fa>-->
            <!--<span class="d-none d-md-inline">Campaigns</span>-->
            <!--</h5>-->
            <!--<BInputGroup class="flex-fill ml-2">-->
            <!--<BFormInput placeholder="Search Campaigns..." disabled></BFormInput>-->
            <!--<BInputGroupAppend>-->
            <!--<BButton variant="primary" disabled>-->
            <!--<fa icon="search"></fa>-->
            <!--</BButton>-->
            <!--</BInputGroupAppend>-->
            <!--</BInputGroup>-->
            <!--<b-dropdown id="filterSystems" class="ml-2 flex-grow-0 flex-shrink-0 w-auto" right disabled>-->
            <!--<template #button-content>-->
            <!--<fa icon="cog"></fa>-->
            <!--</template>-->

            <!--<b-dropdown-item>Filter 1</b-dropdown-item>-->
            <!--</b-dropdown>-->
            <!--</div>-->
            <!--</template>-->

            <!--<h4 class="text-center text-muted mb-0">Campaigns are not implemented.</h4>-->
            <!--</BCard>-->
            <!--</b-col>-->
            <b-col cols="12" class="mb-3">
                <!-- Characters Card -->
                <BCard header-bg-variant="dark" header-text-variant="white" class="shadow-sm h-100" no-body>
                    <template #header>
                        <div class="d-flex">
                            <h5 class="align-items-center d-flex text-nowrap m-0 mr-2 flex-grow-0 flex-shrink-0 w-auto">
                                <fa class="mr-1" icon="users"></fa>
                                <span class="d-none d-md-inline">Characters</span>
                            </h5>
                            <BInputGroup class="flex-fill ml-auto" style="max-width: 400px">
                                <BFormInput v-model="charFilter" placeholder="Search Characters..."></BFormInput>
                                <BInputGroupAppend>
                                    <BButton variant="primary">
                                        <fa icon="search"></fa>
                                    </BButton>
                                </BInputGroupAppend>
                            </BInputGroup>
                            <b-dropdown id="filterSystems" class="ml-2 flex-grow-0 flex-shrink-0 w-auto" right>
                                <template #button-content>
                                    <fa icon="cog"></fa>
                                </template>

                                <b-dropdown-form>
                                    <b-form-checkbox-group
                                        v-model="systemsFilter"
                                        stacked
                                    >
                                        <b-form-checkbox
                                            v-for="system in systems"
                                            :key="system.id"
                                            :value="system.id"
                                            class="text-nowrap system-filter-checkbox"
                                            @click.stop
                                        >
                                            <div class="mr-1">
                                                {{ system.name }}
                                            </div>
                                            <div class="ml-auto text-right">
                                                <b-badge
                                                    v-if="system.status"
                                                    :variant="getStatusVariant(system.status)"
                                                    :title="getStatusDescription(system.status)"
                                                >
                                                    <fa :icon="getStatusIcon(system.status)"></fa>
                                                    {{ getStatusDisplay(system.status) }}
                                                </b-badge>
                                            </div>
                                        </b-form-checkbox>
                                    </b-form-checkbox-group>
                                </b-dropdown-form>
                                <b-dropdown-divider></b-dropdown-divider>
                                <b-dropdown-item style="pointer-events: none">
                                    <div style="pointer-events: all" @click.stop="selectAllSystems()">
                                        <fa icon="check-square"></fa>
                                        Select All
                                    </div>
                                </b-dropdown-item>
                                <b-dropdown-item style="pointer-events: none">
                                    <div style="pointer-events: all" @click.stop="selectNoneSystems()">
                                        <fa :icon="['far', 'square']"></fa>
                                        Select None
                                    </div>
                                </b-dropdown-item>
                            </b-dropdown>
                        </div>
                    </template>

                    <!-- List of Characters -->
                    <div v-if="charsLoading" class="card-body">
                        <LoadingWidget></LoadingWidget>
                    </div>

                    <b-list-group v-else-if="characters.length > 0" flush>
                        <b-list-group-item v-for="char in characters" :key="char.id" :to="`/characters/${ char.id }`">
                            <div class="d-flex">
                                <CharThumbnail :char="char"></CharThumbnail>
                                <div class="ml-2 flex-column d-flex justify-content-center flex-fill">
                                    <h5 class="mb-1">
                                        {{ char.name }}
                                    </h5>
                                    <p class="text-muted m-0">
                                        <b-badge class="mr-1">
                                            {{ getSystem(char.system).name }}
                                        </b-badge>
                                        <small>{{ char.campaign }}</small>
                                    </p>
                                </div>
                                <div class="mr-2 flex-column d-flex justify-content-center flex-nowrap" style="flex: 0 0 auto">
                                    <BCloseButton title="Edit User" @click.prevent.stop="openAddEditModal(char)">
                                        <fa icon="user-edit"></fa>
                                    </BCloseButton>
                                </div>
                                <div class="ml-2 flex-column d-flex justify-content-center flex-nowrap" style="flex: 0 0 auto">
                                    <BCloseButton title="Delete Character" @click.prevent.stop="openDelCharacter(char)">
                                        <fa icon="trash-alt"></fa>
                                    </BCloseButton>
                                </div>
                            </div>
                        </b-list-group-item>
                    </b-list-group>

                    <div v-else class="card-body">
                        <h6 class="text-center text-muted">
                            No Characters found.
                        </h6>
                    </div>

                    <div class="card-body text-right">
                        <BButton variant="primary" @click="openAddEditModal()">
                            <fa icon="user-plus"></fa>
                            New Character
                        </BButton>
                    </div>
                </BCard>
            </b-col>
        </b-form-row>

        <!-- Modals -->
        <AddEditModal ref="addEditModal" @save="onSave"></AddEditModal>
        <DeleteModal ref="delModal" @delete="onDelete"></DeleteModal>
    </b-container>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss">
    #dashboard {
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
    import { computed, onMounted, ref } from 'vue';
    import { storeToRefs } from 'pinia';
    import { useRouter } from 'vue-router';

    // Interfaces
    import { Character, System } from '../../common/interfaces/common';

    // Stores
    import { useAccountStore } from '../lib/stores/account';
    import { useSystemsStore } from '../lib/stores/systems';
    import { useCharactersStore } from '../lib/stores/characters';

    // Managers
    import systemsMan from '../lib/managers/systems';
    import characterMan from '../lib/managers/character';

    // Components
    import LoadingWidget from '../components/ui/loadingWidget.vue';
    import AddEditModal from '../components/character/addEditModal.vue';
    import DeleteModal from '../components/character/deleteModal.vue';
    import CharThumbnail from '../components/character/charThumbnail.vue';

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const { account } = storeToRefs(useAccountStore());
    const router = useRouter();
    const sysStore = useSystemsStore();
    const charStore = useCharactersStore();

    const charFilter = ref('');
    const systemsFilter = ref<string[]>([]);

    const addEditModal = ref<InstanceType<typeof AddEditModal> | null>(null);
    const delModal = ref<InstanceType<typeof DeleteModal> | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const charsLoading = computed(() =>
    {
        return !account.value || sysStore.status !== 'loaded' || charStore.status !== 'loaded';
    });

    const systems = computed(() => sysStore.systems);

    const characters = computed(() =>
    {
        if(account.value)
        {
            return charStore.characters
                .filter((char) => char.accountID == account.value.id)
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

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function getSystem<T>(systemID : string) : System<T> | undefined
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

    function getStatusIcon(desc : string) : string
    {
        switch (desc)
        {
            case 'dev':
                return 'exclamation-triangle';

            case 'beta':
                return 'info-circle';

            case 'disabled':
                return 'exclamation-triangle';

            default:
                return undefined;
        }
    }

    function getStatusVariant(desc : string) : string
    {
        switch (desc)
        {
            case 'dev':
                return 'warning';

            case 'beta':
                return 'info';

            case 'disabled':
                return 'danger';

            default:
                return undefined;
        }
    }

    function selectAllSystems() : void
    {
        systemsFilter.value = [].concat(systems.value.map((sys) => sys.id));
    }

    function selectNoneSystems() : void
    {
        systemsFilter.value = [];
    }

    // Add/Edit Modal
    async function openAddEditModal(char) : Promise<void>
    {
        // If we don't have a character, we build once from scratch.
        if(!char)
        {
            char = await characterMan.create({});
        }

        addEditModal.value.show(char);
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
            char = {
                ...charStore.find(charUpdate.id),
                ...charUpdate
            };
        }

        await characterMan.save(char);
    }

    // Delete Modal
    function openDelCharacter(char) : void
    {
        delModal.value.show(char);
    }

    async function onDelete(char : Character<any>) : Promise<void>
    {
        return characterMan.delete(char);
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

        selectAllSystems();
    });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
