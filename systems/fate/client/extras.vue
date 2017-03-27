<!--------------------------------------------------------------------------------------------------------------------->
<!-- extras                                                                                                         -->
<!--------------------------------------------------------------------------------------------------------------------->

<template>
    <md-card id="fate-extras" style="flex: 1">
        <md-toolbar class="md-dense">
            <h2 style="flex: 1" class="md-title">Extras</h2>
            <md-button>Edit</md-button>
        </md-toolbar>

        <md-card-content v-if="extras" v-html="renderedContent"></md-card-content>
        <md-card-content class="text-center" v-else>
            <h4>No extras...</h4>
        </md-card-content>
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
        }
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->