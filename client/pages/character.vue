<!--------------------------------------------------------------------------------------------------------------------->
<!-- character.vue                                                                                                         -->
<!--------------------------------------------------------------------------------------------------------------------->

<template>
    <div id="character-page">
        <md-tabs v-if="!error && baseChar" class="md-transparent" md-right>
            <!-- TODO: Add support for dynamic tabs. -->
            <md-tab md-label="Sheet">
                <component :is="baseChar.system">
                    <md-card class="md-warn" style="flex: 1">
                        <md-card-header>
                            <div class="md-title">Unknown System '{{ baseChar.system }}'.</div>
                        </md-card-header>

                        <md-card-content>
                            This is an internal error, and you never be seen in normal operation. If you are a
                            developer, you done messed up. If you're a user, then please report this as a bug.
                        </md-card-content>

                        <md-card-actions>
                            <md-button @click="newTab('https://github.com/Morgul/rpgkeeper/issues/new')">Report Issue</md-button>
                            <md-button @click="goTo('/dashboard')">Back to Dashboard</md-button>
                        </md-card-actions>
                    </md-card>
                </component>
            </md-tab>
            <md-tab md-label="Notes">
                <notes :disabled="!isAuthorized"></notes>
            </md-tab>
        </md-tabs>
        <div class="loading container text-center" v-else>
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
                    <md-button @click="newTab('https://github.com/Morgul/rpgkeeper/issues/new')">Report Issue</md-button>
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

    import _ from 'lodash';

    // Managers
    import authMan from '../api/managers/auth';
    import charMan from '../api/managers/character';

    // Components
    import NotesComponent from '../components/notes/notes.vue';

    // Systems
    import RisusCharacter from '../../systems/risus/client/character.vue';
    import FateCharacter from '../../systems/fate/client/character.vue';
    import EoteCharacter from '../../systems/eote/client/character.vue';

    //------------------------------------------------------------------------------------------------------------------

    export default {
        name: "character-page",
        components: {
            notes: NotesComponent,

            // Systems
            fate: FateCharacter,
            risus: RisusCharacter,
            eote: EoteCharacter
        },
        subscriptions: {
            account: authMan.account$,
            baseChar: charMan.selected$
        },
        computed: {
            isAuthorized(){ return _.get(this.account, 'id', 'nope!') === this.baseChar.account_id; }
        },
        methods: {
            goTo(path){ this.$router.push(path); },
            newTab(url){ window.open(url, '_blank'); }
        },
        data()
        {
            return {
                error: undefined
            };
        },
        created()
        {
            // Watch for changes to the baseChar, and save.
            this.$watch('baseChar', (char, oldChar) =>
            {
                if(!_.isUndefined(oldChar) && char && char.dirty)
                {
                    charMan.save(char);
                } // end char
            }, { deep: true });
        },
        mounted()
        {
            // We always select the character that matches our route, so we handle navigation.
            charMan.select(this.$route.params.id)
                .catch((e) => this.error = e);
        }
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
