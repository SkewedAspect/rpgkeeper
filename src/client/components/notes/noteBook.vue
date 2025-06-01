<!----------------------------------------------------------------------------------------------------------------------
  -- Notes Component
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <BCard id="notes" header-bg-variant="dark" header-text-variant="white" class="shadow-sm h-100" no-body>
        <!-- Card Header -->
        <template #header>
            <div class="d-flex">
                <h5 class="align-items-center d-flex text-nowrap m-0 me-2 flex-grow-0 flex-shrink-0 w-auto">
                    <Fa class="me-1" icon="book" />
                    <span class="d-none d-md-inline">
                        Character Notes
                    </span>
                </h5>
                <div v-b-color-mode="'light'" class="ms-auto d-flex flex-nowrap">
                    <BFormSelect
                        v-model="pageIndex"
                        class="me-2 d-md-none"
                        :options="pageOptions"
                        text-field="title"
                        value-field="index"
                    />
                    <BButtonToolbar class="flex-shrink-0 flex-grow-0 w-auto">
                        <BButton @click="openAddEditModal()">
                            <Fa icon="file-plus" fixed-width />
                            <span class="d-none d-md-inline">New</span>
                        </BButton>
                        <BButton class="ms-2" :disabled="!currentPage" @click="openAddEditModal(currentPage)">
                            <Fa icon="edit" fixed-width />
                            <span class="d-none d-md-inline">Edit</span>
                        </BButton>
                        <BButton class="ms-2" :disabled="!currentPage" @click="openDelModal(currentPage)">
                            <Fa icon="trash-alt" fixed-widt />
                            <span class="d-none d-md-inline">Delete</span>
                        </BButton>
                    </BButtonToolbar>
                </div>
            </div>
        </template>

        <!-- No Notes help text -->
        <div v-if="notes.pages.length < 1" class="card-body text-center">
            <h5>No pages found.</h5>
            <i>To add a note, click the</i> <Fa icon="file-plus" /> New <i>button above.</i>
        </div>

        <!-- Notes tabs -->
        <BTabs
            v-else
            v-model:index="pageIndex"
            nav-wrapper-class="d-none d-md-block ps-3 py-2"
            nav-item-class="text-nowrap text-start"
            justified
            pills
            vertical
        >
            <BTab v-for="page in notes.pages" :key="page.id">
                <template #title>
                    <Fa icon="file-alt" />
                    {{ page.title }}
                </template>
                <NotePage class="pe-2 pb-3" :content="page.content" />
            </BTab>
        </BTabs>

        <!-- Modals -->
        <AddEditModal ref="addEditModal" @save="onAddEditSave" />
        <DeleteModal ref="delModal" @delete="onDelete" />
    </BCard>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    //------------------------------------------------------------------------------------------------------------------

    import { computed, ref } from 'vue';

    // Models
    import { NotebookPage } from '../../../common/models';

    // Stores
    import { useNotebookStore } from '../../lib/resource-access/stores/notebook';

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

    const pageOptions = computed(() =>
    {
        return notes.pages.map((page, index) =>
        {
            return { title: page.title, value: page.id, index };
        });
    });

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
