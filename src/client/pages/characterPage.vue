<!----------------------------------------------------------------------------------------------------------------------
  -- Character Page
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <BContainer id="character-page" class="mt-2 mb-3" fluid>
        <!-- Error Handling -->
        <BContainer v-if="pageError">
            <BAlert variant="danger" :model-value="true">
                <h4>
                    <Fa icon="exclamation-triangle" />
                    Error loading character
                </h4>
                <div v-for="(line, index) in pageError?.stack?.split('\n')" :key="index">
                    {{ line }}
                </div>
                <div class="text-end">
                    <BButton to="/dashboard" variant="danger">
                        <Fa icon="arrow-left" />
                        Back to Dashboard
                    </BButton>
                </div>
            </BAlert>
        </BContainer>

        <!-- Loading -->
        <LoadingWidget v-else-if="!char" />

        <!-- Main Sheet Tabs -->
        <BTabs v-else class="main-tabs" pills>
            <template v-if="system" #tabs-start>
                <li style="position: absolute; left: 18px; padding-top: 10px;">
                    <h4 class="text-muted">
                        <span class="d-none d-md-inline">{{ system.name }}</span>
                        <Fa v-if="saving" icon="save" class="flash text-success ms-2" />
                    </h4>
                </li>
            </template>
            <BTab active>
                <template #title>
                    <Fa icon="file-user" />
                    Sheet
                </template>

                <!-- Actual System Character Sheet -->
                <Component :is="characterPages[char.system]" :is-authorized="isAuthorized">
                    <!-- We put a warning here, mostly for the developer. -->
                    <BContainer>
                        <BAlert variant="warning" show>
                            <h4>
                                <Fa icon="exclamation-triangle" />
                                Unknown system "{{ char.system }}"
                            </h4>
                            <div>
                                This is an internal error, and you never be seen in normal operation. If you are a
                                developer, you done messed up. If you're a user, then please report this as a bug.
                            </div>
                            <div class="text-end">
                                <BButton
                                    :href="bugLink"
                                    target="_blank"
                                    variant="warning"
                                >
                                    <Fa icon="bug" />
                                    Report Bug
                                </BButton>
                                <BButton to="/dashboard" variant="warning">
                                    <Fa icon="arrow-left" />
                                    Back to Dashboard
                                </BButton>
                            </div>
                        </BAlert>
                    </BContainer>
                </Component>
            </BTab>
            <BTab>
                <template #title>
                    <Fa icon="book" />
                    Notes
                </template>

                <NoteBook />
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

<script setup lang="ts">
    import { computed, onBeforeMount, ref } from 'vue';
    import { useRoute } from 'vue-router';

    // Stores
    import { useAccountStore } from '../lib/resource-access/stores/account';
    import { useSystemStore } from '../lib/resource-access/stores/systems';
    import { useCharacterStore } from '../lib/resource-access/stores/characters';

    // Managers
    import charMan from '../lib/managers/character';

    // Components
    import LoadingWidget from '../components/ui/loadingWidget.vue';
    import NoteBook from '../components/notes/noteBook.vue';

    // Systems
    import CocCharacter from '../components/systems/coc/cocCharacter.vue';
    import RisusCharacter from '../components/systems/risus/risusCharacter.vue';
    import FateCharacter from '../components/systems/fate/fateCharacter.vue';
    import EoteCharacter from '../components/systems/eote/eoteCharacter.vue';
    import WfrpCharacter from '../components/systems/wfrp/wfrpCharacter.vue';

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const characterPages = {
        coc: CocCharacter,
        fate: FateCharacter,
        risus: RisusCharacter,
        genesys: EoteCharacter, // This is actually correct. We use the same component for both.
        eote: EoteCharacter,
        wfrp: WfrpCharacter,
    };

    const accountStore = useAccountStore();
    const charactersStore = useCharacterStore();
    const systemsStore = useSystemStore();

    const route = useRoute();
    const pageError = ref<Error | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const account = computed(() => accountStore.account);
    const char = computed(() => charactersStore.current);
    const saving = computed(() => charactersStore.saving);
    const system = computed(() => systemsStore.current);

    const isAuthorized = computed(() =>
    {
        return !!account.value
            && !!char.value
            && (account.value.id || 'nope!') === char.value.accountID;
    });

    const bugLink = computed(() =>
    {
        return 'https://github.com/Morgul/rpgkeeper/issues/new?title=[Bug] Unknown system \''
            + `${ char.value.system }'.&labels=bug`;
    });

    //------------------------------------------------------------------------------------------------------------------
    // Lifecycle Hooks
    //------------------------------------------------------------------------------------------------------------------

    onBeforeMount(() =>
    {
        // This will never normally be an array, but we handle it just in case.
        const charID = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id;

        // We always select the character that matches our route, so we handle navigation.
        charMan.select(charID)
            .catch((err) => pageError.value = err);
    });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
