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
        text ?: string;
        block ?: boolean;
        inline ?: boolean;
    }

    const props = withDefaults(
        defineProps<Props>(),
        {
            text: '',
            block: false,
            inline: false,
        }
    );

    //------------------------------------------------------------------------------------------------------------------
    // Helpers
    //------------------------------------------------------------------------------------------------------------------

    /**
     * Convert self-closing dice tags to full open/close tags
     * E.g., <difficulty /> -> <difficulty></difficulty>
     */
    function expandSelfClosingDiceTags(text : string) : string
    {
        const diceTagNames = [
            'boost',
            'setback',
            'ability',
            'difficulty',
            'proficiency',
            'challenge',
            'force',
            'success',
            'failure',
            'advantage',
            'threat',
            'triumph',
            'despair',
            'lightside',
            'darkside',
            'forcepoint',
        ];

        let result = text;
        for(const tagName of diceTagNames)
        {
            // Match self-closing tags: <tagname /> or <tagname/>
            const regex = new RegExp(`<${ tagName }\\s*/>`, 'gi');
            result = result.replace(regex, `<${ tagName }></${ tagName }>`);
        }

        return result;
    }

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const renderedContent = computed(() =>
    {
        // First expand self-closing dice tags before markdown processing
        let processedText = expandSelfClosingDiceTags(props.text);

        // Parse markdown
        let rawMarkup = marked.parse(processedText, { async: false }) as string;

        if(props.inline !== false)
        {
            rawMarkup = rawMarkup.trim().replace(/^(?:<p>)?(.*?)(?:<\/p>)?$/, '$1');
        }

        return rawMarkup;
    });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
