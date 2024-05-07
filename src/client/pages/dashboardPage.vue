<!----------------------------------------------------------------------------------------------------------------------
  -- Main Application Dashboard
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <BContainer id="dashboard" class="pb-0">
        <BFormRow>
            <BCol cols="12" class="mb-3">
                <!-- Characters Card -->
                <BCard header-bg-variant="dark" header-text-variant="white" class="shadow-sm h-100" no-body>
                    <template #header>
                        <div class="d-flex">
                            <h5 class="align-items-center d-flex text-nowrap m-0 me-2 flex-grow-0 flex-shrink-0 w-auto">
                                <fa class="me-1" icon="users"></fa>
                                <span class="d-none d-md-inline">Characters</span>
                            </h5>
                            <BInputGroup class="flex-fill ms-auto" style="max-width: 400px">
                                <BFormInput v-model="charFilter" placeholder="Search Characters..."></BFormInput>
                                <BInputGroupAppend>
                                    <BButton variant="primary">
                                        <fa icon="search"></fa>
                                    </BButton>
                                </BInputGroupAppend>
                            </BInputGroup>

                            <!-- System Filter Dropdown -->
                            <BDropdown id="filterSystems" class="ms-2 flex-grow-0 flex-shrink-0 w-auto" right>
                                <template #button-content>
                                    <fa icon="cog"></fa>
                                </template>

                                <BDropdownForm class="system-filter-checkbox">
                                    <BFormCheckbox
                                        v-for="system in systems"
                                        :key="system.id"
                                        v-model="systemsFilter"
                                        :value="system.id"
                                        class="block-labels"
                                        @click.stop
                                    >
                                        <div class="text-nowrap d-flex w-100" @click.stop>
                                            <div class="me-1">
                                                {{ system.name }}
                                            </div>
                                            <div class="ms-auto">
                                                <BBadge
                                                    v-if="system.status"
                                                    :variant="getStatusVariant(system.status)"
                                                    :title="getStatusDescription(system.status)"
                                                >
                                                    <fa :icon="getStatusIcon(system.status)"></fa>
                                                    {{ getStatusDisplay(system.status) }}
                                                </BBadge>
                                            </div>
                                        </div>
                                    </BFormCheckbox>
                                </BDropdownForm>
                                <BDropdownDivider></BDropdownDivider>
                                <BDropdownItem style="pointer-events: none">
                                    <div style="pointer-events: all" @click.stop="selectAllSystems()">
                                        <fa icon="check-square"></fa>
                                        Select All
                                    </div>
                                </BDropdownItem>
                                <BDropdownItem style="pointer-events: none">
                                    <div style="pointer-events: all" @click.stop="selectNoneSystems()">
                                        <fa :icon="['far', 'square']"></fa>
                                        Select None
                                    </div>
                                </BDropdownItem>
                            </BDropdown>
                        </div>
                    </template>

                    <!-- List of Characters -->
                    <div v-if="charsLoading" class="card-body">
                        <LoadingWidget></LoadingWidget>
                    </div>

                    <BListGroup v-else-if="characters.length > 0" flush>
                        <BListGroupItem v-for="char in characters" :key="char.id" :to="`/characters/${ char.id }`">
                            <div class="d-flex">
                                <CharThumbnail :char="char"></CharThumbnail>
                                <div class="ms-2 flex-column d-flex justify-content-center flex-fill">
                                    <h5 class="mb-1">
                                        {{ char.name }}
                                    </h5>
                                    <p class="text-muted m-0">
                                        <BBadge class="me-1">
                                            {{ getSystem(char.system).name }}
                                        </BBadge>
                                        <small>{{ char.campaign }}</small>
                                    </p>
                                </div>
                                <div class="me-2 flex-column d-flex justify-content-center flex-nowrap" style="flex: 0 0 auto">
                                    <CloseButton title="Edit User" @click.prevent.stop="openAddEditModal(char)">
                                        <fa icon="user-edit"></fa>
                                    </CloseButton>
                                </div>
                                <div class="ms-2 flex-column d-flex justify-content-center flex-nowrap" style="flex: 0 0 auto">
                                    <CloseButton class="btn-close" title="Delete Character" @click.prevent.stop="openDelCharacter(char)">
                                        <fa icon="trash-alt"></fa>
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
                            <fa icon="user-plus"></fa>
                            New Character
                        </BButton>
                    </div>
                </BCard>
            </BCol>
        </BFormRow>

        <!-- Modals -->
        <AddEditModal ref="addEditModal" @save="onSave"></AddEditModal>
        <DeleteModal ref="delModal" @delete="onDelete"></DeleteModal>
    </BContainer>
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
    import { BaseColorVariant } from 'bootstrap-vue-next';

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
    import CloseButton from '../components/ui/closeButton.vue';

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

    function getSystem<T extends Record<string, unknown>>(systemID : string) : System<T> | undefined
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

    function getStatusVariant(desc : string) : keyof BaseColorVariant
    {
        switch (desc)
        {
            case 'dev':
                return ('warning' as const);

            case 'beta':
                return 'info';

            case 'disabled':
                return 'danger';

            default:
                return null;
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
    async function openAddEditModal(char ?: Character) : Promise<void>
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
