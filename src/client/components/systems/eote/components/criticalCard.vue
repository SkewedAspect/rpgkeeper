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
                    <reference class="float-right mt-2 mb-2" :reference="reference"></reference>
                </div>
            </b-popover>
        </template>
    </b-card>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss">
    .eote-critical-card {
        .card-header {
            border-bottom: none;
            cursor: pointer;
            padding: 0.25rem 0.5rem;
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, ref } from 'vue';

    // Models
    import { EoteCritical } from '../../../../../common/interfaces/systems/eote';

    // Utils
    import { shortID } from '../../../../../common/utils/misc';

    // Managers
    import eoteMan from '../../../../lib/managers/systems/eote';

    // Components
    import MarkdownBlock from '../../../ui/markdownBlock.vue';
    import Reference from '../../../character/referenceBlock.vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Props
    {
        critical : EoteCritical;
        readonly : boolean;
    }

    const props = defineProps<Props>();

    interface Events
    {
        (e : 'remove', title : string) : void;
    }

    const emit = defineEmits<Events>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const uuid = ref(shortID());

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const mode = computed(() => eoteMan.mode);
    const critical = computed(() => props.critical);
    const readonly = computed(() => props.readonly);

    const id = computed(() => `critical-${ uuid.value }`);
    const reference = computed(() => { return mode.value ? 'E-CRB:217' : 'G-CRB:115'; });
    const severityRange = computed(() => Array(critical.value.severity));

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function remove() : void
    {
        if(!readonly.value)
        {
            emit('remove', critical.value.title);
        }
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
