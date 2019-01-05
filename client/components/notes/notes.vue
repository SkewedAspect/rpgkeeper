<!--------------------------------------------------------------------------------------------------------------------->
<!-- Notes Component                                                                                                 -->
<!--------------------------------------------------------------------------------------------------------------------->

<template>
    <md-card id="notes">
        <!-- Card Header / Toolbar -->
        <md-toolbar>
            <h2 class="md-title" v-flex="1">Notes</h2>
            <md-button v-if="!disabled" @click.prevent.stop="openNewDialog()">New</md-button>
            <md-button v-if="!disabled && currentPageID" @click.prevent.stop="openEditDialog()">Edit</md-button>
        </md-toolbar>

        <!-- Card Content -->

        <!-- For mobile devices, we show a dropdown, instead of side tabs -->
        <md-card-content v-if="notes" class="hidden-sm-up" style="padding-top: 0; padding-bottom: 0">
            <md-input-container style="margin-bottom: 5px; padding-top: 0; min-height: 32px">
                <md-select name="page" id="page" v-model="currentPageID">
                    <md-option :value="page.id" v-for="page in notes.pages">{{ page.title }}</md-option>
                </md-select>
            </md-input-container>
        </md-card-content>

        <!-- If we have a current page id, show it -->
        <md-card-content style="display: flex" v-if="notes">
            <md-list v-flex="'0 1 300px'" id="note-tabs" class="hidden-sm-down">
                <md-list-item @click="loadPage(page)" v-for="page in notes.pages" :class="{ 'md-accent': page.id === currentPage.id }">
                    {{ page.title }}
                    <md-button v-if="!disabled" class="md-icon-button md-list-action md-warn"
                               @click.prevent.stop="confirmDelete(page)">
                        <md-icon class="md-warn">delete</md-icon>
                    </md-button>
                </md-list-item>
            </md-list>
            <note-page
                v-if="currentPage"
                :title="currentPage.title"
                :content="currentPage.content"
                v-flex="'max'" style="padding-left: 16px; padding-right: 16px">
            </note-page>
            <div class="text-center" v-flex="'max'" style="padding-left: 16px; padding-right: 16px" v-else>
                <i>Please select a note from the side.</i>
            </div>
        </md-card-content>

        <!-- Otherwise, we give them helpful getting started text -->
        <md-card-content v-else>
            <div class="text-center">
                <i>To add a note, click the 'new' button above.</i>
            </div>
        </md-card-content>

        <!-- Dialogs -->

        <!-- New Dialog -->
        <md-dialog id="new-note-dialog"  ref="newPageDialog" @open="onNewDialogOpen">
            <md-dialog-title>New Character</md-dialog-title>

            <md-dialog-content>
                <md-input-container :class="{ 'md-input-invalid': !newPage.title }">
                    <label>Title</label>
                    <md-input v-model="newPage.title" required></md-input>
                    <span class="md-error">Title is required</span>
                </md-input-container>

                <label style="font-size: 12px;">Content</label>
                <div id="code-mirror-input">
                    <vue-code v-model="newPage.content" :options="codeMirror" ref="newCodeMirror"></vue-code>
                </div>
            </md-dialog-content>

            <md-dialog-actions>
                <md-button class="md-primary" @click="closeNewDialog()">Cancel</md-button>
                <md-button class="md-primary"
                           :class="{ 'md-raised md-accent': newPageValid }"
                           @click="closeNewDialog(true)"
                           :disabled="!newPageValid">
                    Save
                </md-button>
            </md-dialog-actions>
        </md-dialog>

        <!-- Edit Dialog -->
        <md-dialog id="edit-note-dialog"  ref="editPageDialog" @open="onEditDialogOpen">
            <md-dialog-title>Edit Character</md-dialog-title>

            <md-dialog-content>
                <md-input-container :class="{ 'md-input-invalid': !editPage.title }">
                    <label>Title</label>
                    <md-input v-model="editPage.title" required></md-input>
                    <span class="md-error">Title is required</span>
                </md-input-container>

                <label style="font-size: 12px;">Content</label>
                <div id="code-mirror-input">
                    <vue-code v-model="editPage.content" :options="codeMirror" ref="editCodeMirror"></vue-code>
                </div>
            </md-dialog-content>

            <md-dialog-actions>
                <md-button class="md-primary" @click="closeEditDialog()">Cancel</md-button>
                <md-button class="md-primary"
                           :class="{ 'md-raised md-accent': editPageValid }"
                           @click="closeEditDialog(true)"
                           :disabled="!editPageValid">
                    Save
                </md-button>
            </md-dialog-actions>
        </md-dialog>

        <!-- Delete Note confirmation -->
        <md-dialog-confirm
            md-title="Delete Note"
            :md-content="`Are your sure you want to delete this note: '${ delPageTitle }'?`"
            md-ok-text="Delete"
            md-cancel-text="Cancel"
            @close="onConfirmDeleteClosed"
            ref="deleteNoteDialog">
        </md-dialog-confirm>

    </md-card>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss">
    #notes {
        #note-tabs {
            margin-left: -16px;
            margin-top: -16px;
            margin-bottom: -24px;
            box-shadow: 0 1px 5px rgba(0,0,0,.2), 0 2px 2px rgba(0,0,0,.14), 0 3px 1px -2px rgba(0,0,0,.12);

            .md-list-action:first-child {
                margin: 0;
            }
        }

        ul:not(.md-list)>li+li {
            margin-top: 0;
        }
    }

    #code-mirror-input {
        border: 1px solid rgba(0, 0, 0, 0.17);

        .CodeMirror {
            height: 500px;
        }

        @media(min-width: 400px) {
            width: 360px;
            max-width: 100%;
        }

        @media(min-width: 600px) {
            width: 560px;
            max-width: 100%;
        }

        @media(min-width: 800px) {
            width: 720px;
            max-width: 100%;
        }

        @media(min-width: 1000px) {
            width: 960px;
            max-width: 100%;
        }

        @media(min-width: 1200px) {
            width: 1140px;
            max-width: 100%;
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script>
    //------------------------------------------------------------------------------------------------------------------

    import _ from 'lodash';

    // Managers
    import noteMan from '../../api/managers/notes';

    // Codemirror component
    import VueCode from 'vue-code';
    import 'codemirror/mode/markdown/markdown';

    // Components
    import NotePage from './page.vue';

    //------------------------------------------------------------------------------------------------------------------

    export default {
        components: {
            NotePage,
            VueCode
        },
        props: {
            disabled: {
                type: Boolean,
                default: false
            }
        },
        subscriptions: {
            notes: noteMan.selected$,
        },
        data()
        {
            return {
                currentPageID: undefined,
                delPageTitle: '',
                delPageID: undefined,
                newPage: {
                    content: '',
                    title: ''
                },
                editPage: {
                    id: undefined,
                    content: '',
                    title: ''
                },
                codeMirror: {
                    lineWrapping: true,
                    mode: 'markdown'
                }
            };
        },
        computed: {
            currentPage()
            {
                let page = _.find(this.notes.pages, { id: this.currentPageID });
                return page || this.notes.pages[0];
            },
            newPageValid()
            {
                return !!this.newPage.title && !!this.newPage.content;
            },
            editPageValid()
            {
                return !!this.editPage.title && !!this.editPage.content;
            }
        },
        methods: {
            loadPage(page)
            {
                this.currentPageID = _.get(page, 'id');
            },
            reloadPage()
            {
                // We're tricking vue into thinking something changed.
                // const id = this.currentPageID;
                // this.currentPageID = id;
            },
            confirmDelete(page)
            {
                this.delPageID = page.id;
                this.delPageTitle = page.title;
                this.$refs.deleteNoteDialog.open();
            },
            async onConfirmDeleteClosed(result)
            {
                if(result === 'ok')
                {
                    const page = _.find(this.notes.pages, { id: this.delPageID });
                    await noteMan.deletePage(this.notes, page);

                    // Load a new page.
                    if(this.delPageID === this.currentPageID)
                    {
                        this.loadPage(this.notes[0]);
                    } // end if
                } // end if

                this.delPageID = undefined;
                this.delPageTitle = undefined;
            },

            openNewDialog()
            {
                this.$refs.newPageDialog.open();
            },
            async closeNewDialog(save)
            {
                if(save)
                {
                    let page = { title: this.newPage.title, content: this.newPage.content };
                    page = await noteMan.addPage(this.notes, page);
                    this.loadPage(page);
                } // end if

                // Clear the new note
                this.newPage.title = '';
                this.newPage.content = '';

                // Go ahead and close the modal
                this.$refs.newPageDialog.close();
            },
            onNewDialogOpen()
            {
                setTimeout(() =>
                {
                    this.$refs.newCodeMirror.cm.refresh();
                }, 500);
            },

            openEditDialog()
            {
                this.editPage.id = this.currentPage.id;
                this.editPage.title = this.currentPage.title;
                this.editPage.content = this.currentPage.content;
                this.$refs.editPageDialog.open();
            },
            async closeEditDialog(save)
            {
                if(save)
                {
                    this.currentPage.title = this.editPage.title;
                    this.currentPage.content = this.editPage.content;
                    await noteMan.updatePage(this.notes, this.currentPage);
                } // end if

                // Clear the edit note
                this.editPage.id = undefined;
                this.editPage.title = '';
                this.editPage.content = '';

                // Go ahead and close the modal
                this.$refs.editPageDialog.close();
            },
            onEditDialogOpen()
            {
                setTimeout(() =>
                {
                    this.$refs.editCodeMirror.cm.refresh();
                }, 500);
            }
        },
        mounted()
        {
            this.$watch('notes', () =>
            {
                if(this.notes)
                {
                    this.loadPage(this.notes.pages[0]);
                } // end if
            });
        }
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
