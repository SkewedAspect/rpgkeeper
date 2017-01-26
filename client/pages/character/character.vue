<!--------------------------------------------------------------------------------------------------------------------->
<!-- character.vue                                                                                                         -->
<!--------------------------------------------------------------------------------------------------------------------->

<template>
    <div id="character-page">
        <component v-if="loaded" :is="character.system.id" :character="character"></component>
        <div class="loading container text-center"v-else>
            <loader></loader>
        </div>
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style rel="stylesheet/scss" lang="sass">
    #character-page {
        .loading {
            margin: 16px;
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script>
    //------------------------------------------------------------------------------------------------------------------

    import charSvc from '../../services/character';
    import spinkit from '../../components/spinkit';

    // Systems
    import RisusCharacter from '../../../systems/risus/client/character.vue';

    //------------------------------------------------------------------------------------------------------------------

    export default {
        name: "character-page",
        components: {
            loader: spinkit.wave,

            // Systems
            risus: RisusCharacter
        },
        data()
        {
            return {
                loaded: false,
                character: undefined
            };
        },
        mounted()
        {
            this.loading = charSvc.get(this.$route.params.id)
                .then((character) =>
                {
                    this.character = character;
                    return character.populateSystem()
                        .then(() => { this.loaded = true; });
                });
        }
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->