<!----------------------------------------------------------------------------------------------------------------------
  -- AddEditAbilityModal
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="add-ability-modal">
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
                    Ability
                    <CloseButton class="float-end" @click="cancel" />
                </h5>
            </template>

            <!-- Modal Content -->
            <BFormGroup
                label="Name"
                label-class="fw-bold"
                label-for="ability-name-input"
            >
                <BFormInput id="ability-name-input" v-model="name" autocomplete="off" />
            </BFormGroup>
            <BFormGroup
                label="Description"
                label-class="fw-bold"
                label-for="ability-desc-input"
                class="mt-2"
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
    import type { Supplement } from '@rpgk/core';

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
        add : [ability : Supplement]
        edit : [ability : Supplement]
    }>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const id = ref<string | undefined>(undefined);
    const name = ref('');
    const description = ref('');
    const reference = ref('');

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

    function show(ability ?: Supplement) : void
    {
        if(ability)
        {
            id.value = ability.id;
            name.value = ability.name;
            description.value = ability.description ?? '';
            reference.value = normalizeReference(ability.reference);
        }
        else
        {
            id.value = undefined;
            name.value = '';
            description.value = '';
            reference.value = '';
        }

        innerModal.value?.show();
    }

    function hide() : void
    {
        id.value = undefined;
        name.value = '';
        description.value = '';
        reference.value = '';

        innerModal.value?.hide();
    }

    async function onSave() : Promise<void>
    {
        if(isEdit.value)
        {
            const ability = await supplementStore.update<Supplement>(mode.value, 'ability', {
                id: id.value,
                name: name.value,
                description: description.value,
                reference: reference.value,
                official: false,
            });

            emit('edit', ability);
        }
        else
        {
            const ability = await supplementStore.add<Supplement>(mode.value, 'ability', {
                name: name.value,
                description: description.value,
                reference: reference.value,
                official: false,
            });

            emit('add', ability);
        }
    }

    function onCancel() : void
    {
        id.value = undefined;
        name.value = '';
        description.value = '';
        reference.value = '';
    }

    //------------------------------------------------------------------------------------------------------------------

    defineExpose({ show, hide });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
