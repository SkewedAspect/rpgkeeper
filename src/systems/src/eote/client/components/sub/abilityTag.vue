<!----------------------------------------------------------------------------------------------------------------------
  -- abilityTag.vue
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <span class="eote-ability">
        <BBadge :id="`ability-${ uid }`">
            {{ name }}
        </BBadge>
        <BPopover :title="name" :target="`ability-${ uid }`" triggers="hover" placement="top" teleport-to="body">
            <MarkdownBlock :text="description" inline />
            <Reference v-if="reference" :reference="reference" class="float-end mt-2" />
        </BPopover>
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
    import { useId } from 'vue';

    // Components
    import MarkdownBlock from '@client/components/ui/markdownBlock.vue';
    import Reference from '@client/components/character/referenceBlock.vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Props
    {
        name : string;
        description : string;
        reference ?: string;
    }

    defineProps<Props>();

    const uid = useId();
</script>

<!--------------------------------------------------------------------------------------------------------------------->
