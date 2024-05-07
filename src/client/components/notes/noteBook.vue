<!----------------------------------------------------------------------------------------------------------------------
  -- Notes Component
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <BCard id="notes" header-bg-variant="dark" header-text-variant="white" class="shadow-sm h-100" no-body>
        <!-- Card Header -->
        <template #header>
            <div class="d-flex">
                <h5 class="align-items-center d-flex text-nowrap m-0 me-2 flex-grow-0 flex-shrink-0 w-auto">
                    <fa class="me-1" icon="book"></fa>
                    <span class="d-none d-md-inline">
                        Character Notes
                    </span>
                </h5>
                <div class="ml-auto d-flex flex-nowrap">
                    <BFormSelect v-model="pageIndex" class="me-2 d-sm-none" :options="notes.pages" text-field="title" value-field="id"></BFormSelect>
                    <BButtonToolbar class="flex-shrink-0 flex-grow-0 w-auto">
                        <BButton @click="openAddEditModal()">
                            <fa icon="file-plus" fixed-width></fa>
                            <span class="d-none d-md-inline">New</span>
                        </BButton>
                        <BButton class="ms-2" :disabled="!currentPage" @click="openAddEditModal(currentPage)">
                            <fa icon="edit" fixed-width></fa>
                            <span class="d-none d-md-inline">Edit</span>
                        </BButton>
                        <BButton class="ms-2" :disabled="!currentPage" @click="openDelModal(currentPage)">
                            <fa icon="trash-alt" fixed-widt></fa>
                            <span class="d-none d-md-inline">Delete</span>
                        </BButton>
                    </BButtonToolbar>
                </div>
            </div>
        </template>

        <!-- No Notes help text -->
        <div v-if="notes.pages.length < 1" class="card-body text-center">
            <h5>No pages found.</h5>
            <i>To add a note, click the</i> <fa icon="file-plus"></fa> New <i>button above.</i>
        </div>

        <!-- Notes tabs -->
        <BTabs v-else v-model="pageIndex" nav-wrapper-class="d-none d-md-block" pills card vertical>
            <BTab v-for="page in notes.pages" :key="page.id">
                <template #title>
                    <fa icon="file-alt"></fa>
                    {{ page.title }}
                </template>
                <note-page :content="page.content"></note-page>
            </BTab>
        </BTabs>

        <!-- Modals -->
        <AddEditModal
            ref="addEditModal"
            @save="onAddEditSave"
        ></AddEditModal>
        <DeleteModal
            ref="delModal"
            @delete="onDelete"
        ></DeleteModal>
    </BCard>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    //------------------------------------------------------------------------------------------------------------------

    import { ref, computed } from 'vue';

    // Models
    import { NotebookPage } from '../../lib/models/notebook';

    // Stores
    import { useNotebookStore } from '../../lib/stores/notebook';

    // Managers
    import notebookMan from '../../lib/managers/notebook';

    // Components
    import NotePage from './notePage.vue';
    import AddEditModal from './addEditModal.vue';
    import DeleteModal from './deleteModal.vue';

    //------------------------------------------------------------------------------------------------------------------

    const notes = useNotebookStore();
    const pageIndex = ref(0);

    const addEditModal = ref<InstanceType<typeof AddEditModal> | null>(null);
    const delModal = ref<InstanceType<typeof DeleteModal> | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const currentPage = computed<NotebookPage | undefined>(() => { return notes.pages[pageIndex.value]; });

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function openAddEditModal(page ?: NotebookPage) : void
    {
        // Show the modal
        addEditModal.value.show(page);
    }

    function openDelModal(page : NotebookPage) : void
    {
        delModal.value.show(page);
    }

    async function onAddEditSave(page) : Promise<void>
    {
        if(page?.id)
        {
            await notebookMan.updatePage(notes.id, page);
        }
        else
        {
            await notebookMan.addPage(notes.id, page);
        }
    }

    async function onDelete(page) : Promise<void>
    {
        await notebookMan.deletePage(notes.id, page);
    }

</script>

<!--------------------------------------------------------------------------------------------------------------------->
