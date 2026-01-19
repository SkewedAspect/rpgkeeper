<!----------------------------------------------------------------------------------------------------------------------
  -- Motivation Block
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="genesys-motivation d-inline-block">
        <BBadge :id="uniqueID">
            {{ motivationName }}
        </BBadge>
        <BPopover :title="motivationName" :target="uniqueID" triggers="hover" placement="top" teleport-to="body">
            <div :class="`genesys-system`">
                <MarkdownBlock :text="motivationText" inline />
                <Reference
                    v-if="motivationReference"
                    class="float-end mt-2 mb-2"
                    :reference="motivationReference"
                />
            </div>
        </BPopover>
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss" scoped>
    .genesys-motivation {
        cursor: pointer;
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, ref } from 'vue';

    // Models
    import type { GenesysMotivation } from '../../../models.ts';

    // Utils
    import { shortID } from '@client/lib/utils/misc';

    // Stores
    import { useSystemStore } from '@client/lib/resource-access/stores/systems';
    import { useSupplementStore } from '@client/lib/resource-access/stores/supplements';

    // Components
    import Reference from '@client/components/character/referenceBlock.vue';
    import MarkdownBlock from '@client/components/ui/markdownBlock.vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Props
    {
        id : string;
    }

    const props = defineProps<Props>();

    //------------------------------------------------------------------------------------------------------------------
    // Ref
    //------------------------------------------------------------------------------------------------------------------

    const uniqueID = ref(shortID());

    const systemStore = useSystemStore();
    const supplementStore = useSupplementStore();

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const mode = computed(() => systemStore.current?.id ?? 'genesys');

    const motivation = computed(() =>
    {
        return supplementStore.get<GenesysMotivation>(mode.value, 'motivation').find((mot) => mot.id === props.id);
    });

    const motivationName = computed(() =>
    {
        let text = 'Unknown';

        if(motivation.value)
        {
            text = `${ motivation.value.name }`;
        }

        return text;
    });

    const motivationText = computed<string>(() =>
    {
        return motivation.value?.description ?? 'Unknown motivation.';
    });

    const motivationReference = computed(() =>
    {
        if(motivation.value && motivation.value.reference)
        {
            return motivation.value.reference;
        }

        return '';
    });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
