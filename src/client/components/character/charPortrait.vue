<!----------------------------------------------------------------------------------------------------------------------
  -- Character Portrait
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <b-img
        id="portrait"
        class="shadow-sm"
        :class="portraitClass"
        :src="url"
        :style="{ 'background-color': color }"
        thumbnail
    >
    </b-img>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss" scoped>
    #portrait {
        flex: 0 1 auto;
        min-width: 100px;
        min-height: 100px;
        max-width: 100px;
        max-height: 150px;
        overflow: hidden;

        // Auto-sizing
        @media(min-width: 960px)
        {
            min-width: 200px;
            max-width: 200px;
            max-height: 300px;
        }

        @media(min-width: 1140px)
        {
            min-width: 300px;
            max-width: 300px;
            max-height: 450px;
        }

        // Fixed Sizing
        &.portrait-sm {
            min-width: 100px !important;
            max-width: 100px !important;
            max-height: 150px !important;
        }

        &.portrait-md {
            min-width: 200px !important;
            max-width: 200px !important;
            max-height: 300px !important;

            @media(max-width: 959px)
            {
                min-width: 100px !important;
                max-width: 100px !important;
                max-height: 150px !important;
            }
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    //------------------------------------------------------------------------------------------------------------------

    import { computed } from 'vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Props
    {
        src : string;
        color : string;
        size : string;
    }

    const props = withDefaults(defineProps<Props>(), {
        src: '/images/portraitPlaceholder.png',
        color: '#ffffff',
        size: 'auto'
    });

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const portraitClass = computed<string>(() => `portrait-${ props.size }`);
    const url = computed<string>(() => props.src || '/images/portraitPlaceholder.png');
</script>

<!--------------------------------------------------------------------------------------------------------------------->
