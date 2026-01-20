<!----------------------------------------------------------------------------------------------------------------------
  -- Footer
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <footer id="site-footer" class="container text-center">
        <hr class="mt-0 mb-2 fancy">
        <p class="mb-2">
            &copy; 2015 - {{ currentYear }} Skewed Aspect Studios
            <span class="text-muted ms-2">|</span>
            <span class="text-muted ms-2">v{{ appVersion }}</span>
        </p>
    </footer>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss">
    #site-footer {
        color: #aaa;
        font-size: 12px;
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed } from 'vue';

    //------------------------------------------------------------------------------------------------------------------

    // eslint-disable-next-line no-undef
    const appVersion = computed(() => __APP_VERSION__);
    const currentYear = computed(() => (new Date()).getFullYear());
</script>

<!--------------------------------------------------------------------------------------------------------------------->
