<!----------------------------------------------------------------------------------------------------------------------
  -- criticalCard
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <b-card :id="id" class="eote-critical-card" no-body>
        <template #header>
            <b-btn-close v-if="!readonly" style="margin-top: -2px;" @click.stop.prevent="remove"></b-btn-close>
            <small>
                {{ critical.title }}
                <span v-if="critical.severity">
                    (<difficulty v-for="index in severityRange" :key="index"></difficulty>)
                </span>
            </small>

            <b-popover :target="id" triggers="hover" placement="top">
                <template #title>
                    <div :class="`${ mode }-system`">
                        {{ critical.title }}
                        <span v-if="critical.severity">
                            (<difficulty v-for="index in severityRange" :key="index"></difficulty>)
                        </span>
                    </div>
                </template>
                <div :class="`${ mode }-system`">
                    <MarkdownBlock :text="critical.description" inline></MarkdownBlock>
                    <reference class="float-right mt-2 mb-2" :reference="ref"></reference>
                </div>
            </b-popover>
        </template>
    </b-card>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss" scoped>
    .eote-critical-card {
        .card-header {
            border-bottom: none;
            cursor: pointer;
            padding: 0.25rem 0.5rem;
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts">
    //------------------------------------------------------------------------------------------------------------------

    import { defineComponent } from 'vue';

    // Utils
    import { shortID } from '../../../../../common/utils/misc';

    // Managers
    import eoteMan from '../../../../lib/managers/systems/eote';

    // Components
    import MarkdownBlock from '../../../ui/markdownBlock.vue';
    import Reference from '../../../character/reference.vue';

    //------------------------------------------------------------------------------------------------------------------

    export default defineComponent({
        name: 'EotECriticalCard',
        components: {
            MarkdownBlock,
            Reference
        },
        props: {
            critical: {
                type: Object,
                required: true
            },
            readonly: {
                type: Boolean,
                default: false
            }
        },
        subscriptions()
        {
            return {
                mode: eoteMan.mode$
            };
        },
        emits: [ 'remove' ],
        data()
        {
            return {
                uuid: shortID()
            };
        },
        computed: {
            id() { return `critical-${ this.uuid }`; },
            ref() { return this.mode === 'eote' ? 'E-CRB:217' : 'G-CRB:115'; },
            severityRange() { return Array(this.critical.severity); }
        },
        methods: {
            remove()
            {
                if(!this.readonly)
                {
                    this.$emit('remove', this.critical.title);
                }
            }
        }

    });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
