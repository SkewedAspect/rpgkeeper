<!----------------------------------------------------------------------------------------------------------------------
  -- markdownEditor
  --------------------------------------------------------------------------------------------------------------------->

<template>
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
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { Codemirror } from 'vue-codemirror';
    import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
    import { computed } from 'vue';
    import { EditorView } from 'codemirror';

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
    // Ref
    //------------------------------------------------------------------------------------------------------------------

    const extensions = [ markdown({ base: markdownLanguage }), EditorView.lineWrapping ];

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
</script>

<!--------------------------------------------------------------------------------------------------------------------->
