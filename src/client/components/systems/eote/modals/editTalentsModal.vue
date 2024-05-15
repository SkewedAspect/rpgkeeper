<!----------------------------------------------------------------------------------------------------------------------
  -- EditTalentModal
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="edit-talent-modal">
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
                    <fa icon="file-edit"></fa>
                    Edit Talents
                    <CloseButton class="float-end" @click="cancel"></CloseButton>
                </h5>
            </template>

            <!-- Modal Content -->
            <div :class="`${ mode }-system`">
                <supplement-select
                    ref="suppSelect"
                    label="Talents"
                    label-class="fw-bold"
                    :available="sortedTalents"
                    :selected="sortedSelected"
                    :sort-fn="() => 0"
                    @add="onTalentAdd"
                    @remove="onTalentRemove"
                    @new="onTalentNew"
                    @edit="onTalentEdit"
                    @delete="onTalentDelete"
                >
                    <template #preview="{ instance, supplement }">
                        <div class="clearfix">
                            <div v-if="supplement.ranked" class="mb-2 float-end">
                                <label>Ranks</label>
                                <BFormSpinbutton v-model="getInst(instance.id).ranks" inline></BFormSpinbutton>
                            </div>
                            <div class="mb-2">
                                <i>{{ getActivation(supplement) }}</i>
                            </div>
                            <MarkdownBlock :text="supplement.description" inline></MarkdownBlock>
                            <reference
                                class="float-end mt-2"
                                :reference="supplement.reference"
                            ></reference>
                        </div>
                        <div class="font-sm">
                            <hr />
                            <div class="float-end">
                                <BButton v-if="!editInstance" size="sm" @click="editInstanceNotes(instance)">
                                    <fa icon="edit"></fa>
                                    Edit Notes
                                </BButton>
                            </div>
                            <BCard v-if="editInstance" class="overflow-hidden" no-body>
                                <MarkdownBlock v-model:text="editInstance.notes" inline></MarkdownBlock>
                                <template #footer>
                                    <div class="text-end">
                                        <BButton v-if="editInstance" class="me-2" size="sm" @click="saveInstanceNotes(instance, true)">
                                            <fa icon="times"></fa>
                                            Cancel Notes
                                        </BButton>
                                        <BButton v-if="editInstance" variant="success" size="sm" @click="saveInstanceNotes(instance)">
                                            <fa icon="save"></fa>
                                            Save Notes
                                        </BButton>
                                    </div>
                                </template>
                            </BCard>
                            <MarkdownBlock v-else-if="instance.notes" :text="instance.notes" inline></MarkdownBlock>
                            <i v-else>No notes.</i>
                        </div>
                    </template>
                    <template #preview-title="{ instance, supplement }">
                        <div v-if="mode === 'genesys'" class="float-end me-2">
                            <span class="text-muted">Tier {{ supplement.tier }}</span>
                        </div>
                        {{ supplement.name }}
                        <span v-if="supplement.ranked">{{ instance.ranks }}</span>
                    </template>
                    <template #selection-extra="{ supplement }">
                        <BBadge v-if="mode === 'genesys'" class="me-1">
                            Tier {{ supplement.tier }}
                        </BBadge>
                    </template>
                    <template #suggestion-extra="{ supplement }">
                        <BBadge v-if="mode === 'genesys'" class="me-1">
                            Tier {{ supplement.tier }}
                        </BBadge>
                    </template>
                </supplement-select>
            </div>

            <!-- Modal Buttons -->
            <template #ok="{ ok }">
                <BButton variant="primary" @click="ok">
                    <fa icon="save"></fa>
                    Save
                </BButton>
            </template>
            <template #cancel="{ cancel }">
                <BButton variant="secondary" @click="cancel">
                    <fa icon="times"></fa>
                    Cancel
                </BButton>
            </template>
        </BModal>

        <!-- Modals -->
        <AddEditTalentModal ref="addEditTalentModal" @add="onTalentAdd"></AddEditTalentModal>
        <DeleteModal
            ref="delTalentModal"
            :name="delTalent.name"
            type="talent"
            @hidden="onDelTalentHidden"
            @delete="onDelTalentDelete"
        ></DeleteModal>
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, ref } from 'vue';
    import { sortBy } from 'lodash';

    // Models
    import {
        EoteOrGenCharacter,
        EoteTalentInst,
        GenesysTalent
    } from '../../../../../common/interfaces/systems/eote';

    // Managers
    import eoteMan from '../../../../lib/managers/systems/eote';

    // Components
    import SupplementSelect from '../../../character/supplementSelect.vue';
    import DeleteModal from '../../../ui/deleteModal.vue';
    import MarkdownBlock from '../../../ui/markdownBlock.vue';
    import Reference from '../../../character/referenceBlock.vue';
    import AddEditTalentModal from './addEditTalentModal.vue';
    import { BModal } from 'bootstrap-vue-next';

    // Utils
    import { uniqBy } from '../../../../../common/utils/misc';
    import CloseButton from '../../../ui/closeButton.vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Events
    {
        (e : 'save', talents : EoteTalentInst[]) : void;
    }

    const emit = defineEmits<Events>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const selectedTalents = ref<EoteTalentInst[]>([]);
    const delTalent = ref<{ id : number | string, name : string }>({
        id: '',
        name: ''
    });
    const editInstance = ref<EoteTalentInst>(undefined);

    const suppSelect = ref<InstanceType<typeof SupplementSelect> | null>(null);
    const innerModal = ref<InstanceType<typeof BModal> | null>(null);
    const addEditTalentModal = ref<InstanceType<typeof AddEditTalentModal> | null>(null);
    const delTalentModal = ref<InstanceType<typeof DeleteModal> | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const mode = computed(() => eoteMan.mode);
    const talents = computed(() => eoteMan.talents);

    const sortedTalents = computed(() =>
    {
        return sortBy(talents.value, [ 'tier', 'name' ], [ 'asc', 'desc' ]);
    });

    const sortedSelected = computed(() =>
    {
        return sortBy(
            selectedTalents.value
                .map((talentInst) =>
                {
                    const talentBase = talents.value.find(({ id }) => id === talentInst.id);
                    return {
                        ...talentInst,
                        base: talentBase
                    };
                }),
            [
                'base.tier',
                'base.name'
            ]
        );
    });

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function show(char : EoteOrGenCharacter) : void
    {
        selectedTalents.value = char.details.talents;

        delTalent.value.id = '';
        delTalent.value.name = '';

        innerModal.value.show();
    }

    function hide() : void
    {
        innerModal.value.hide();
    }

    function onSave() : void
    {
        emit('save', selectedTalents.value);
    }

    function onCancel() : void
    {
        selectedTalents.value = [];
        delTalent.value.id = '';
        delTalent.value.name = '';
    }

    function getActivation(talent : GenesysTalent) : string
    {
        return eoteMan.activationEnum[talent.activation] || 'Unknown';
    }

    function getInst(instID : number) : EoteTalentInst
    {
        return selectedTalents.value
            .find((talentInst) =>
            {
                return talentInst.id === instID;
            });
    }

    function getTalent(talentInstance : EoteTalentInst) : GenesysTalent
    {
        return talents.value.find((talent) => talent.id === talentInstance.id);
    }

    function onTalentAdd(talent : GenesysTalent) : void
    {
        const newTalent : EoteTalentInst = { id: talent.id };

        if(getTalent(newTalent).ranked)
        {
            newTalent.ranks = 1;
        }

        selectedTalents.value = uniqBy([ ...selectedTalents.value, newTalent ], 'id');
    }

    function onTalentRemove(talent) : void
    {
        selectedTalents.value = selectedTalents.value.filter((item) => item.id !== talent.id);
    }

    function onTalentNew() : void
    {
        addEditTalentModal.value.show();
    }

    function onTalentEdit(talent : GenesysTalent) : void
    {
        addEditTalentModal.value.show(talent);
    }

    function onTalentDelete(talent : GenesysTalent) : void
    {
        delTalent.value.id = talent.id;
        delTalent.value.name = talent.name;

        delTalentModal.value.show();
    }

    function onDelTalentHidden() : void
    {
        delTalent.value.id = '';
        delTalent.value.name = '';
    }

    async function onDelTalentDelete() : Promise<void>
    {
        suppSelect.value.clearSelection();
        selectedTalents.value = selectedTalents.value.filter((item) => item.id !== delTalent.value.id);

        await eoteMan.delSup('talents', { id: `${ delTalent.value.id }` });

        emit('save', selectedTalents.value);
    }

    function editInstanceNotes(instance : EoteTalentInst) : void
    {
        editInstance.value = instance;
    }

    function saveInstanceNotes(instance : EoteTalentInst, cancel = false)
    {
        if(!cancel)
        {
            const inst = getInst(instance.id);
            inst.notes = editInstance.value.notes;
        }

        editInstance.value = undefined;
    }

    //------------------------------------------------------------------------------------------------------------------

    defineExpose({ show, hide });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
