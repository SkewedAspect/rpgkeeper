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
                <div id="code-mirror-input">
                    <vue-code v-model="extrasEdit" :options="codeMirror" ref="editCodeMirror"></vue-code>
                </div>
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
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script>
    //------------------------------------------------------------------------------------------------------------------
    
    import marked from 'marked';

    // Codemirror component
    import VueCode from 'vue-code';
    import 'codemirror/mode/markdown/markdown';

    //------------------------------------------------------------------------------------------------------------------

    export default {
        model: {
            prop: 'extras',
            event: 'change'
        },
        props: {
            extras: {
                type: String,
                required: true
            }
        },
        components: {
            VueCode
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
                this.extrasEdit = this.extras;

                // Open the dialog
                this.$refs.editDialog.open();
            },
            closeEdit(save)
            {
                if(save)
                {
                    // Let v-model know we changed things
                    this.$emit('change', this.extrasEdit);
                } // end if

                this.extrasEdit = this.extras;

                // Close the dialog
                this.$refs.editDialog.close();
            }
        },
        data()
        {
            return {
                extrasEdit: "",
                codeMirror: {
                    lineWrapping: true,
                    mode: 'markdown'
                }
            };
        }
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->