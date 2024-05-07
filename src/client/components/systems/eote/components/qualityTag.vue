<!----------------------------------------------------------------------------------------------------------------------
  -- Quality Card
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <span class="eote-quality">
        <BBadge :id="uniqueID">
            {{ qualityName }}
        </BBadge>
        <BPopover :title="qualityName" :target="uniqueID" triggers="hover" placement="top">
            <div :class="`${ mode }-system`">
                <MarkdownBlock :text="qualityText" inline></MarkdownBlock>
                <ReferenceBlock
                    v-if="qualityReference"
                    class="float-end mt-2 mb-2"
                    :reference="qualityReference"
                ></ReferenceBlock>
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

    // Utils
    import { shortID } from '../../../../../common/utils/misc';

    // Managers
    import eoteMan from '../../../../lib/managers/systems/eote';

    // Components
    import ReferenceBlock from '../../../character/referenceBlock.vue';
    import MarkdownBlock from '../../../ui/markdownBlock.vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Props
    {
        id : number;
        ranks ?: number
    }

    const props = defineProps<Props>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const uniqueID = ref(shortID());

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const mode = computed(() => eoteMan.mode);

    const qualities = computed(() => eoteMan.qualities);

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
