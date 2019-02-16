<!----------------------------------------------------------------------------------------------------------------------
  -- Character Page
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <b-container id="character-page" class="mt-2">

        <!-- Error Handling -->
        <b-container v-if="error">
            <b-alert variant="danger" show>
                <h4>
                    <font-awesome-icon icon="exclamation-triangle"></font-awesome-icon>
                    Error loading character
                </h4>
                <div v-for="line in error.stack.split('\n')">{{ line }}</div>
                <div class="text-right">
                    <b-btn to="/dashboard" variant="danger">
                        <font-awesome-icon icon="arrow-left"></font-awesome-icon>
                        Back to Dashboard
                    </b-btn>
                </div>
            </b-alert>
        </b-container>

        <!-- Loading -->
        <loading v-else-if="!char"></loading>

        <!-- Main Sheet Tabs -->
        <b-tabs v-else class="main-tabs" pills>
            <b-tab active>
                <template slot="title">
                    <font-awesome-icon icon="file-user"></font-awesome-icon>
                    Sheet
                </template>

                <!-- Actual System Character Sheet -->
                <component :is="char.system">

                    <!-- We put a warning here, mostly for the developer. -->
                    <b-container>
                        <b-alert variant="warning" show>
                            <h4>
                                <font-awesome-icon icon="exclamation-triangle"></font-awesome-icon>
                                Unknown system "{{ char.system }}"
                            </h4>
                            <div>
                                This is an internal error, and you never be seen in normal operation. If you are a
                                developer, you done messed up. If you're a user, then please report this as a bug.
                            </div>
                            <div class="text-right">
                                <b-btn :href="`https://github.com/Morgul/rpgkeeper/issues/new?title=[Bug] Unknown system '${ char.system }'.&labels=bug`" target="_blank" variant="warning">
                                    <font-awesome-icon icon="bug"></font-awesome-icon>
                                    Report Bug
                                </b-btn>
                                <b-btn to="/dashboard" variant="warning">
                                    <font-awesome-icon icon="arrow-left"></font-awesome-icon>
                                    Back to Dashboard
                                </b-btn>
                            </div>
                        </b-alert>
                    </b-container>
                </component>
            </b-tab>
            <b-tab>
                <template slot="title">
                    <font-awesome-icon icon="book"></font-awesome-icon>
                    Notes
                </template>

                <notes></notes>
            </b-tab>
        </b-tabs>
    </b-container>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss">
    #character-page {
        .main-tabs {
            .nav.nav-pills {
                float: right;
            }

            .tab-content {
                clear: both;
                padding-top: 0.5rem;
            }
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script>
    //------------------------------------------------------------------------------------------------------------------

    import _ from 'lodash';

    // Managers
    import charMan from '../api/managers/character';

    // Components
    import Loading from '../components/ui/loading.vue';
    import Notes from '../components/notes/notes.vue';

    // Systems
    import RisusCharacter from '../../systems/risus/client/character.vue';
    import FateCharacter from '../../systems/fate/client/character.vue';
    import EoteCharacter from '../../systems/eote/client/character.vue';

    //------------------------------------------------------------------------------------------------------------------

    export default {
        name: "character-page",
        components: {
            Loading,
            Notes,

            // Systems
            fate: FateCharacter,
            risus: RisusCharacter,
            eote: EoteCharacter
        },
        subscriptions: {
            char: charMan.selected$
        },
        data()
        {
            return {
                error: undefined
            };
        },
        mounted()
        {
            // We always select the character that matches our route, so we handle navigation.
            charMan.select(this.$route.params.id).catch((e) => this.error = e);
        }
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
