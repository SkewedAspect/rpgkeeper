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
            <template #modal-title>
                <span v-if="isNew">
                    <fa icon="file-plus"></fa>
                    Add
                </span>
                <span v-else>
                    <fa icon="file-edit"></fa>
                    Edit
                </span>
                Page
            </template>

            <!-- Modal Content -->
            <BFormGroup
                id="page-title-group"
                label="Title"
                label-for="page-title"
            >
                <BFormInput id="page-title" v-model="innerPage.title"></BFormInput>
            </BFormGroup>
            <BFormGroup
                id="page-content-group"
                label="Content"
                label-for="page-content"
            >
                <MarkdownEditor v-model:text="innerPage.content" height="550px"></MarkdownEditor>
            </BFormGroup>

            <!-- Modal Buttons -->
            <template #modal-ok>
                <fa icon="save"></fa>
                Save
            </template>
            <template #modal-cancel>
                <fa icon="times"></fa>
                Cancel
            </template>
        </BModal>
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { ref, computed } from 'vue';

    // Models
    import { NotebookPage } from '../../lib/models/notebook';

    // Components
    import MarkdownEditor from '../ui/markdownEditor.vue';
    import { BModal } from 'bootstrap-vue-next';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface EmittedEvents
    {
        (e : 'hidden') : void;
        (e : 'save', page : Omit<NotebookPage, 'notebookID'>) : void;
        (e : 'cancel') : void;
    }

    const emit = defineEmits<EmittedEvents>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const innerPage = ref<Omit<NotebookPage, 'notebookID'>>({
        id: '',
        title: '',
        content: ''
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

        innerModal.value.show();
    }

    function hide() : void
    {
        innerModal.value.hide();
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
