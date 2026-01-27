<!----------------------------------------------------------------------------------------------------------------------
  -- App
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div id="app">
        <SiteHeader />
        <AlertBanner />
        <main id="main-content">
            <RouterView />
        </main>
        <SiteFooter v-if="showFooter" />
        <BOrchestrator />
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss">
    #app {
        display: flex;
        flex-direction: column;
        height: 100vh;
        padding-top: 50px; // Account for fixed navbar
        overflow: hidden;
    }

    #main-content {
        flex: 1;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, watch } from 'vue';
    import { useRoute } from 'vue-router';

    // Stores
    import { useAccountStore } from './lib/resource-access/stores/account';

    // Components
    import AlertBanner from './components/news/alertBanner.vue';
    import SiteHeader from './components/ui/siteHeader.vue';
    import SiteFooter from './components/ui/siteFooter.vue';

    //------------------------------------------------------------------------------------------------------------------

    const route = useRoute();
    const accountStore = useAccountStore();

    const showFooter = computed(() => !route.meta.hideFooter);

    //------------------------------------------------------------------------------------------------------------------
    // Watchers
    //------------------------------------------------------------------------------------------------------------------

    watch(() => accountStore.bsTheme, (newBSTheme) =>
    {
        // We have to manually set the bootstrap theme on the base body property for dumb reasons.
        document.documentElement.setAttribute('data-bs-theme', newBSTheme);
    }, { immediate: true });

</script>

<!--------------------------------------------------------------------------------------------------------------------->
