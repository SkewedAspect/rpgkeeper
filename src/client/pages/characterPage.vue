<!----------------------------------------------------------------------------------------------------------------------
  -- Character Page
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <b-container id="character-page" class="mt-2 mb-3" fluid>
        <!-- Error Handling -->
        <b-container v-if="error">
            <b-alert variant="danger" show>
                <h4>
                    <fa icon="exclamation-triangle"></fa>
                    Error loading character
                </h4>
                <div v-for="(line, index) in error.stack.split('\n')" :key="index">
                    {{ line }}
                </div>
                <div class="text-right">
                    <b-btn to="/dashboard" variant="danger">
                        <fa icon="arrow-left"></fa>
                        Back to Dashboard
                    </b-btn>
                </div>
            </b-alert>
        </b-container>

        <!-- Loading -->
        <loading v-else-if="!char"></loading>

        <!-- Main Sheet Tabs -->
        <b-tabs v-else class="main-tabs" pills>
            <template v-if="system" #tabs-start>
                <li style="position: absolute; left: 18px; padding-top: 10px;">
                    <h4 class="text-muted">
                        <span class="d-none d-md-inline">{{ system.name }}</span>
                        <fa v-if="saving" icon="save" class="flash text-success ml-2"></fa>
                    </h4>
                </li>
            </template>
            <b-tab active>
                <template #title>
                    <fa icon="file-user"></fa>
                    Sheet
                </template>

                <!-- Actual System Character Sheet -->
                <component :is="char.system" :is-authorized="isAuthorized">
                    <!-- We put a warning here, mostly for the developer. -->
                    <b-container>
                        <b-alert variant="warning" show>
                            <h4>
                                <fa icon="exclamation-triangle"></fa>
                                Unknown system "{{ char.system }}"
                            </h4>
                            <div>
                                This is an internal error, and you never be seen in normal operation. If you are a
                                developer, you done messed up. If you're a user, then please report this as a bug.
                            </div>
                            <div class="text-right">
                                <b-btn :href="`https://github.com/Morgul/rpgkeeper/issues/new?title=[Bug] Unknown system '${ char.system }'.&labels=bug`" target="_blank" variant="warning">
                                    <fa icon="bug"></fa>
                                    Report Bug
                                </b-btn>
                                <b-btn to="/dashboard" variant="warning">
                                    <fa icon="arrow-left"></fa>
                                    Back to Dashboard
                                </b-btn>
                            </div>
                        </b-alert>
                    </b-container>
                </component>
            </b-tab>
            <b-tab>
                <template #title>
                    <fa icon="book"></fa>
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
        max-width: 1200px;

        .main-tabs {
            position: relative;

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

<script lang="ts">
    //------------------------------------------------------------------------------------------------------------------

    import { defineComponent } from 'vue';
    import { mapState } from 'pinia';

    // Stores
    import { useAccountStore } from '../lib/stores/account';
    import { useSystemsStore } from '../lib/stores/systems';
    import { useCharactersStore } from '../lib/stores/characters';

    // Managers
    import charMan from '../lib/managers/character';

    // Components
    import Loading from '../components/ui/loadingWidget.vue';
    import Notes from '../components/notes/noteBook.vue';

    // Systems
    import RisusCharacter from '../components/systems/risus/risusCharacter.vue';
    import FateCharacter from '../components/systems/fate/fateCharacter.vue';
    import EoteCharacter from '../components/systems/eote/eoteCharacter.vue';
    import WfrpCharacter from '../components/systems/wfrp/wfrpCharacter.vue';

    //------------------------------------------------------------------------------------------------------------------

    export default defineComponent({
        name: 'CharacterPage',
        components: {
            Loading,
            Notes,

            // Systems
            fate: FateCharacter,
            risus: RisusCharacter,
            genesys: EoteCharacter, // This is actually correct. We use the same component for both.
            eote: EoteCharacter,
            wfrp: WfrpCharacter
        },
        data()
        {
            return {
                error: undefined
            };
        },
        computed: {
            ...mapState(useAccountStore, [ 'account' ]),
            ...mapState(useSystemsStore, {
                system: (store) => store.current
            }),
            ...mapState(useCharactersStore, {
                char: (store) => store.current,
                saving: (store) => store.saving
            }),
            isAuthorized()
            {
                return !!this.account
                    && !!this.char
                    && (this.account.id || 'nope!') === this.char.accountID;
            }
        },
        mounted()
        {
            // We always select the character that matches our route, so we handle navigation.
            charMan.select(this.$route.params.id).catch((err) => this.error = err);
        }
    });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
