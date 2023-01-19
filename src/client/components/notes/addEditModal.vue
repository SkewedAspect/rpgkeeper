<!----------------------------------------------------------------------------------------------------------------------
  -- addEditModal.vue
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="add-edit-page">
        <b-modal
            ref="innerModal"
            header-bg-variant="dark"
            header-text-variant="white"
            no-close-on-esc
            no-close-on-backdrop
            size="xl"
            @ok="onSave"
            @cancel="onCancel"
            @shown="onShown"
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
            <b-form-group
                id="page-title-group"
                label="Title"
                label-for="page-title"
            >
                <b-form-input id="page-title" v-model="innerPage.title"></b-form-input>
            </b-form-group>
            <b-form-group
                id="page-content-group"
                label="Content"
                label-for="page-content"
            >
                <b-card class="overflow-hidden" no-body>
                    <codemirror ref="editor" v-model="innerPage.content"></codemirror>
                </b-card>
            </b-form-group>

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
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss">
    .add-edit-page {
        .CodeMirror {
            height: 550px;
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    //------------------------------------------------------------------------------------------------------------------

    import { ref, computed } from 'vue';

    // Models
    import { NotebookPage } from '../../lib/models/notebook';

    // Components
    import { BModal } from 'bootstrap-vue';

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

    const innerModal = ref<InstanceType<typeof BModal> | null>(null);

    // FIXME: Upgrade to codemirror v6 and add types!
    const editor = ref<any | null>(null);

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

    function cmRefresh() : void
    {
        // FIXME: Upgrade to codemirror v6 and fix this!
        editor.value['codemirror'].refresh();
    }

    function onHidden() : void
    {
        emit('hidden');
    }

    function onShown() : void
    {
        cmRefresh();
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
