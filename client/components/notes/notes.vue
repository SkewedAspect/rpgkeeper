<!--------------------------------------------------------------------------------------------------------------------->
<!-- Notes Component                                                                                                 -->
<!--------------------------------------------------------------------------------------------------------------------->

<template>
    <md-card id="notes">
        <md-toolbar>
            <h2 class="md-title" v-flex="1">Notes</h2>
            <md-button v-if="!disabled" @click.prevent.stop="openNewDialog()">New</md-button>
            <md-button v-if="!disabled && currentPageID" @click.prevent.stop="openEditDialog()">Edit</md-button>
        </md-toolbar>
        <md-card-content class="hidden-sm-up" style="padding-top: 0; padding-bottom: 0">
            <md-input-container style="margin-bottom: 5px; padding-top: 0; min-height: 32px">
                <md-select name="page" id="page" v-model="currentPageID">
                    <md-option :value="page.id" v-for="page in notes">{{ page.title }}</md-option>
                </md-select>
            </md-input-container>
        </md-card-content>
        <md-card-content style="display: flex" v-if="currentPageID">
            <md-list v-flex="'0 1 300px'" id="note-tabs" class="hidden-sm-down">
                <md-list-item @click="loadPage(page)" v-for="page in notes" :class="{ 'md-accent': page.id == currentPage.id }">
                    {{ page.title }}
                    <md-button v-if="!disabled" class="md-icon-button md-list-action md-warn"
                               @click.prevent.stop="confirmDelete(page)">
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
                <md-button class="md-primary" @click="closeNewDialog()">Cancel</md-button>
                <md-button class="md-primary"
                           :class="{ 'md-raised md-accent': newNoteValid }"
                           @click="closeNewDialog(true)"
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
                <md-button class="md-primary" @click="closeEditDialog()">Cancel</md-button>
                <md-button class="md-primary"
                           :class="{ 'md-raised md-accent': editNoteValid }"
                           @click="closeEditDialog(true)"
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

    // Managers
    import charMan from '../../api/managers/character';

    // Codemirror component
    import VueCode from 'vue-code';
    import 'codemirror/mode/markdown/markdown';

    // Components
    import NotePage from './page.vue';
    
    //------------------------------------------------------------------------------------------------------------------

    export default {
        components: {
            notePage: NotePage,
            vueCode: VueCode
        },
        props: {
            disabled: {
                type: Boolean,
                default: false
            }
        },
        subscriptions: {
            character: charMan.selected$
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
            notes(){ return this.character.notes; },
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
                if(result === 'ok')
                {
                    const idx = _.findIndex(this.notes, { id: this.delNoteID });
                    this.notes.splice(idx, 1);

                    // Load a new page.
                    if(this.delNoteID === this.currentPageID)
                    {
                        this.loadPage(this.notes[0]);
                    } // end if
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