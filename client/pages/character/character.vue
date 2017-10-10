<!--------------------------------------------------------------------------------------------------------------------->
<!-- character.vue                                                                                                         -->
<!--------------------------------------------------------------------------------------------------------------------->

<template>
    <div id="character-page">
        <component v-if="!error && loaded" :is="character.system.id" :character="character"></component>
        <div class="loading container text-center"v-else-if="!loaded">
            <h4 class="text-center">Loading...</h4>
            <md-progress class="md-accent" md-indeterminate></md-progress>
        </div>
        <div v-if="error" class="container" style="margin: 16px">
            <md-card class="md-warn" style="flex: 1">
                <md-card-header>
                    <div class="md-title">Error loading character</div>
                </md-card-header>

                <md-card-content>
                    {{ error.stack }}
                </md-card-content>

                <md-card-actions>
                    <md-button @click="goTo('/dashboard')">Go to Dashboard</md-button>
                </md-card-actions>
            </md-card>
        </div>
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss">
    #character-page {
        .loading {
            margin-top: 16px;
            margin-bottom: 16px;
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script>
    //------------------------------------------------------------------------------------------------------------------

    import charSvc from '../../services/character';

    // Systems
//    import GenericCharacter from '../../../systems/generic/client/character.vue';
    import RisusCharacter from '../../../systems/risus/client/character.vue';
    import FateCharacter from '../../../systems/fate/client/character.vue';
    import EoteCharacter from '../../../systems/eote/client/character.vue';

    //------------------------------------------------------------------------------------------------------------------

    export default {
        name: "character-page",
        components: {

            // Systems
//            generic: GenericCharacter,
            fate: FateCharacter,
            risus: RisusCharacter,
            eote: EoteCharacter
        },
        data()
        {
            return {
                loaded: false,
                error: undefined,
                character: undefined
            };
        },
        methods: {
            goTo(path)
            {
                this.$router.push(path);
            }
        },
        mounted()
        {
            this.loading = charSvc.get(this.$route.params.id)
                .then((character) =>
                {
                    this.character = character;
                    return character.populateSystem()
                        .then(() => { this.loaded = true; });
                })
                .catch((error) =>
                {
                    this.loaded = true;
                    this.error = error;
                });
        }
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->