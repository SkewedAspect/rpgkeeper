<!----------------------------------------------------------------------------------------------------------------------
  -- addEditModal.vue
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="add-edit-page">
        <BModal
            ref="innerModal"
            header-bg-variant="dark"
            header-text-variant="white"
            no-close-on-esc
            no-close-on-backdrop
            size="xl"
            @ok="onSave"
            @cancel="onCancel"
            @hidden="onHidden"
        >
            <!-- Modal Header -->
            <template #header="{ cancel }">
                <h5 v-b-color-mode="'dark'" class="w-100 mb-0">
                    <span v-if="isNew">
                        <Fa icon="file-plus" />
                        Add
                    </span>
                    <span v-else>
                        <Fa icon="file-edit" />
                        Edit
                    </span>
                    Page
                    <CloseButton class="float-end" @click="cancel" />
                </h5>
            </template>

            <!-- Modal Content -->
            <BFormGroup
                id="page-title-group"
                label="Title"
                label-for="page-title"
            >
                <BFormInput id="page-title" v-model="innerPage.title" />
            </BFormGroup>
            <BFormGroup
                id="page-content-group"
                label="Content"
                label-for="page-content"
            >
                <MarkdownEditor v-model:text="innerPage.content" height="550px" />
            </BFormGroup>

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
    import { computed, ref } from 'vue';

    // Models
    import type { NotebookPage } from '@rpgk/core';

    // Components
    import MarkdownEditor from '../ui/markdownEditor.vue';
    import { BModal } from 'bootstrap-vue-next';
    import CloseButton from '../ui/closeButton.vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    const emit = defineEmits<{
        hidden : [];
        save : [page : Omit<NotebookPage, 'notebookID'>];
        cancel : [];
    }>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const innerPage = ref<Omit<NotebookPage, 'notebookID'>>({
        id: '',
        title: '',
        content: '',
    });

    // Component Refs
    const innerModal = ref<InstanceType<typeof BModal> | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const isNew = computed(() =>
    {
        return !innerPage.value.id;
    });

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function show(page ?: NotebookPage) : void
    {
        if(page)
        {
            innerPage.value.id = page?.id ?? '';
            innerPage.value.title = page?.title ?? '';
            innerPage.value.content = page?.content ?? '';
        }
        else
        {
            innerPage.value.id = '';
            innerPage.value.title = '';
            innerPage.value.content = '';
        }

        innerModal.value?.show();
    }

    function hide() : void
    {
        innerModal.value?.hide();
    }

    function onHidden() : void
    {
        emit('hidden');
    }

    function onSave() : void
    {
        emit('save', innerPage.value);
    }

    function onCancel() : void
    {
        emit('cancel');
    }

    //------------------------------------------------------------------------------------------------------------------

    defineExpose({ show, hide });

    //------------------------------------------------------------------------------------------------------------------
</script>

<!--------------------------------------------------------------------------------------------------------------------->
