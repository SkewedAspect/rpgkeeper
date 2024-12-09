<!----------------------------------------------------------------------------------------------------------------------
  -- criticalCard
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <BCard :id="id" class="eote-critical-card" no-body>
        <template #header>
            <CloseButton
                v-if="!readonly"
                class="float-end"
                style="margin-top: -3px;"
                @click.stop.prevent="remove"
            />
            <small>
                {{ critical.title }}
                <span v-if="critical.severity">
                    <!-- eslint-disable-next-line vue/component-name-in-template-casing -->
                    (<difficulty v-for="index in severityRange" :key="index" />)
                </span>
            </small>

            <BPopover :target="id" triggers="hover" placement="top">
                <template #title>
                    <div :class="`${ mode }-system`">
                        {{ critical.title }}
                        <span v-if="critical.severity">
                            <!-- eslint-disable-next-line vue/component-name-in-template-casing -->
                            (<difficulty v-for="index in severityRange" :key="index" />)
                        </span>
                    </div>
                </template>
                <div :class="`${ mode }-system`">
                    <MarkdownBlock :text="critical.description" inline />
                    <ReferenceBlock class="float-end mt-2 mb-2" :reference="reference" />
                </div>
            </BPopover>
        </template>
    </BCard>
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
    import { shortID } from '../../../../lib/utils/misc';

    // Managers
    import eoteMan from '../../../../lib/managers/systems/eote';

    // Components
    import MarkdownBlock from '../../../ui/markdownBlock.vue';
    import ReferenceBlock from '../../../character/referenceBlock.vue';
    import CloseButton from '../../../ui/closeButton.vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Props
    {
        critical : EoteCritical;
        readonly : boolean;
    }

    const props = defineProps<Props>();

    type Events = (e : 'remove', title : string) => void;

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
