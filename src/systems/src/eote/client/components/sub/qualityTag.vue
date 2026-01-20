<!----------------------------------------------------------------------------------------------------------------------
  -- Quality Card
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <span class="eote-quality">
        <BBadge :id="uniqueID">
            {{ qualityName }}
        </BBadge>
        <BPopover :title="qualityName" :target="uniqueID" triggers="hover" placement="top" teleport-to="body">
            <div :class="`${ mode }-system`">
                <MarkdownBlock :text="qualityText" inline />
                <ReferenceBlock
                    v-if="qualityReference"
                    class="float-end mt-2 mb-2"
                    :reference="qualityReference"
                />
            </div>
        </BPopover>
    </span>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss" scoped>
    .eote-quality {
        cursor: pointer;

        & + .eote-quality {
            margin-left: 0.25rem;
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, ref } from 'vue';

    // Models
    import type { EoteQuality } from '../../../models.ts';

    // Utils
    import { shortID } from '@client/lib/utils/misc';

    // Stores
    import { useSystemStore } from '@client/lib/resource-access/stores/systems';
    import { useSupplementStore } from '@client/lib/resource-access/stores/supplements';

    // Components
    import ReferenceBlock from '@client/components/character/referenceBlock.vue';
    import MarkdownBlock from '@client/components/ui/markdownBlock.vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Props
    {
        id : string;
        ranks ?: number
    }

    const props = defineProps<Props>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const uniqueID = ref(shortID());

    const systemStore = useSystemStore();
    const supplementStore = useSupplementStore();

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const mode = computed(() => systemStore.current?.id ?? 'eote');

    const qualities = computed(() => supplementStore.get<EoteQuality>(mode.value, 'quality'));

    const quality = computed(() =>
    {
        return qualities.value?.filter((qual) => qual.id === props.id)[0];
    });

    const passive = computed(() =>
    {
        return !!quality.value?.passive;
    });

    const qualityName = computed(() =>
    {
        let text = 'Unknown';

        if(quality.value)
        {
            text = `${ quality.value.name }`;
            if(quality.value.ranked)
            {
                text += ` ${ props.ranks }`;
            }
        }

        return text;
    });

    const qualityText = computed(() =>
    {
        let text = passive.value ? '**Passive:** ' : '**Active:** ';
        if(quality.value?.description)
        {
            text += quality.value.description;
        }
        else
        {
            text += 'Unknown quality.';
        }

        return text;
    });

    const qualityReference = computed(() =>
    {
        if(quality.value?.reference)
        {
            return quality.value.reference;
        }

        return '';
    });
</script>
<!--------------------------------------------------------------------------------------------------------------------->
