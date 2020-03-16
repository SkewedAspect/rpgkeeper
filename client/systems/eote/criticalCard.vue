<!----------------------------------------------------------------------------------------------------------------------
  -- criticalCard
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <b-card :id="id" class="eote-critical-card" no-body>
        <template v-slot:header>
            <b-btn-close v-if="!readonly" style="margin-top: -2px;" @click.stop.prevent="remove"></b-btn-close>
            <small>
                {{ critical.title }}
                <span v-if="critical.severity">
                    (<difficulty v-for="index in severityRange" :key="index"></difficulty>)
                </span>
            </small>

            <b-popover title="Summary" :target="id" triggers="hover" placement="top">
                <markdown-block :text="critical.description" inline></markdown-block>
                <reference class="float-right mt-2 mb-2" :reference="ref"></reference>
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

<script>
    //------------------------------------------------------------------------------------------------------------------

    import v4 from 'uuid';

    // Managers
    import eoteMan from '../../api/managers/eote';

    // Components
    import MarkdownBlock from '../../components/ui/markdown';
    import Reference from './components/reference.vue';

    //------------------------------------------------------------------------------------------------------------------

    export default {
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
        subscriptions: {
            mode: eoteMan.mode$
        },
        data()
        {
            return {
                uuid: v4()
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
                } // end if
            }
        }
    };
</script>

<!--------------------------------------------------------------------------------------------------------------------->
