<!--------------------------------------------------------------------------------------------------------------------->
<!-- stunts                                                                                                         -->
<!--------------------------------------------------------------------------------------------------------------------->

<template>
    <md-card id="fate-stunts" style="flex: 1">
        <md-toolbar class="md-dense">
            <h2 style="flex: 1" class="md-title">Stunts</h2>
            <md-button v-if="isAuthorized" @click="openEdit()">Edit</md-button>
        </md-toolbar>

        <md-card-content v-if="stunts">
            <div class="stunt" v-for="stunt in stunts" v-html="renderStunt(stunt)"></div>
        </md-card-content>
        <md-card-content class="text-center" v-else>
            <h4>No stunts...</h4>
        </md-card-content>

        <!-- Edit Dialog -->
        <md-dialog ref="editDialog">
            <md-dialog-title>Edit Stunts</md-dialog-title>
            <md-dialog-content>
                <md-card v-flex="1">
                    <md-list class="stunt-edit-list md-double-line">
                        <md-list-item v-for="stunt in stuntsEdit" :key="stunt.id">
                            <div class="md-list-text-container" v-flex="1">
                                <span><b>{{ stunt.title }}</b></span>
                                <span v-html="renderStuntDescription(stunt)"></span>
                            </div>
                            <md-button class="md-icon-button md-list-action" style="margin-right: 0" @click="removeStuntEdit(stunt)">
                                <md-icon class="md-warn">delete</md-icon>
                            </md-button>
                            <md-list-expand>
                                <md-card v-flex="1">
                                    <md-card-content>
                                        <md-input-container>
                                            <label>Title</label>
                                            <md-input v-model="stunt.title" required></md-input>
                                        </md-input-container>
                                        <md-input-container>
                                            <label>Description</label>
                                            <md-textarea v-model="stunt.description"></md-textarea>
                                        </md-input-container>
                                    </md-card-content>
                                </md-card>
                            </md-list-expand>
                        </md-list-item>
                    </md-list>
                </md-card>
                <md-card v-flex="1" style="margin-top: 10px;">
                    <md-card-content>
                        <md-layout md-gutter="8">
                            <md-layout md-flex="100">
                                <md-input-container>
                                    <label>Name</label>
                                    <md-input v-model="newStuntName"></md-input>
                                </md-input-container>
                            </md-layout>
                            <md-layout>
                                <md-input-container>
                                    <label>Description</label>
                                    <md-input v-model="newStuntDesc"></md-input>
                                </md-input-container>
                            </md-layout>
                            <md-layout v-flex="'shrink'">
                                <div style="padding-top: 10px;">
                                    <md-button class="md-raised" @click="addNew()" :disabled="!newStuntName || !newStuntDesc">
                                        Add
                                    </md-button>
                                </div>
                            </md-layout>
                        </md-layout>
                    </md-card-content>
                </md-card>
            </md-dialog-content>

            <md-dialog-actions>
                <md-button class="md-primary" @click.native="closeEdit()">Cancel</md-button>
                <md-button class="md-accent" @click.native="closeEdit(true)">Save</md-button>
            </md-dialog-actions>
        </md-dialog>
    </md-card>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss">
    #fate-stunts {
        .md-card-content {
            & > p:first-child {
                margin-top: 0;
            }

            & > p:last-child {
                margin-bottom: 0;
            }
        }
    }

    .stunt-edit-list {
        padding: 0;

        .md-list-text-container {
            span:nth-child(2)
            {
                line-height: 0.4rem;
            }
        }

        .md-card-content > .md-input-container:last-child {
            margin-bottom: 0;
        }

        @media(min-width: 768px)
        {
            min-width: 500px;
        }

        @media(min-width: 1200px)
        {
            min-width: 900px;
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script>
    //------------------------------------------------------------------------------------------------------------------

    import _ from 'lodash';
    import marked from 'marked';

    // Pull in the shortID utility
    import { shortID } from '../../../server/utils/misc';

    //------------------------------------------------------------------------------------------------------------------

    export default {
        props: {
            stunts: {
                type: Array,
                required: true
            },
            isAuthorized: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            addNew()
            {
                this.stuntsEdit.push({ title: this.newStuntName, description: this.newStuntDesc });
                this.newStuntName = "";
                this.newStuntDesc = "";
            },
            addOrUpdateStunt(stunt)
            {
                if(stunt.id)
                {
                    const originalStunt = _.find(this.stunts, { id: stunt.id });
                    originalStunt.title = stunt.title;
                    originalStunt.description = stunt.description;
                }
                else
                {
                    this.stunts.push({ id: shortID(), title: stunt.title, description: stunt.description });
                } // end if
            },
            removeStuntEdit(stunt)
            {
                const stuntIndex = _.findIndex(this.stuntsEdit, { id: stunt.id });
                if(stuntIndex !== -1)
                {
                    this.stuntsEdit.splice(stuntIndex, 1);
                } // end if
            },
            removeStunt(stunt)
            {
                const stuntIndex = _.findIndex(this.stunts, { id: stunt.id });
                if(stuntIndex !== -1)
                {
                    this.stunts.splice(stuntIndex, 1);
                } // end if
            },
            renderStunt(stunt)
            {
                const content = `**${ stunt.title }**: ${ stunt.description }`;
                return marked(content);
            },
            renderStuntDescription(stunt)
            {
                return marked(stunt.description);
            },
            openEdit()
            {
                this.stuntsEdit = _.cloneDeep(this.stunts);

                // Open the dialog
                this.$refs.editDialog.open();
            },
            closeEdit(save)
            {
                if(save)
                {
                    // Find any stunts that are missing from stuntsEdit
                    const toRemove = [];
                    _.each(this.stunts, (stunt) =>
                    {
                        if(!_.find(this.stuntsEdit, { id: stunt.id }))
                        {
                            toRemove.push(stunt);
                        } // end if
                    });

                    // Remove those stunts; they've been deleted
                    _.each(toRemove, (stunt) => this.removeStunt(stunt));

                    // Add/Update stunts from stuntsEdit
                    _.each(this.stuntsEdit, (stunt) =>
                    {
                        this.addOrUpdateStunt(stunt);
                    });
                } // end if

                this.stuntsEdit = _.cloneDeep(this.stunts);

                // Close the dialog
                this.$refs.editDialog.close();
            }
        },
        data()
        {
            return {
                stuntsEdit: [],
                newStuntName: "",
                newStuntDesc: ""
            }
        }
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
