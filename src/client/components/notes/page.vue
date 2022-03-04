<!----------------------------------------------------------------------------------------------------------------------
  -- Note Page
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <markdown id="note-page" :text="pageContent" :class="`${ system }-system`"></markdown>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss">
    #note-page {
        & > p:first-child {
            margin-top: 0;
        }

        & > p:last-child {
            margin-bottom: 0;
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts">
    //------------------------------------------------------------------------------------------------------------------

    import Vue, { PropType } from 'vue';
    import { marked } from 'marked';

    // Managers
    import charMan from '../../lib/managers/character';

    // Components
    import markdown from '../ui/markdown.vue';

    //------------------------------------------------------------------------------------------------------------------

    export default Vue.extend({
        name: 'NotePage',
        components: {
            markdown
        },
        props: {
            content: {
                type: String as PropType<string>,
                default: ''
            }
        },
        subscriptions()
        {
            return {
                char: charMan.selected$
            };
        },
        computed: {
            system()
            {
                return this.char.system;
            },
            pageContent()
            {
                return marked(this.content);
            }
        }
    });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
