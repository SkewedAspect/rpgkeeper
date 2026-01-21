<!----------------------------------------------------------------------------------------------------------------------
  -- AddEditQualityModal
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="add-quality-modal">
        <BModal
            ref="innerModal"
            header-bg-variant="dark"
            header-text-variant="white"
            no-close-on-esc
            no-close-on-backdrop
            size="lg"
            @ok="onSave"
            @hidden="onCancel"
        >
            <!-- Modal Header -->
            <template #header="{ cancel }">
                <h5 v-b-color-mode="'dark'" class="w-100 mb-0">
                    <Fa icon="file-edit" />
                    <span v-if="isEdit">
                        Edit
                    </span>
                    <span v-else>
                        Add
                    </span>
                    Quality
                    <CloseButton class="float-end" @click="cancel" />
                </h5>
            </template>

            <!-- Modal Content -->
            <BFormRow>
                <BCol cols="10">
                    <BFormGroup
                        label="Name"
                        label-class="fw-bold"
                        label-for="name-input"
                    >
                        <BFormInput id="name-input" v-model="name" autocomplete="off" />
                    </BFormGroup>
                </BCol>
                <BCol cols="2" class="pt-4">
                    <BFormCheckbox v-model="passive" name="passive-check" switch>
                        <b>Passive</b>
                    </BFormCheckbox>
                    <BFormCheckbox v-model="ranked" name="ranked-check" switch>
                        <b>Ranked</b>
                    </BFormCheckbox>
                </BCol>
            </BFormRow>
            <BFormGroup
                id="extras-input-group"
                label="Description"
                label-class="fw-bold"
                label-for="extras-input"
            >
                <MarkdownEditor v-model:text="description" />
            </BFormGroup>

            <EditReference v-model:reference="reference" />

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
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, ref, useTemplateRef } from 'vue';

    // Models
    import type { EoteQuality } from '../../../models.ts';

    // Stores
    import { useSystemStore } from '@client/lib/resource-access/stores/systems';
    import { useSupplementStore } from '@client/lib/resource-access/stores/supplements';

    // Components
    import EditReference from '@client/components/character/editReference.vue';
    import MarkdownEditor from '@client/components/ui/markdownEditor.vue';
    import { BModal } from 'bootstrap-vue-next';
    import CloseButton from '@client/components/ui/closeButton.vue';

    // Utils
    import { normalizeReference } from '@client/lib/utils/misc';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    const emit = defineEmits<{
        add : [quality: EoteQuality]
        edit : [quality: EoteQuality]
    }>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const id = ref<string | undefined>(undefined);
    const name = ref('');
    const description = ref('');
    const reference = ref('');
    const passive = ref(false);
    const ranked = ref(false);

    const innerModal = useTemplateRef('innerModal');

    const systemStore = useSystemStore();
    const supplementStore = useSupplementStore();

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const mode = computed(() => systemStore.current?.id ?? 'eote');
    const isEdit = computed(() => id.value !== undefined);

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function show(quality ?: EoteQuality) : void
    {
        if(quality)
        {
            id.value = quality.id;
            name.value = quality.name;
            description.value = quality.description;
            passive.value = !!quality.passive;
            ranked.value = !!quality.ranked;
            reference.value = normalizeReference(quality.reference);
        }
        else
        {
            id.value = undefined;
            name.value = '';
            description.value = '';
            passive.value = false;
            ranked.value = false;
            reference.value = '';
        }

        innerModal.value?.show();
    }

    function hide() : void
    {
        id.value = undefined;
        name.value = '';
        description.value = '';
        passive.value = false;
        ranked.value = false;
        reference.value = '';

        innerModal.value?.hide();
    }

    async function onSave() : Promise<void>
    {
        if(isEdit.value)
        {
            const quality = await supplementStore.update<EoteQuality>(mode.value, 'quality', {
                id: id.value,
                name: name.value,
                description: description.value,
                passive: passive.value,
                ranked: ranked.value,
                reference: reference.value,
                official: false,
            });

            emit('edit', quality);
        }
        else
        {
            const quality = await supplementStore.add<EoteQuality>(mode.value, 'quality', {
                name: name.value,
                description: description.value,
                passive: passive.value,
                ranked: ranked.value,
                reference: reference.value,
                official: false,
            });

            emit('add', quality);
        }
    }

    function onCancel() : void
    {
        id.value = undefined;
        name.value = '';
        description.value = '';
        passive.value = false;
        ranked.value = false;
        reference.value = '';
    }

    //------------------------------------------------------------------------------------------------------------------

    defineExpose({ show, hide });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
