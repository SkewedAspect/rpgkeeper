<!--------------------------------------------------------------------------------------------------------------------->
<!-- stunts                                                                                                         -->
<!--------------------------------------------------------------------------------------------------------------------->

<template>
    <md-card id="fate-stunts" style="flex: 1">
        <md-toolbar class="md-dense">
            <h2 style="flex: 1" class="md-title">Stunts</h2>
            <md-button @click="openEdit()">Edit</md-button>
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
                Stunts go here.
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
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script>
    //------------------------------------------------------------------------------------------------------------------
    
    import marked from 'marked';
    
    //------------------------------------------------------------------------------------------------------------------

    export default {
        props: {
            stunts: {
                type: Array,
                required: true
            }
        },
        methods: {
            renderStunt(stunt)
            {
                const content = `**${ stunt.title }**: ${ stunt.description }`;
                return marked(content);
            },
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