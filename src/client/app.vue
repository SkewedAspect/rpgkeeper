<!----------------------------------------------------------------------------------------------------------------------
  -- App
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div id="app">
        <SiteHeader />
        <!-- Padding div for the fixed header. We do this so every page doesn't have to know about the height. -->
        <div style="height: 60px;" />
        <RouterView />
        <SiteFooter />
        <BToastOrchestrator />
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss">
	#app {
		height: calc(100% - 64px);
	}
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { watch } from 'vue';

    // Stores
    import { useColorModeStore } from './lib/stores/colorMode';

    // Components
    import SiteHeader from './components/ui/siteHeader.vue';
    import SiteFooter from './components/ui/siteFooter.vue';

    //------------------------------------------------------------------------------------------------------------------

    const colorModeStore = useColorModeStore();

    //------------------------------------------------------------------------------------------------------------------
    // Watchers
    //------------------------------------------------------------------------------------------------------------------

    watch(() => colorModeStore.bsTheme, (newBSTheme) =>
    {
        // We have to manually set the bootstrap theme on the base body property for dumb reasons.
        document.documentElement.setAttribute('data-bs-theme', newBSTheme);
    }, { immediate: true });

</script>

<!--------------------------------------------------------------------------------------------------------------------->
