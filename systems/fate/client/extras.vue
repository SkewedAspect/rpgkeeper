<!--------------------------------------------------------------------------------------------------------------------->
<!-- extras                                                                                                         -->
<!--------------------------------------------------------------------------------------------------------------------->

<template>
    <md-card id="fate-extras" style="flex: 1">
        <md-toolbar class="md-dense">
            <h2 style="flex: 1" class="md-title">Extras</h2>
            <md-button @click="openEdit()">Edit</md-button>
        </md-toolbar>

        <md-card-content v-if="extras" v-html="renderedContent"></md-card-content>
        <md-card-content class="text-center" v-else>
            <h4>No extras...</h4>
        </md-card-content>

        <!-- Edit Dialog -->
        <md-dialog ref="editDialog">
            <md-dialog-title>Edit Extras</md-dialog-title>
            <md-dialog-content>
                Extras go here.
            </md-dialog-content>

            <md-dialog-actions>
                <md-button class="md-primary" @click.native="closeEdit()">Cancel</md-button>
                <md-button class="md-accent" @click.native="closeEdit(true)">Save</md-button>
            </md-dialog-actions>
        </md-dialog>
    </md-card>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss" scoped>
    #fate-extras {
        .md-card-content {
            & > p:first-child {
                margin-top: 0;
            }

            & > p:last-child {
                margin-bottom: 0;
            }
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script>
    //------------------------------------------------------------------------------------------------------------------
    
    import marked from 'marked';
    
    //------------------------------------------------------------------------------------------------------------------

    export default {
        props: {
            extras: {
                type: String,
                required: true
            }
        },
        computed: {
            renderedContent()
            {
                return marked(this.extras);
            }
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
        }
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->