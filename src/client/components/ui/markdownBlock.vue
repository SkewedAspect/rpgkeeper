<!----------------------------------------------------------------------------------------------------------------------
  -- MarkdownBlock
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div class="markdown" :class="block ? '' : 'd-inline-block'" v-html="renderedContent" />
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss">
    .markdown {
        p:last-child {
            margin-bottom: 0;
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    //------------------------------------------------------------------------------------------------------------------

    import { computed } from 'vue';
    import { marked } from 'marked';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Props
    {
        text : string;
        block ?: boolean;
        inline ?: boolean;
    }

    const props = withDefaults(
        defineProps<Props>(),
        {
            block: false,
            inline: false,
        }
    );

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const renderedContent = computed(() =>
    {
        let rawMarkup = marked(props.text);

        if(props.inline !== false)
        {
            rawMarkup = rawMarkup.trim().replace(/^(?:<p>)?(.*?)(?:<\/p>)?$/, '$1');
        }

        return rawMarkup;
    });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
