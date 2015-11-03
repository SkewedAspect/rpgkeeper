<template>
    <div id="notes" class="card">
        <div class="card-header">
            <button class="btn btn-primary pull-right" @click="newNote()">
                <i class="fa fa-plus"></i>
                New Page
            </button>
            <i class="fa fa-file-text-o"></i>
            Notes
        </div>
        <tabs v-ref:notes :orientation="'left'">
            <tab v-for="note in notes" :header="tabName(note)">
                <div class="btn-toolbar pull-right">
                    <button v-if="note.editing" class="btn btn-sm btn-success" @click="saveNote(note)">
                        <i class="fa fa-save"></i>
                        Save
                    </button>
                    <button v-if="!note.editing" class="btn btn-sm btn-secondary" @click="edit(note)">
                        <i class="fa fa-edit"></i>
                        Edit
                    </button>
                    <button v-if="note.editing" class="btn btn-sm btn-secondary" @click="cancel(note)">
                        <i class="fa fa-times"></i>
                        Cancel
                    </button>
                    <button v-if="!note.editing" class="btn btn-sm btn-danger" @click="deleteNote(note)">
                        <i class="fa fa-trash-o"></i>
                        Delete
                    </button>
                </div>
                <form v-if="note.editing">
                    <h2><i class="fa fa-edit"></i> Editing Page</h2>
                    <fieldset class="form-group">
                        <label for="name">Name</label>
                        <input id="name" class="form-control" type="text" v-model="note.clone.name">
                    </fieldset>
                    <fieldset class="form-group">
                        <label for="content">Content</label>
                        <textarea id="content" class="form-control monospace" rows="20" v-model="note.clone.content"></textarea>
                        <div class="text-right">
                            <small class="text-muted">
                                You may use HTML or <a href="https://help.github.com/articles/markdown-basics/">markdown</a> formatting.
                            </small>
                        </div>
                    </fieldset>
                </form>
                <div v-if="!note.editing">
                    {{{ note.content | markdown }}}
                </div>
            </tab>
        </tabs>
    </div>
</template>

<style lang="sass">
    #notes {
        .card-header {
            > button {
                margin-top: -7px;
              }
        }
    }
</style>

<script type="text/babel">
    import _ from 'lodash';
    import marked from 'marked';
    import { tabset, tab } from 'vueboot';

    export default {
        components: {
            tabs: tabset,
            tab: tab
        },
        props: {
            notes: {
                type: Array,
                required: true
            },
            save: {
                type: Function,
                required: true
            }
        },
        data: function()
        {
            return {};
        },
        methods: {
            tabName: function(note)
            {
                return '<i class="fa fa-file-text-o"></i> ' + note.name + (note.editing ? ' <span>*</span>' : '');
            },
            edit: function(note)
            {
                note.editing = true;
                note.clone = _.clone(_.omit(note, 'clone'));
            },
            deleteNote: function(note)
            {
                this.$refs.notes.activateTab(this.notes.length - 2);
                this.notes.$remove(note);
                this.save();
            },
            cancel: function(note)
            {
                note.editing = false;
                note.clone = {};
            },
            saveNote: function(note)
            {
                note.name = note.clone.name;
                note.content = note.clone.content;
                note.editing = false;
                note.clone = {};

                this.save();
            },
            newNote: function()
            {
                this.notes.push({
                    name: "New Page",
                    content: "",
                    editing: true,
                    clone: {
                        name: "",
                        content: ""
                    }
                });

                // Wait for the next tick, so we can be sure the tab's been added.
                this.$nextTick(() => {
                    this.$refs.notes.activateTab(this.notes.length - 1);
                });
            }
        },
        filters: {
            markdown: marked,
        },
        ready: function()
        {
            // Pre-populate note with a editing and clone field
            this.notes.forEach((note, index) =>
            {
                this.$set('notes[' + index + '].editing', false);
                this.$set('notes[' + index + '].clone', {});
            });
        }
    }
</script>