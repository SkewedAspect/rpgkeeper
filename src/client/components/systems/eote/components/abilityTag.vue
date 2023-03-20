<!----------------------------------------------------------------------------------------------------------------------
  -- abilityTag.vue
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <span class="eote-ability">
        <b-badge :id="`ability-${ id }`">
            {{ abilityName }}
        </b-badge>
        <b-popover :title="abilityName" :target="`ability-${ id }`" triggers="hover" placement="top">
            <div :class="`${ mode }-system`">
                <MarkdownBlock :text="abilityText" inline></MarkdownBlock>
                <reference v-if="abilityReference" class="float-right mt-2 mb-2" :reference="abilityReference"></reference>
            </div>
        </b-popover>
    </span>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss" scoped>
    .eote-ability {
        cursor: pointer;

        & + .eote-ability {
            margin-left: 0.25rem;
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed } from 'vue';

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
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const mode = computed(() => eoteMan.mode);

    const ability = computed(() =>
    {
        return eoteMan.abilities.find((item) => item.id === props.id);
    });

    const abilityName = computed(() => ability.value?.name ?? 'Unknown');
    const abilityText = computed(() => ability.value?.description ?? 'Unknown ability.');
    const abilityReference = computed(() => ability.value?.reference ?? '');
</script>

<!--------------------------------------------------------------------------------------------------------------------->
