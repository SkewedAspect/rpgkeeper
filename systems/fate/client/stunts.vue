<!--------------------------------------------------------------------------------------------------------------------->
<!-- stunts                                                                                                         -->
<!--------------------------------------------------------------------------------------------------------------------->

<template>
    <md-card id="fate-stunts" style="flex: 1">
        <md-toolbar class="md-dense">
            <h2 style="flex: 1" class="md-title">Stunts</h2>
            <md-button>Edit</md-button>
        </md-toolbar>

        <md-card-content v-if="stunts">
            <div class="stunt" v-for="stunt in stunts" v-html="renderStunt(stunt)"></div>
        </md-card-content>
        <md-card-content class="text-center" v-else>
            <h4>No stunts...</h4>
        </md-card-content>
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
            }
        }
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->