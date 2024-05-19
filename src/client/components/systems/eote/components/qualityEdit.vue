<!----------------------------------------------------------------------------------------------------------------------
  -- qualityEdit.vue
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div id="quality-edit">
        <SupplementSelect
            ref="suppSelect"
            label="Qualities"
            label-class="fw-bold"
            :available="allQualities"
            :selected="selectedQualities"
            @add="onQualityAdd"
            @remove="onQualityRemove"
            @new="onQualityNew"
            @edit="onQualityEdit"
            @delete="onQualityDelete"
        >
            <template #preview="{ instance, supplement }">
                <div>
                    <div v-if="supplement.ranked" class="mb-2 float-end">
                        <label>Ranks</label>
                        <BFormSpinbutton
                            id="sb-inline"
                            v-model="instance.ranks"
                            class="ms-1"
                            size="sm"
                            inline
                        ></BFormSpinbutton>
                    </div>
                    <div class="mb-2">
                        <i v-if="supplement.passive">Passive</i>
                        <i v-else>Active</i>
                    </div>
                </div>
                <MarkdownBlock :text="supplement.description" inline></MarkdownBlock>
                <reference
                    class="float-end mt-2"
                    :reference="supplement.reference"
                ></reference>
            </template>
        </SupplementSelect>

        <!-- Modals -->
        <AddEditQualityModal ref="addEditQualityModal" @add="onQualityAdd"></AddEditQualityModal>
        <DeleteModal
            ref="delQualityModal"
            :name="delQuality.name"
            type="quality"
            @hidden="onDelQualityHidden"
            @delete="onDelQualityDelete"
        ></DeleteModal>
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { ref, computed } from 'vue';

    // Models
    import { EoteQuality, EoteQualityRef } from '../../../../../common/interfaces/systems/eote';

    // Managers
    import eoteMan from '../../../../lib/managers/systems/eote';

    // Components
    import SupplementSelect from '../../../character/supplementSelect.vue';
    import DeleteModal from '../../../ui/deleteModal.vue';
    import AddEditQualityModal from '../modals/addEditQualityModal.vue';
    import MarkdownBlock from '../../../ui/markdownBlock.vue';
    import Reference from '../../../character/referenceBlock.vue';

    // Utils
    import { uniqBy } from '../../../../lib/utils/misc';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Props
    {
        qualities : EoteQualityRef[];
    }

    const props = defineProps<Props>();

    interface Events
    {
        (e : 'update:qualities', qualities : EoteQualityRef[]) : void;
    }

    const emit = defineEmits<Events>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const delQuality = ref<{ id ?: number, name ?: string }>({
        id: undefined,
        name: undefined
    });

    const addEditQualityModal = ref<InstanceType<typeof AddEditQualityModal> | null>(null);
    const delQualityModal = ref<InstanceType<typeof DeleteModal> | null>(null);
    const suppSelect = ref<InstanceType<typeof SupplementSelect> | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const allQualities = computed(() => eoteMan.qualities);
    const selectedQualities = computed({
        get()
        {
            return [ ...props.qualities ];
        },
        set(val)
        {
            emit('update:qualities', val);
        }
    });

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function getQual(qualityInstance : EoteQualityRef)
    {
        return allQualities.value.find((qual) => qual.id === qualityInstance.id);
    }

    function onQualityAdd(quality : EoteQualityRef) : void
    {
        const newQual : { id : number, ranks ?: number } = { id: quality.id };

        if(getQual(quality).ranked)
        {
            newQual.ranks = 1;
        }

        // Update to uniq'd version of the array
        selectedQualities.value = uniqBy([ ...selectedQualities.value, newQual ], 'id');
    }

    function onQualityRemove(quality : EoteQualityRef) : void
    {
        selectedQualities.value = selectedQualities.value.filter((qual) => qual.id !== quality.id);
    }

    function onQualityNew() : void
    {
        addEditQualityModal.value.show();
    }

    function onQualityEdit(quality : EoteQuality) : void
    {
        addEditQualityModal.value.show(quality);
    }

    function onQualityDelete(quality : EoteQuality) : void
    {
        delQuality.value.id = quality.id;
        delQuality.value.name = quality.name;

        delQualityModal.value.show();
    }

    function onDelQualityHidden() : void
    {
        delQuality.value.id = undefined;
        delQuality.value.name = undefined;
    }

    async function onDelQualityDelete() : Promise<void>
    {
        suppSelect.value.clearSelection();

        await eoteMan.delSup('qualities', { id: `${ delQuality.value.id }` });

        selectedQualities.value = selectedQualities.value.filter((item) => item.id !== delQuality.value.id);
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
