<!----------------------------------------------------------------------------------------------------------------------
  -- EditMotivationsModal
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="edit-motivations-modal">
        <BModal
            ref="innerModal"
            header-bg-variant="dark"
            header-text-variant="white"
            no-close-on-esc
            no-close-on-backdrop
            size="xl"
            @ok="onSave"
        >
            <!-- Modal Header -->
            <template #header="{ cancel }">
                <h5 v-b-color-mode="'dark'" class="w-100 mb-0">
                    <Fa icon="file-edit" />
                    Edit Motivations
                    <CloseButton class="float-end" @click="cancel" />
                </h5>
            </template>

            <!-- Modal Content -->
            <div class="d-flex">
                <BCard
                    class="flex-fill w-50 me-1"
                    :border-variant="isStrengthDirty ? 'success' : undefined"
                >
                    <template #header>
                        <div class="d-flex">
                            <h6 class="mt-2 me-3">
                                Strength
                            </h6>
                            <SupplementSearch
                                class="w-100"
                                :available="availableStrength"
                                :selected="motivations.strength ? [{ id: motivations.strength }] : []"
                                @add="onMotivAdd"
                            >
                                <template #append-extra>
                                    <BButton
                                        class="ms-2 text-nowrap"
                                        variant="success"
                                        title="Add New..."
                                        @click="addNew('strength')"
                                    >
                                        <Fa icon="plus" />
                                        New
                                    </BButton>
                                </template>
                            </SupplementSearch>
                        </div>
                    </template>

                    <div v-if="strength">
                        <div v-if="isEditable(strength)" class="float-end">
                            <BButton class="ms-1 mt-1" size="sm" @click="editMotivation(strength)">
                                <Fa icon="edit" />
                                Edit
                            </BButton>
                            <BButton class="ms-1 mt-1" variant="danger" size="sm" @click="delMotivation(strength)">
                                <Fa icon="trash" />
                                Delete
                            </BButton>
                        </div>
                        <div v-if="isStrengthDirty" class="float-end">
                            <BButton class="ms-1 mt-1" size="sm" @click="revert('strength')">
                                <Fa icon="undo" />
                                Undo
                            </BButton>
                        </div>
                        <div class="pt-2">
                            <h5><b>{{ strength.name }}</b></h5>
                            <MarkdownBlock :text="strength.description" block />
                        </div>
                    </div>
                    <h6 v-else class="font-italic">
                        No Strength selected.
                    </h6>
                </BCard>
                <BCard
                    class="flex-fill w-50 ms-1"
                    :border-variant="isFlawDirty ? 'success' : undefined"
                >
                    <template #header>
                        <div class="d-flex">
                            <h6 class="mt-2 me-3">
                                Flaw
                            </h6>
                            <SupplementSearch
                                class="w-100"
                                :available="availableFlaw"
                                :selected="motivations.flaw ? [{ id: motivations.flaw }] : []"
                                @add="onMotivAdd"
                            >
                                <template #append-extra>
                                    <BButton
                                        class="ms-2 text-nowrap"
                                        variant="success"
                                        title="Add New..."
                                        @click="addNew('flaw')"
                                    >
                                        <Fa icon="plus" />
                                        New
                                    </BButton>
                                </template>
                            </SupplementSearch>
                        </div>
                    </template>

                    <div v-if="flaw">
                        <div v-if="isEditable(flaw)" class="float-end">
                            <BButton class="ms-1 mt-1" size="sm" @click="editMotivation(flaw)">
                                <Fa icon="edit" />
                                Edit
                            </BButton>
                            <BButton class="ms-1 mt-1" variant="danger" size="sm" @click="delMotivation(flaw)">
                                <Fa icon="trash" />
                                Delete
                            </BButton>
                        </div>
                        <div v-if="isFlawDirty" class="float-end">
                            <BButton class="ms-1 mt-1" size="sm" @click="revert('flaw')">
                                <Fa icon="undo" />
                                Undo
                            </BButton>
                        </div>
                        <div class="pt-2">
                            <h5><b>{{ flaw.name }}</b></h5>
                            <MarkdownBlock :text="flaw.description" block />
                        </div>
                    </div>
                    <h6 v-else class="font-italic">
                        No Flaw selected.
                    </h6>
                </BCard>
            </div>
            <div class="d-flex mt-2">
                <BCard
                    class="flex-fill w-50 me-1"
                    :border-variant="isDesireDirty ? 'success' : undefined"
                >
                    <template #header>
                        <div class="d-flex">
                            <h6 class="mt-2 me-3">
                                Desire
                            </h6>
                            <SupplementSearch
                                class="w-100"
                                :available="availableDesire"
                                :selected="motivations.desire ? [{ id: motivations.desire }] : []"
                                @add="onMotivAdd"
                            >
                                <template #append-extra>
                                    <BButton
                                        class="ms-2 text-nowrap"
                                        variant="success"
                                        title="Add New..."
                                        @click="addNew('desire')"
                                    >
                                        <Fa icon="plus" />
                                        New
                                    </BButton>
                                </template>
                            </SupplementSearch>
                        </div>
                    </template>

                    <div v-if="desire">
                        <div v-if="isEditable(desire)" class="float-end">
                            <BButton class="ms-1 mt-1" size="sm" @click="editMotivation(desire)">
                                <Fa icon="edit" />
                                Edit
                            </BButton>
                            <BButton class="ms-1 mt-1" variant="danger" size="sm" @click="delMotivation(desire)">
                                <Fa icon="trash" />
                                Delete
                            </BButton>
                        </div>
                        <div v-if="isDesireDirty" class="float-end">
                            <BButton class="ms-1 mt-1" size="sm" @click="revert('desire')">
                                <Fa icon="undo" />
                                Undo
                            </BButton>
                        </div>
                        <div class="pt-2">
                            <h5><b>{{ desire.name }}</b></h5>
                            <MarkdownBlock :text="desire.description" block />
                        </div>
                    </div>
                    <h6 v-else class="font-italic">
                        No Desire selected.
                    </h6>
                </BCard>
                <BCard
                    class="flex-fill w-50 ms-1"
                    :border-variant="isFearDirty ? 'success' : undefined"
                >
                    <template #header>
                        <div class="d-flex">
                            <h6 class="mt-2 me-3">
                                Fear
                            </h6>
                            <SupplementSearch
                                class="w-100"
                                :available="availableFear"
                                :selected="motivations.fear ? [{ id: motivations.fear }] : []"
                                @add="onMotivAdd"
                            >
                                <template #append-extra>
                                    <BButton
                                        class="ms-2 text-nowrap"
                                        variant="success"
                                        title="Add New..."
                                        @click="addNew('fear')"
                                    >
                                        <Fa icon="plus" />
                                        New
                                    </BButton>
                                </template>
                            </SupplementSearch>
                        </div>
                    </template>

                    <div v-if="fear">
                        <div v-if="isEditable(fear)" class="float-end">
                            <BButton class="ms-1 mt-1" size="sm" @click="editMotivation(fear)">
                                <Fa icon="edit" />
                                Edit
                            </BButton>
                            <BButton class="ms-1 mt-1" variant="danger" size="sm" @click="delMotivation(fear)">
                                <Fa icon="trash" />
                                Delete
                            </BButton>
                        </div>
                        <div v-if="isFearDirty" class="float-end">
                            <BButton class="ms-1 mt-1" size="sm" @click="revert('fear')">
                                <Fa icon="undo" />
                                Undo
                            </BButton>
                        </div>
                        <div class="pt-2">
                            <h5><b>{{ fear.name }}</b></h5>
                            <MarkdownBlock :text="fear.description" block />
                        </div>
                    </div>
                    <h6 v-else class="font-italic">
                        No Fear selected.
                    </h6>
                </BCard>
            </div>

            <!-- Modal Buttons -->
            <template #ok="{ ok }">
                <BButton variant="primary" @click="ok">
                    <Fa icon="save" />
                    Save
                </BButton>
            </template>
            <template #cancel="{ cancel }">
                <BButton variant="secondary" @click="cancel">
                    <Fa icon="times" />
                    Cancel
                </BButton>
            </template>
        </BModal>

        <!-- Modals -->
        <AddEditMotivationModal ref="addEditMotivModal" @add="onMotivAdd" />
        <DeleteModal
            ref="delMotivModal"
            :name="delMotiv.name"
            type="motivation"
            @hidden="onDelMotivHidden"
            @delete="onDelMotivDelete"
        />
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, ref } from 'vue';

    // Models
    import type {
        GenesysCharacter,
        GenesysMotivation,
        GenesysMotivationType,
    } from '@rpgk/core/models/systems';

    // Managers
    import authMan from '@client/lib/managers/auth';
    import eoteMan from '@client/lib/managers/systems/eote';

    // Components
    import SupplementSearch from '@client/components/character/supplementSearch.vue';
    import MarkdownBlock from '@client/components/ui/markdownBlock.vue';
    import DeleteModal from '@client/components/ui/deleteModal.vue';
    import AddEditMotivationModal from './addEditMotivationModal.vue';
    import { BModal } from 'bootstrap-vue-next';
    import CloseButton from '@client/components/ui/closeButton.vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Motivations
    {
        strength : number | null;
        flaw : number | null;
        desire : number | null;
        fear : number | null;
    }

    type Events = (e : 'save', motivations : Motivations) => void;

    const emit = defineEmits<Events>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const originalMotivations = ref<Motivations>({
        strength: null,
        flaw: null,
        desire: null,
        fear: null,
    });

    const motivations = ref<Motivations>({
        strength: null,
        flaw: null,
        desire: null,
        fear: null,
    });

    const delMotiv = ref<{ id ?: number, name : string, type : string }>({
        id: undefined,
        name: '',
        type: '',
    });

    const innerModal = ref<InstanceType<typeof BModal> | null>(null);
    const addEditMotivModal = ref<InstanceType<typeof AddEditMotivationModal> | null>(null);
    const delMotivModal = ref<InstanceType<typeof DeleteModal> | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const motivationsList = computed(() => eoteMan.motivations);
    const strength = computed(() => motivationsList.value.find((mot) => mot.id === motivations.value.strength));
    const flaw = computed(() => motivationsList.value.find((mot) => mot.id === motivations.value.flaw));
    const desire = computed(() => motivationsList.value.find((mot) => mot.id === motivations.value.desire));
    const fear = computed(() => motivationsList.value.find((mot) => mot.id === motivations.value.fear));

    const availableStrength = computed(() => motivationsList.value.filter((mot) => mot.type === 'strength'));
    const availableFlaw = computed(() => motivationsList.value.filter((mot) => mot.type === 'flaw'));
    const availableDesire = computed(() => motivationsList.value.filter((mot) => mot.type === 'desire'));
    const availableFear = computed(() => motivationsList.value.filter((mot) => mot.type === 'fear'));

    const isStrengthDirty = computed(() => motivations.value.strength !== originalMotivations.value.strength);
    const isFlawDirty = computed(() => motivations.value.flaw !== originalMotivations.value.flaw);
    const isDesireDirty = computed(() => motivations.value.desire !== originalMotivations.value.desire);
    const isFearDirty = computed(() => motivations.value.fear !== originalMotivations.value.fear);

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function show(char : GenesysCharacter) : void
    {
        originalMotivations.value = { ...char.details.motivations };
        motivations.value = { ...char.details.motivations };

        innerModal.value.show();
    }

    function hide() : void
    {
        innerModal.value.hide();
    }

    function onSave() : void
    {
        emit('save', motivations.value);
    }

    function onCancel() : void
    {
        originalMotivations.value = {
            strength: null,
            flaw: null,
            desire: null,
            fear: null,
        };

        motivations.value = {
            strength: null,
            flaw: null,
            desire: null,
            fear: null,
        };
    }

    function onMotivAdd(supp : { id ?: number | string; type ?: GenesysMotivationType }) : void
    {
        if(!supp.id) { return; }
        const motivId = typeof supp.id === 'string' ? parseInt(supp.id, 10) : supp.id;

        // Look up the full motivation to get its type if not provided
        let motiv : GenesysMotivation | undefined;
        if(!supp.type)
        {
            motiv = motivationsList.value.find((mot) => mot.id === motivId);
        }
        else
        {
            motiv = { id: motivId, type: supp.type } as GenesysMotivation;
        }

        if(motiv?.type)
        {
            motivations.value[motiv.type] = motivId;
        }
    }

    function onDelMotivHidden() : void
    {
        delMotiv.value = {
            id: undefined,
            name: '',
            type: '',
        };
    }

    async function onDelMotivDelete() : Promise<void>
    {
        motivations.value[delMotiv.value.type] = null;
        emit('save', motivations.value);

        if(delMotiv.value.id)
        {
            const delObj = { id: `${ delMotiv.value.id }` };
            await eoteMan.delSup('motivations', delObj);
        }
    }

    function isEditable(motiv : GenesysMotivation) : boolean
    {
        const hasRight = authMan.hasPerm(`${ eoteMan.mode }/canModifyContent`);
        const isOwner = motiv.scope === 'user'
            && motiv.owner === authMan.account.id;

        return isOwner || hasRight;
    }

    function addNew(type : GenesysMotivationType) : void
    {
        addEditMotivModal.value.show({ type });
    }

    function editMotivation(motiv : GenesysMotivation) : void
    {
        addEditMotivModal.value.show(motiv);
    }

    function delMotivation(motiv : GenesysMotivation) : void
    {
        delMotiv.value.id = motiv.id;
        delMotiv.value.name = motiv.name;
        delMotiv.value.type = motiv.type;

        delMotivModal.value.show();
    }

    function revert(type : GenesysMotivationType) : void
    {
        motivations.value[type] = originalMotivations.value[type];
    }

    //------------------------------------------------------------------------------------------------------------------

    defineExpose({ show, hide });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
