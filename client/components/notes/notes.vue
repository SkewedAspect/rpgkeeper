<!--------------------------------------------------------------------------------------------------------------------->
<!-- notes.vue                                                                                                         -->
<!--------------------------------------------------------------------------------------------------------------------->

<template>
    <md-card id="notes">
        <md-toolbar>
            <h2 class="md-title" v-flex="1">Notes</h2>
            <md-button @click.native.prevent.stop="openNewDialog()">New</md-button>
            <md-button v-if="currentPage.title">Edit</md-button>
        </md-toolbar>
        <md-card-content style="display: flex" v-if="currentPage.content">
            <md-list v-flex="'0 1 300px'" id="note-tabs">
                <md-list-item @click.native="loadPage(page)" v-for="page in notes" :class="{ 'md-accent': page.title == currentPage.title }">
                    {{ page.title }}
                    <md-button v-if="!disabled" class="md-icon-button md-list-action md-warn"
                               @click.native.prevent.stop="confirmDelete(page.title)">
                        <md-icon class="md-warn">delete</md-icon>
                    </md-button>
                </md-list-item>
            </md-list>
            <note-page
                :title="currentPage.title"
                :content="currentPage.content"
                :save="save"
                v-flex="max" style="padding-left: 16px; padding-right: 16px">
            </note-page>
        </md-card-content>
        <md-card-content v-else>
            <div class="text-center">
                <i>To add a note, click the 'new' button above.</i>
            </div>
        </md-card-content>

        <!-- Dialogs -->
        <md-dialog id="new-note-dialog"  ref="newNoteDialog">
            <md-dialog-title>New Character</md-dialog-title>

            <md-dialog-content>
                <md-input-container :class="{ 'md-input-invalid': !newNote.title }">
                    <label>Title</label>
                    <md-input v-model="newNote.title" required></md-input>
                    <span class="md-error">Title is required</span>
                </md-input-container>

                <label>Content</label>
                <div id="code-mirror-input">
                    <vue-code v-model="newNote.content" :options="codeMirror"></vue-code>
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

        <!-- Delete Note confirmation -->
        <md-dialog-confirm
            md-title="Delete Note"
            :md-content="`Are your sure you want to delete this note: '${ delNote }'?`"
            md-ok-text="Delete"
            md-cancel-text="Cancel"
            @close="onConfirmDeleteClosed"
            ref="deleteNoteDialog">
        </md-dialog-confirm>

    </md-card>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style rel="stylesheet/scss" lang="sass">
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
                default: () => Promise.resolve()
            }
        },
        data()
        {
            return {
                currentPage: {
                    content: '',
                    title: ''
                },
                newNote: {
                    content: '',
                    title: ''
                },
                delNote: '',
                codeMirror: {
                    mode: 'markdown'
                }
            };
        },
        computed: {
            newNoteValid()
            {
                return !!this.newNote.title && !!this.newNote.content;
            }
        },
        methods: {
            loadPage(page)
            {
                if(page)
                {
                    this.currentPage.title = page.title;
                    this.currentPage.content = page.content;
                } // end if
            },

            confirmDelete(title)
            {
                this.delNote = title;
                this.$refs.deleteNoteDialog.open();
            },
            onConfirmDeleteClosed(result)
            {
                let delPromise = Promise.resolve();
                if(result == 'ok')
                {
                    _.remove(this.notes, { title: this.delNote });
                    delPromise = this.save();
                } // end if

                return delPromise.then(() =>
                {
                    this.delNote = undefined;
                });
            },

            openNewDialog()
            {
                this.$refs.newNoteDialog.open();
            },
            closeNewDialog(save)
            {
                let savePromise = Promise.resolve();
                let note;
                if(save)
                {
                    note = { title: this.newNote.title, content: this.newNote.content };
                    this.notes.push(note);
                    this.newNote.title = '';
                    this.newNote.content = '';

                    // We don't care about waiting on the promise, we're done here.
                    savePromise = this.save();
                } // end if

                // Go ahead and close the modal
                this.$refs.newNoteDialog.close();

                // And now we load the newly created note, if we created one.
                savePromise.then(() =>
                {
                    if(note)
                    {
                        this.loadPage(note);
                    } // end if
                });
            }
        },
        mounted()
        {
            this.loadPage(this.notes[0]);
        }
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->