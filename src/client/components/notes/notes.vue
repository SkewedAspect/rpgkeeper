<!----------------------------------------------------------------------------------------------------------------------
  -- Notes Component
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <b-card v-if="notes" id="notes" header-bg-variant="dark" header-text-variant="white" class="shadow-sm h-100" no-body>
        <!-- Card Header -->
        <template #header>
            <div class="d-flex">
                <h5 class="align-items-center d-flex text-nowrap m-0 mr-2 flex-grow-0 flex-shrink-0 w-auto">
                    <fa class="mr-1" icon="book"></fa>
                    <span class="d-none d-md-inline">
                        Character Notes
                    </span>
                </h5>
                <div class="ml-auto d-flex flex-nowrap">
                    <b-form-select v-model="currentID" class="mr-2 d-sm-none" :options="notes.pages" text-field="title" value-field="id"></b-form-select>
                    <b-button-toolbar class="flex-shrink-0 flex-grow-0 w-auto">
                        <b-btn @click="openAddEditModal()">
                            <fa icon="file-plus" fixed-width></fa>
                            <span class="d-none d-md-inline">New</span>
                        </b-btn>
                        <b-btn class="ml-2" :disabled="!currentPage" @click="openAddEditModal(currentPage)">
                            <fa icon="edit" fixed-width></fa>
                            <span class="d-none d-md-inline">Edit</span>
                        </b-btn>
                        <b-btn class="ml-2" :disabled="!currentPage" @click="openDelModal(currentPage)">
                            <fa icon="trash-alt" fixed-widt></fa>
                            <span class="d-none d-md-inline">Delete</span>
                        </b-btn>
                    </b-button-toolbar>
                </div>
            </div>
        </template>

        <!-- No Notes help text -->
        <div v-if="notes.pages.length < 1" class="card-body text-center">
            <h5>No pages found.</h5>
            <i>To add a note, click the</i> <fa icon="file-plus"></fa> New <i>button above.</i>
        </div>

        <!-- Notes tabs -->
        <b-tabs v-else v-model="pageIndex" nav-wrapper-class="d-none d-md-block" pills card vertical>
            <b-tab v-for="page in notes.pages" :key="page.id">
                <template slot="title">
                    <fa icon="file-alt"></fa>
                    {{ page.title }}
                </template>
                <note-page :content="page.content"></note-page>
            </b-tab>
        </b-tabs>

        <!-- Modals -->
        <add-edit-modal v-model="addEditPage" @hidden="onAddEditHidden"></add-edit-modal>
        <delete-modal v-model="delPage" @hidden="onDelHidden"></delete-modal>
    </b-card>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss">
    #notes {
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts">
    //------------------------------------------------------------------------------------------------------------------

    import Vue from 'vue';

    // Managers
    import noteMan from '../../lib/managers/notebook';

    // Components
    import NotePage from './page.vue';
    import AddEditModal from './addEditModal.vue';
    import DeleteModal from './deleteModal.vue';

    //------------------------------------------------------------------------------------------------------------------

    export default Vue.extend({
        name: 'NoteBook',
        components: {
            NotePage,
            AddEditModal,
            DeleteModal
        },
        props: {
            disabled: {
                type: Boolean,
                default: false
            }
        },
        subscriptions()
        {
            return {
                notes: noteMan.selected$
            };
        },
        data()
        {
            return {
                pageIndex: 0,
                delPage: undefined,
                addEditPage: undefined
            };
        },
        computed: {
            currentPage()
            {
                return this.notes.pages[this.pageIndex];
            },
            currentID: {
                get() { return (this.currentPage || {}).id; },
                set(val)
                {
                    const idx = this.notes.pages.findIndex((note) => note.id === val);
                    if(idx >= 0)
                    {
                        this.pageIndex = idx;
                    }
                }
            }
        },
        methods: {
            openAddEditModal(page)
            {
                if(!page)
                {
                    // Yes, this is not a page model. But we don't need one.
                    page = {
                        title: '',
                        content: ''
                    };
                }

                this.addEditPage = page;
            },
            onAddEditHidden()
            {
                if(!this.addEditPage.id)
                {
                    this.pageIndex = this.notes.pages.length - 1;
                }

                this.addEditPage = undefined;
            },
            openDelModal(page)
            {
                this.delPage = page;
            },
            onDelHidden()
            {
                this.delPage = undefined;
            }
        }
    });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
