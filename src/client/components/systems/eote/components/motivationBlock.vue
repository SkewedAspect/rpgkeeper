<!----------------------------------------------------------------------------------------------------------------------
  -- Motivation Block
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="genesys-motivation d-inline-block">
        <BBadge :id="uniqueID">
            {{ motivationName }}
        </BBadge>
        <BPopover :title="motivationName" :target="uniqueID" triggers="hover" placement="top">
            <div :class="`genesys-system`">
                <MarkdownBlock :text="motivationText" inline></MarkdownBlock>
                <reference
                    v-if="motivationReference"
                    class="float-end mt-2 mb-2"
                    :reference="motivationReference"
                ></reference>
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

    // Utils
    import { shortID } from '../../../../lib/utils/misc';

    // Managers
    import eoteMan from '../../../../lib/managers/systems/eote';

    // Components
    import Reference from '../../../character/referenceBlock.vue';
    import MarkdownBlock from '../../../ui/markdownBlock.vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Props
    {
        id : number;
    }

    const props = defineProps<Props>();

    //------------------------------------------------------------------------------------------------------------------
    // Ref
    //------------------------------------------------------------------------------------------------------------------

    const uniqueID = ref(shortID());

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const motivation = computed(() =>
    {
        return eoteMan.motivations.find((mot) => `${ mot.id }` === `${ props.id }`);
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

    const motivationText = computed(() =>
    {
        if(motivation.value && motivation.value.description)
        {
            return motivation.value.description;
        }
        else
        {
            return 'Unknown motivation.';
        }
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
