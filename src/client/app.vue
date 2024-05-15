<!----------------------------------------------------------------------------------------------------------------------
  -- App
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div id="app">
        <SiteHeader></SiteHeader>
        <!-- Padding div for the fixed header. We do this so every page doesn't have to know about the height. -->
        <div style="height: 60px;"></div>
        <router-view></router-view>
        <SiteFooter></SiteFooter>
        <BToastOrchestrator></BToastOrchestrator>
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
    import SiteHeader from './components/ui/siteHeader.vue';
    import SiteFooter from './components/ui/siteFooter.vue';
</script>

<!--------------------------------------------------------------------------------------------------------------------->
