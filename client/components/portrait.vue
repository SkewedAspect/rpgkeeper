<!--------------------------------------------------------------------------------------------------------------------->
<!-- portrait                                                                                                         -->
<!--------------------------------------------------------------------------------------------------------------------->

<template>
    <md-card id="portrait">
        <md-image :md-src="url"></md-image>
    </md-card>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss" scoped>
    #portrait {
        flex: 0 1 auto;
        min-width: 100px;
        min-height: 150px;
        max-width: 150px;
        overflow: hidden;

        @media(min-width: 600px)
        {
            max-width: 200px;
        }

        @media(min-width: 960px)
        {
            max-width: 300px;
        }

        .md-image {
            margin: 4px;
        }

        &.small {
            min-width: 100px;
            width: 80px;
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script>
    //------------------------------------------------------------------------------------------------------------------
    
    export default {
        props: {
            src: {
                type: String,
                default: "/static/images/portraitPlaceholder.png"
            }
        },
        computed: {
            url(){ return this.src || "/static/images/portraitPlaceholder.png"; }
        }
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->