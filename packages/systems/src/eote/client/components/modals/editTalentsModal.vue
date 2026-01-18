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
                    <Fa icon="file-edit" />
                    Edit Talents
                    <CloseButton class="float-end" @click="cancel" />
                </h5>
            </template>

            <!-- Modal Content -->
            <div :class="`${ mode }-system`">
                <SupplementSelect
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
                            <div
                                v-if="(supplement as BaseTalent).ranked && getInst(instance.id)"
                                class="mb-2 float-end"
                            >
                                <label class="me-2">Ranks</label>
                                <BFormSpinbutton v-model="getInst(instance.id)!.ranks" inline />
                            </div>
                            <div class="mb-2">
                                <i>{{ getActivation(supplement as BaseTalent) }}</i>
                            </div>
                            <MarkdownBlock :text="(supplement as BaseTalent).description" inline />
                            <Reference
                                class="float-end mt-2"
                                :reference="supplement.reference"
                            />
                        </div>
                        <div class="font-sm">
                            <hr>
                            <div class="float-end">
                                <BButton
                                    v-if="!editInstance"
                                    size="sm"
                                    @click="editInstanceNotes(instance as BaseTalentInst)"
                                >
                                    <Fa icon="edit" />
                                    Edit Notes
                                </BButton>
                            </div>
                            <BCard v-if="editInstance" class="overflow-hidden" no-body>
                                <MarkdownBlock v-model:text="editInstance.notes" inline />
                                <template #footer>
                                    <div class="text-end">
                                        <BButton
                                            v-if="editInstance"
                                            class="me-2"
                                            size="sm"
                                            @click="saveInstanceNotes(instance as BaseTalentInst, true)"
                                        >
                                            <Fa icon="times" />
                                            Cancel Notes
                                        </BButton>
                                        <BButton
                                            v-if="editInstance"
                                            variant="success"
                                            size="sm"
                                            @click="saveInstanceNotes(instance as BaseTalentInst)"
                                        >
                                            <Fa icon="save" />
                                            Save Notes
                                        </BButton>
                                    </div>
                                </template>
                            </BCard>
                            <MarkdownBlock
                                v-else-if="(instance as BaseTalentInst).notes"
                                :text="(instance as BaseTalentInst).notes!"
                                inline
                            />
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
                </SupplementSelect>
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
        <AddEditTalentModal ref="addEditTalentModal" @add="onTalentAdd" />
        <DeleteModal
            ref="delTalentModal"
            :name="delTalent.name"
            type="talent"
            @hidden="onDelTalentHidden"
            @delete="onDelTalentDelete"
        />
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, ref } from 'vue';
    import { sortBy } from 'lodash';

    // Models
    import type {
        EoteOrGenCharacter,
        EoteTalentInst,
        GenesysTalent,
        GenesysTalentInst,
    } from '../../../models.ts';

    // Use type aliases for template casts
    type BaseTalent = GenesysTalent;
    type BaseTalentInst = GenesysTalentInst;

    // Stores
    import { useSystemStore } from '@client/lib/resource-access/stores/systems';
    import { useSupplementStore } from '@client/lib/resource-access/stores/supplements';

    // Constants
    import { activationEnum } from '../../constants';

    // Components
    import SupplementSelect from '@client/components/character/supplementSelect.vue';
    import DeleteModal from '@client/components/ui/deleteModal.vue';
    import MarkdownBlock from '@client/components/ui/markdownBlock.vue';
    import Reference from '@client/components/character/referenceBlock.vue';
    import AddEditTalentModal from './addEditTalentModal.vue';
    import { BModal } from 'bootstrap-vue-next';

    // Utils
    import { uniqBy } from '@client/lib/utils/misc';
    import CloseButton from '@client/components/ui/closeButton.vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    type Events = (e : 'save', talents : EoteTalentInst[]) => void;

    const emit = defineEmits<Events>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const selectedTalents = ref<EoteTalentInst[]>([]);
    const delTalent = ref<{ id : string, name : string }>({
        id: '',
        name: '',
    });
    const editInstance = ref<EoteTalentInst>(undefined);

    const suppSelect = ref<InstanceType<typeof SupplementSelect> | null>(null);
    const innerModal = ref<InstanceType<typeof BModal> | null>(null);
    const addEditTalentModal = ref<InstanceType<typeof AddEditTalentModal> | null>(null);
    const delTalentModal = ref<InstanceType<typeof DeleteModal> | null>(null);

    const systemStore = useSystemStore();
    const supplementStore = useSupplementStore();

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const mode = computed(() => systemStore.current?.id ?? 'eote');
    const talents = computed(() => supplementStore.get<GenesysTalent>(mode.value, 'talent'));

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
                        base: talentBase,
                    };
                }),
            [
                'base.tier',
                'base.name',
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

        innerModal.value?.show();
    }

    function hide() : void
    {
        innerModal.value?.hide();
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

    function getActivation(talent : { activation ?: string }) : string
    {
        return activationEnum[talent.activation] || 'Unknown';
    }

    function getInst(instID : string) : EoteTalentInst | undefined
    {
        return selectedTalents.value.find((talentInst) => talentInst.id === instID);
    }

    function getTalent(talentId : string) : GenesysTalent | undefined
    {
        return talents.value.find((talent) => talent.id === talentId);
    }

    function onTalentAdd(talent : { id ?: string }) : void
    {
        if(!talent.id) { return; }
        const newTalent : EoteTalentInst = { id: talent.id };
        const talentDef = getTalent(talent.id);

        if(talentDef?.ranked)
        {
            newTalent.ranks = 1;
        }

        selectedTalents.value = uniqBy([ ...selectedTalents.value, newTalent ], 'id');
    }

    function onTalentRemove(talent : { id ?: string }) : void
    {
        if(!talent.id) { return; }
        selectedTalents.value = selectedTalents.value.filter((item) => item.id !== talent.id);
    }

    function onTalentNew() : void
    {
        addEditTalentModal.value?.show();
    }

    function onTalentEdit(talent : GenesysTalent) : void
    {
        addEditTalentModal.value?.show(talent);
    }

    function onTalentDelete(talent : GenesysTalent) : void
    {
        delTalent.value.id = talent.id;
        delTalent.value.name = talent.name;

        delTalentModal.value?.show();
    }

    function onDelTalentHidden() : void
    {
        delTalent.value.id = '';
        delTalent.value.name = '';
    }

    async function onDelTalentDelete() : Promise<void>
    {
        suppSelect.value?.clearSelection();
        selectedTalents.value = selectedTalents.value.filter((item) => item.id !== delTalent.value.id);

        await supplementStore.remove(mode.value, 'talent', delTalent.value.id);

        emit('save', selectedTalents.value);
    }

    function editInstanceNotes(instance : EoteTalentInst) : void
    {
        editInstance.value = instance;
    }

    function saveInstanceNotes(instance : EoteTalentInst, cancel = false) : void
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
