<!----------------------------------------------------------------------------------------------------------------------
  -- EditMotivationsModal
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="edit-motivations-modal">
        <b-modal
            ref="innerModal"
            header-bg-variant="dark"
            header-text-variant="white"
            no-close-on-esc
            no-close-on-backdrop
            size="xl"
            @ok="onSave"
        >
            <!-- Modal Header -->
            <template #modal-title>
                <fa icon="file-edit"></fa>
                Edit Motivations
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
                            <supplement-search
                                class="w-100"
                                :available="availableStrength"
                                :selected="[ strength ]"
                                @add="onMotivAdd"
                            >
                                <template #append-extra>
                                    <BButton
                                        class="ms-2 text-nowrap"
                                        variant="success"
                                        title="Add New..."
                                        @click="addNew('strength')"
                                    >
                                        <fa icon="plus"></fa>
                                        New
                                    </BButton>
                                </template>
                            </supplement-search>
                        </div>
                    </template>

                    <div v-if="strength">
                        <div v-if="isEditable(strength)" class="float-end">
                            <BButton class="ms-1 mt-1" size="sm" @click="editMotivation(strength)">
                                <fa icon="edit"></fa>
                                Edit
                            </BButton>
                            <BButton class="ms-1 mt-1" variant="danger" size="sm" @click="delMotivation(strength)">
                                <fa icon="trash"></fa>
                                Delete
                            </BButton>
                        </div>
                        <div v-if="isStrengthDirty" class="float-end">
                            <BButton class="ms-1 mt-1" size="sm" @click="revert('strength')">
                                <fa icon="undo"></fa>
                                Undo
                            </BButton>
                        </div>
                        <div class="pt-2">
                            <h5><b>{{ strength.name }}</b></h5>
                            <MarkdownBlock :text="strength.description" block></MarkdownBlock>
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
                            <supplement-search
                                class="w-100"
                                :available="availableFlaw"
                                :selected="[ flaw ]"
                                @add="onMotivAdd"
                            >
                                <template #append-extra>
                                    <BButton
                                        class="ms-2 text-nowrap"
                                        variant="success"
                                        title="Add New..."
                                        @click="addNew('flaw')"
                                    >
                                        <fa icon="plus"></fa>
                                        New
                                    </BButton>
                                </template>
                            </supplement-search>
                        </div>
                    </template>

                    <div v-if="flaw">
                        <div v-if="isEditable(flaw)" class="float-end">
                            <BButton class="ms-1 mt-1" size="sm" @click="editMotivation(flaw)">
                                <fa icon="edit"></fa>
                                Edit
                            </BButton>
                            <BButton class="ms-1 mt-1" variant="danger" size="sm" @click="delMotivation(flaw)">
                                <fa icon="trash"></fa>
                                Delete
                            </BButton>
                        </div>
                        <div v-if="isFlawDirty" class="float-end">
                            <BButton class="ms-1 mt-1" size="sm" @click="revert('flaw')">
                                <fa icon="undo"></fa>
                                Undo
                            </BButton>
                        </div>
                        <div class="pt-2">
                            <h5><b>{{ flaw.name }}</b></h5>
                            <MarkdownBlock :text="flaw.description" block></MarkdownBlock>
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
                            <supplement-search
                                class="w-100"
                                :available="availableDesire"
                                :selected="[ desire ]"
                                @add="onMotivAdd"
                            >
                                <template #append-extra>
                                    <BButton
                                        class="ms-2 text-nowrap"
                                        variant="success"
                                        title="Add New..."
                                        @click="addNew('desire')"
                                    >
                                        <fa icon="plus"></fa>
                                        New
                                    </BButton>
                                </template>
                            </supplement-search>
                        </div>
                    </template>

                    <div v-if="desire">
                        <div v-if="isEditable(desire)" class="float-end">
                            <BButton class="ms-1 mt-1" size="sm" @click="editMotivation(desire)">
                                <fa icon="edit"></fa>
                                Edit
                            </BButton>
                            <BButton class="ms-1 mt-1" variant="danger" size="sm" @click="delMotivation(desire)">
                                <fa icon="trash"></fa>
                                Delete
                            </BButton>
                        </div>
                        <div v-if="isDesireDirty" class="float-end">
                            <BButton class="ms-1 mt-1" size="sm" @click="revert('desire')">
                                <fa icon="undo"></fa>
                                Undo
                            </BButton>
                        </div>
                        <div class="pt-2">
                            <h5><b>{{ desire.name }}</b></h5>
                            <MarkdownBlock :text="desire.description" block></MarkdownBlock>
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
                            <supplement-search
                                class="w-100"
                                :available="availableFear"
                                :selected="[ fear ]"
                                @add="onMotivAdd"
                            >
                                <template #append-extra>
                                    <BButton
                                        class="ms-2 text-nowrap"
                                        variant="success"
                                        title="Add New..."
                                        @click="addNew('fear')"
                                    >
                                        <fa icon="plus"></fa>
                                        New
                                    </BButton>
                                </template>
                            </supplement-search>
                        </div>
                    </template>

                    <div v-if="fear">
                        <div v-if="isEditable(fear)" class="float-end">
                            <BButton class="ms-1 mt-1" size="sm" @click="editMotivation(fear)">
                                <fa icon="edit"></fa>
                                Edit
                            </BButton>
                            <BButton class="ms-1 mt-1" variant="danger" size="sm" @click="delMotivation(fear)">
                                <fa icon="trash"></fa>
                                Delete
                            </BButton>
                        </div>
                        <div v-if="isFearDirty" class="float-end">
                            <BButton class="ms-1 mt-1" size="sm" @click="revert('fear')">
                                <fa icon="undo"></fa>
                                Undo
                            </BButton>
                        </div>
                        <div class="pt-2">
                            <h5><b>{{ fear.name }}</b></h5>
                            <MarkdownBlock :text="fear.description" block></MarkdownBlock>
                        </div>
                    </div>
                    <h6 v-else class="font-italic">
                        No Fear selected.
                    </h6>
                </BCard>
            </div>

            <!-- Modal Buttons -->
            <template #modal-ok>
                <fa icon="save"></fa>
                Save
            </template>
            <template #modal-cancel>
                <fa icon="times"></fa>
                Cancel
            </template>
        </b-modal>

        <!-- Modals -->
        <AddEditMotivationModal ref="addEditMotivModal" @add="onMotivAdd"></AddEditMotivationModal>
        <DeleteModal
            ref="delMotivModal"
            :name="delMotiv.name"
            type="motivation"
            @hidden="onDelMotivHidden"
            @delete="onDelMotivDelete"
        ></DeleteModal>
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, ref } from 'vue';

    // Models
    import {
        GenesysCharacter,
        GenesysMotivation,
        GenesysMotivationType
    } from '../../../../../common/interfaces/systems/eote';

    // Managers
    import authMan from '../../../../lib/managers/auth';
    import eoteMan from '../../../../lib/managers/systems/eote';

    // Components
    import SupplementSearch from '../../../character/supplementSearch.vue';
    import MarkdownBlock from '../../../ui/markdownBlock.vue';
    import DeleteModal from '../../../ui/deleteModal.vue';
    import AddEditMotivationModal from './addEditMotivationModal.vue';
    import { BModal } from 'bootstrap-vue-next';

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

    interface Events
    {
        (e : 'save', motivations : Motivations) : void;
    }

    const emit = defineEmits<Events>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const originalMotivations = ref<Motivations>({
        strength: null,
        flaw: null,
        desire: null,
        fear: null
    });

    const motivations = ref<Motivations>({
        strength: null,
        flaw: null,
        desire: null,
        fear: null
    });

    const delMotiv = ref<{ id ?: number, name : string, type : string }>({
        id: undefined,
        name: '',
        type: ''
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
            fear: null
        };

        motivations.value = {
            strength: null,
            flaw: null,
            desire: null,
            fear: null
        };
    }

    function onMotivAdd(motiv : GenesysMotivation) : void
    {
        if(!motiv.type)
        {
            motiv = motivationsList.value.find((mot) => mot.id === motiv.id) ?? motiv;
        }

        motivations.value[motiv.type] = motiv.id;
    }

    function onDelMotivHidden() : void
    {
        delMotiv.value = {
            id: undefined,
            name: '',
            type: ''
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

    function addNew(type : GenesysMotivationType)
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

    function revert(type : GenesysMotivationType)
    {
        motivations.value[type] = originalMotivations.value[type];
    }

    //------------------------------------------------------------------------------------------------------------------

    defineExpose({ show, hide });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
