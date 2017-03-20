<!--------------------------------------------------------------------------------------------------------------------->
<!-- Notes Component                                                                                                 -->
<!--------------------------------------------------------------------------------------------------------------------->

<template>
    <md-card id="notes">
        <md-toolbar>
            <h2 class="md-title" v-flex="1">Notes</h2>
            <md-button @click.native.prevent.stop="openNewDialog()">New</md-button>
            <md-button v-if="currentPageID" @click.native.prevent.stop="openEditDialog()">Edit</md-button>
        </md-toolbar>
        <md-card-content style="display: flex" v-if="currentPageID">
            <md-list v-flex="'0 1 300px'" id="note-tabs">
                <md-list-item @click.native="loadPage(page)" v-for="page in notes" :class="{ 'md-accent': page.id == currentPage.id }">
                    {{ page.title }}
                    <md-button v-if="!disabled" class="md-icon-button md-list-action md-warn"
                               @click.native.prevent.stop="confirmDelete(page)">
                        <md-icon class="md-warn">delete</md-icon>
                    </md-button>
                </md-list-item>
            </md-list>
            <note-page
                :title="currentPage.title"
                :content="currentPage.content"
                v-flex="max" style="padding-left: 16px; padding-right: 16px">
            </note-page>
        </md-card-content>
        <md-card-content v-else>
            <div class="text-center">
                <i>To add a note, click the 'new' button above.</i>
            </div>
        </md-card-content>

        <!-- Dialogs -->

        <!-- New Dialog -->
        <md-dialog id="new-note-dialog"  ref="newNoteDialog" @open="onNewDialogOpen">
            <md-dialog-title>New Character</md-dialog-title>

            <md-dialog-content>
                <md-input-container :class="{ 'md-input-invalid': !newNote.title }">
                    <label>Title</label>
                    <md-input v-model="newNote.title" required></md-input>
                    <span class="md-error">Title is required</span>
                </md-input-container>

                <label style="font-size: 12px;">Content</label>
                <div id="code-mirror-input">
                    <vue-code v-model="newNote.content" :options="codeMirror" ref="newCodeMirror"></vue-code>
                </div>
            </md-dialog-content>

            <md-dialog-actions>
                <md-button class="md-primary" @click.native="closeNewDialog()">Cancel</md-button>
                <md-button class="md-primary"
                           :class="{ 'md-raised md-accent': newNoteValid }"
                           @click.native="closeNewDialog(true)"
                           :disabled="!newNoteValid">
                    Save
                </md-button>
            </md-dialog-actions>
        </md-dialog>

        <!-- Edit Dialog -->
        <md-dialog id="edit-note-dialog"  ref="editNoteDialog" @open="onEditDialogOpen">
            <md-dialog-title>Edit Character</md-dialog-title>

            <md-dialog-content>
                <md-input-container :class="{ 'md-input-invalid': !editNote.title }">
                    <label>Title</label>
                    <md-input v-model="editNote.title" required></md-input>
                    <span class="md-error">Title is required</span>
                </md-input-container>

                <label style="font-size: 12px;">Content</label>
                <div id="code-mirror-input">
                    <vue-code v-model="editNote.content" :options="codeMirror" ref="editCodeMirror"></vue-code>
                </div>
            </md-dialog-content>

            <md-dialog-actions>
                <md-button class="md-primary" @click.native="closeEditDialog()">Cancel</md-button>
                <md-button class="md-primary"
                           :class="{ 'md-raised md-accent': editNoteValid }"
                           @click.native="closeEditDialog(true)"
                           :disabled="!editNoteValid">
                    Save
                </md-button>
            </md-dialog-actions>
        </md-dialog>

        <!-- Delete Note confirmation -->
        <md-dialog-confirm
            md-title="Delete Note"
            :md-content="`Are your sure you want to delete this note: '${ delNoteTitle }'?`"
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
    import Promise from 'bluebird';

    import { shortID } from '../../../server/utilities';

    // Codemirror component
    import VueCode from 'vue-code';
    import 'codemirror/mode/markdown/markdown';

    import NotePage from './page.vue';
    
    //------------------------------------------------------------------------------------------------------------------

    export default {
        components: {
            notePage: NotePage,
            vueCode: VueCode
        },
        props: {
            notes: {
                type: Array,
                required: true
            },
            disabled: {
                type: Boolean,
                default: false
            },
            save: {
                type: Function,
                required: true
            }
        },
        data()
        {
            return {
                currentPageID: undefined,
                delNoteTitle: '',
                delNoteID: undefined,
                newNote: {
                    content: '',
                    title: ''
                },
                editNote: {
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
                return _.find(this.notes, { id: this.currentPageID });
            },
            newNoteValid()
            {
                return !!this.newNote.title && !!this.newNote.content;
            },
            editNoteValid()
            {
                return !!this.editNote.title && !!this.editNote.content;
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
                const id = this.currentPageID;
                this.currentPageID = id;
            },

            confirmDelete(page)
            {
                this.delNoteID = page.id;
                this.delNoteTitle = page.title;
                this.$refs.deleteNoteDialog.open();
            },
            onConfirmDeleteClosed(result)
            {
                if(result == 'ok')
                {
                    _.remove(this.notes, { id: this.delNoteID });

                    // Load a new page.
                    if(this.delNoteID == this.currentPageID)
                    {
                        this.loadPage(this.notes[0]);
                    } // end if

                    this.save();
                } // end if

                this.delNoteID = undefined;
                this.delNoteTitle = undefined;
            },

            openNewDialog()
            {
                this.$refs.newNoteDialog.open();
            },
            closeNewDialog(save)
            {
                if(save)
                {
                    const note = { id: shortID(), title: this.newNote.title, content: this.newNote.content };
                    this.notes.push(note);
                    this.loadPage(note);
                    this.save();
                } // end if

                // Clear the new note
                this.newNote.title = '';
                this.newNote.content = '';

                // Go ahead and close the modal
                this.$refs.newNoteDialog.close();
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
                this.editNote.id = this.currentPage.id;
                this.editNote.title = this.currentPage.title;
                this.editNote.content = this.currentPage.content;
                this.$refs.editNoteDialog.open();
            },
            closeEditDialog(save)
            {
                if(save)
                {
                    const noteIdx = _.findIndex(this.notes, { id: this.currentPage.id });
                    this.notes.splice(noteIdx, 1, _.clone(this.editNote));
                    this.reloadPage();
                    this.save();
                } // end if

                // Clear the edit note
                this.editNote.id = undefined;
                this.editNote.title = '';
                this.editNote.content = '';

                // Go ahead and close the modal
                this.$refs.editNoteDialog.close();
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
            this.loadPage(this.notes[0]);
        }
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->