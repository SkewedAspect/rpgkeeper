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
                        />
                    </div>
                    <div class="mb-2">
                        <i v-if="supplement.passive">Passive</i>
                        <i v-else>Active</i>
                    </div>
                </div>
                <MarkdownBlock :text="supplement.description" inline />
                <Reference
                    class="float-end mt-2"
                    :reference="supplement.reference"
                />
            </template>
        </SupplementSelect>

        <!-- Modals -->
        <AddEditQualityModal ref="addEditQualityModal" @add="onQualityAdd" />
        <DeleteModal
            ref="delQualityModal"
            :name="delQuality.name"
            type="quality"
            @hidden="onDelQualityHidden"
            @delete="onDelQualityDelete"
        />
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, ref } from 'vue';

    // Models
    import type { EoteQuality, EoteQualityRef } from '../../models.ts';

    // Managers
    import eoteMan from '@client/lib/managers/systems/eote';

    // Components
    import SupplementSelect from '@client/components/character/supplementSelect.vue';
    import DeleteModal from '@client/components/ui/deleteModal.vue';
    import AddEditQualityModal from '../modals/addEditQualityModal.vue';
    import MarkdownBlock from '@client/components/ui/markdownBlock.vue';
    import Reference from '@client/components/character/referenceBlock.vue';

    // Utils
    import { uniqBy } from '@client/lib/utils/misc';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Props
    {
        qualities : EoteQualityRef[];
    }

    const props = defineProps<Props>();

    type Events = (e : 'update:qualities', qualities : EoteQualityRef[]) => void;

    const emit = defineEmits<Events>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const delQuality = ref<{ id ?: string, name ?: string }>({
        id: undefined,
        name: undefined,
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
        },
    });

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function getQual(qualityId : string) : EoteQuality | undefined
    {
        return allQualities.value.find((qual) => qual.id === qualityId);
    }

    function onQualityAdd(quality : { id ?: string }) : void
    {
        if(!quality.id) { return; }
        const newQual : { id : string, ranks ?: number } = { id: quality.id };
        const qualDef = getQual(quality.id);

        if(qualDef?.ranked)
        {
            newQual.ranks = 1;
        }

        // Update to uniq'd version of the array
        selectedQualities.value = uniqBy([ ...selectedQualities.value, newQual ], 'id');
    }

    function onQualityRemove(quality : { id ?: string }) : void
    {
        if(!quality.id) { return; }
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
