<!----------------------------------------------------------------------------------------------------------------------
  -- markdownEditor
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div>
        <BCard class="overflow-hidden" no-body>
            <Codemirror
                v-model:model-value="text"
                :style="{ 'height': height }"
                :extensions="extensions"
                class="markdown-editor"
                :disabled="readonly"
                wrap
            />
        </BCard>
        <small class="text-muted">
            You may use Markdown
            (<a href="#" @click.prevent="showHelp">Syntax Guide</a>)
            to format text.
        </small>

        <MarkdownHelpModal ref="helpModal" :system="system" />
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { Codemirror } from 'vue-codemirror';
    import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
    import { computed, useTemplateRef } from 'vue';
    import { EditorView } from 'codemirror';

    // Stores
    import { useSystemStore } from '@client/lib/resource-access/stores/systems';

    // Components
    import MarkdownHelpModal from './markdownHelpModal.vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Props
    {
        text : string;
        height ?: string;
        readonly ?: boolean;
    }

    const props = withDefaults(defineProps<Props>(), { readonly: false, height: '450px' });

    const emit = defineEmits<{
        'update:text' : [text : string];
    }>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const extensions = [ markdown({ base: markdownLanguage }), EditorView.lineWrapping ];
    const helpModal = useTemplateRef('helpModal');

    const systemStore = useSystemStore();

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const text = computed({
        get() { return props.text; },
        set(val) { emit('update:text', val); },
    });

    const height = computed(() =>
    {
        return props.height;
    });

    const system = computed(() =>
    {
        const currentSystem = systemStore.current?.id;
        if(currentSystem === 'eote' || currentSystem === 'genesys')
        {
            return currentSystem;
        }
        return undefined;
    });

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function showHelp() : void
    {
        helpModal.value?.show();
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
