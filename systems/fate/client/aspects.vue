<!--------------------------------------------------------------------------------------------------------------------->
<!-- aspects                                                                                                         -->
<!--------------------------------------------------------------------------------------------------------------------->

<template>
    <md-card id="fate-aspects" style="flex: 1">
        <md-toolbar class="md-dense">
            <h2 style="flex: 1" class="md-title">Aspects</h2>
            <md-button @click="openEdit()">Edit</md-button>
        </md-toolbar>

        <table class="md-static-table">
            <tr>
                <td style="width: 1%"><b>HC:</b></td>
                <td>{{ highConcept.detail }}</td>
            </tr>
            <tr>
                <td style="width: 1%"><b>TR:</b></td>
                <td>{{ trouble.detail }}</td>
            </tr>
            <tr v-for="aspect in extraAspects">
                <td style="width: 1%" class="no-sides"></td>
                <td class="no-sides">{{ aspect.detail }}</td>
            </tr>
        </table>

        <!-- Edit Dialog -->
        <md-dialog ref="editDialog" id="edit-aspect-modal">
            <md-dialog-title>Edit Aspects</md-dialog-title>
            <md-dialog-content>
                <md-input-container md-clearable>
                    <label>High Concept</label>
                    <md-input v-model="highConceptEdit.detail"></md-input>
                </md-input-container>
                <md-input-container md-clearable>
                    <label>Trouble</label>
                    <md-input v-model="troubleEdit.detail"></md-input>
                </md-input-container>

                <md-input-container md-clearable v-for="aspect in extraAspectsEdit" :key="aspect.id">
                    <label>Aspect</label>
                    <md-input v-model="aspect.detail"></md-input>
                </md-input-container>

                <md-card v-flex="1">
                    <md-card-content>
                        <md-layout md-gutter="16">
                            <md-layout v-flex="grow">
                                <md-input-container md-clearable>
                                    <label>Aspect</label>
                                    <md-input v-model="newAspect.detail"></md-input>
                                </md-input-container>
                            </md-layout>
                            <md-layout v-flex="shrink">
                                <div style="padding-top: 10px;">
                                    <md-button class="md-raised" @click="addNew()">
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
    #fate-aspects {
        table {
            tr:last-child {
                td {
                    border-bottom-width: 1px;
                }
            }
        }
    }

    #edit-aspect-modal {
        .md-dialog {
            min-width: 60%;
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script>
    //------------------------------------------------------------------------------------------------------------------

    import _ from 'lodash';

    // Pull in the shortID utility
    import { shortID } from '../../../server/utilities';

    //------------------------------------------------------------------------------------------------------------------

    export default {
        props: {
            aspects: {
                type: Array,
                required: true
            }
        },
        computed: {
            highConcept(){ return _.find(this.aspects, { type: 'high concept' }) || { detail: '' }; },
            trouble(){ return _.find(this.aspects, { type: 'trouble' }) || { detail: '' }; },
            extraAspects(){ return _.filter(this.aspects, { type: 'aspect' }); }
        },
        methods: {
            addOrUpdateAspect(aspect, type='aspect')
            {
                if(aspect.id)
                {
                    const originalAspect = _.find(this.aspects, { id: aspect.id });
                    originalAspect.detail = aspect.detail;
                }
                else
                {
                    this.aspects.push({ id: shortID(), detail: aspect.detail, type });
                } // end if
            },
            removeAspect(aspect)
            {
                const aspectIndex = _.findIndex(this.aspects, { id: aspect.id });
                if(aspectIndex !== -1)
                {
                    this.aspects.splice(aspectIndex, 1);
                } // end if
            },

            addNew()
            {
                if(this.newAspect.detail)
                {
                    this.extraAspectsEdit.push({ detail: this.newAspect.detail, type: 'aspect' });
                    this.newAspect.detail = '';
                } // end if
            },
            openEdit()
            {
                this.highConceptEdit =_.cloneDeep( this.highConcept);
                this.troubleEdit = _.cloneDeep(this.trouble);
                this.extraAspectsEdit = _.cloneDeep(this.extraAspects);

                // Open the dialog
                this.$refs.editDialog.open();
            },
            closeEdit(save)
            {
                if(save)
                {
                    this.addOrUpdateAspect(this.highConceptEdit, 'high concept');
                    this.addOrUpdateAspect(this.troubleEdit, 'trouble');

                    _.each(this.extraAspectsEdit, (aspect) =>
                    {
                        if(aspect.detail)
                        {
                            this.addOrUpdateAspect(aspect);
                        }
                        else
                        {
                            this.removeAspect(aspect);
                        } // end if
                    });

                } // end if

                this.highConceptEdit =_.cloneDeep( this.highConcept);
                this.troubleEdit = _.cloneDeep(this.trouble);
                this.extraAspectsEdit = _.cloneDeep(this.extraAspects);

                // Close the dialog
                this.$refs.editDialog.close();
            }
        },
        data()
        {
            return {
                highConceptEdit: '',
                troubleEdit: '',
                extraAspectsEdit: [],
                newAspect: {
                    type: 'aspect',
                    detail: ''
                }
            };
        }
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->