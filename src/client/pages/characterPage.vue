<!----------------------------------------------------------------------------------------------------------------------
  -- Character Page
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <BContainer id="character-page" class="mt-2 mb-3" fluid>
        <!-- Error Handling -->
        <BContainer v-if="error">
            <BAlert variant="danger" :model-value="true">
                <h4>
                    <fa icon="exclamation-triangle"></fa>
                    Error loading character
                </h4>
                <div v-for="(line, index) in error.stack.split('\n')" :key="index">
                    {{ line }}
                </div>
                <div class="text-end">
                    <BButton to="/dashboard" variant="danger">
                        <fa icon="arrow-left"></fa>
                        Back to Dashboard
                    </BButton>
                </div>
            </BAlert>
        </BContainer>

        <!-- Loading -->
        <LoadingWidget v-else-if="!char"></LoadingWidget>

        <!-- Main Sheet Tabs -->
        <BTabs v-else class="main-tabs" pills>
            <template v-if="system" #tabs-start>
                <li style="position: absolute; left: 18px; padding-top: 10px;">
                    <h4 class="text-muted">
                        <span class="d-none d-md-inline">{{ system.name }}</span>
                        <fa v-if="saving" icon="save" class="flash text-success ms-2"></fa>
                    </h4>
                </li>
            </template>
            <BTab active>
                <template #title>
                    <fa icon="file-user"></fa>
                    Sheet
                </template>

                <!-- Actual System Character Sheet -->
                <component :is="char.system" :is-authorized="isAuthorized">
                    <!-- We put a warning here, mostly for the developer. -->
                    <BContainer>
                        <BAlert variant="warning" show>
                            <h4>
                                <fa icon="exclamation-triangle"></fa>
                                Unknown system "{{ char.system }}"
                            </h4>
                            <div>
                                This is an internal error, and you never be seen in normal operation. If you are a
                                developer, you done messed up. If you're a user, then please report this as a bug.
                            </div>
                            <div class="text-end">
                                <BButton :href="`https://github.com/Morgul/rpgkeeper/issues/new?title=[Bug] Unknown system '${ char.system }'.&labels=bug`" target="_blank" variant="warning">
                                    <fa icon="bug"></fa>
                                    Report Bug
                                </BButton>
                                <BButton to="/dashboard" variant="warning">
                                    <fa icon="arrow-left"></fa>
                                    Back to Dashboard
                                </BButton>
                            </div>
                        </BAlert>
                    </BContainer>
                </component>
            </BTab>
            <BTab>
                <template #title>
                    <fa icon="book"></fa>
                    Notes
                </template>

                <NoteBook></NoteBook>
            </BTab>
        </BTabs>
    </BContainer>
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
    import LoadingWidget from '../components/ui/loadingWidget.vue';
    import NoteBook from '../components/notes/noteBook.vue';

    // Systems
    import RisusCharacter from '../components/systems/risus/risusCharacter.vue';
    import FateCharacter from '../components/systems/fate/fateCharacter.vue';
    import EoteCharacter from '../components/systems/eote/eoteCharacter.vue';
    import WfrpCharacter from '../components/systems/wfrp/wfrpCharacter.vue';

    //------------------------------------------------------------------------------------------------------------------

    export default defineComponent({
        name: 'CharacterPage',
        components: {
            LoadingWidget,
            NoteBook,

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
