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
        <md-dialog ref="editDialog">
            <md-dialog-title>Edit Aspects</md-dialog-title>
            <md-dialog-content>
                Aspects go here.
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
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script>
    //------------------------------------------------------------------------------------------------------------------

    import _ from 'lodash';

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
            openEdit()
            {
                // Open the dialog
                this.$refs.editDialog.open();
            },
            closeEdit(save)
            {
                if(save)
                {
                    // Save here...
                } // end if

                // Close the dialog
                this.$refs.editDialog.close();
            }
        },
        data()
        {
            return {
                // Data goes here
            };
        }
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->