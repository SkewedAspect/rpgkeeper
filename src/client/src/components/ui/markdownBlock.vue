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
    // Dice Symbol Conversion
    //------------------------------------------------------------------------------------------------------------------

    /**
     * Map dice tag names to their font character representations
     */
    const DICE_SYMBOLS : Record<string, string> = {
        boost: 'b', // solid square
        setback: 'b', // solid square
        ability: 'd', // solid diamond
        difficulty: 'D', // outline diamond
        proficiency: 'c', // solid hexagon
        challenge: 'C', // outline hexagon
        force: 'z', // force die
        success: 's',
        failure: 'f',
        advantage: 'a',
        threat: 't',
        triumph: 'x',
        despair: 'y',
        lightside: 'Z', // outline circle
        darkside: 'z', // solid circle
    };

    /**
     * Convert XML dice tags to styled spans with font symbols
     * E.g., <difficulty></difficulty> -> <span class="eote-symbol">D</span>
     */
    function convertDiceTags(html : string) : string
    {
        let result = html;

        for(const [ tagName, symbol ] of Object.entries(DICE_SYMBOLS))
        {
            const regex = new RegExp(`<${ tagName }></${ tagName }>`, 'gi');
            result = result.replace(regex, `<span class="eote-symbol">${ symbol }</span>`);
        }

        return result;
    }

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const renderedContent = computed(() =>
    {
        // Parse markdown first
        let rawMarkup = marked.parse(props.text, { async: false }) as string;

        if(props.inline !== false)
        {
            rawMarkup = rawMarkup.trim().replace(/^(?:<p>)?(.*?)(?:<\/p>)?$/, '$1');
        }

        // Convert dice tags AFTER markdown to styled spans
        rawMarkup = convertDiceTags(rawMarkup);

        return rawMarkup;
    });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
