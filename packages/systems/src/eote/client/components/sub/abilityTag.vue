<!----------------------------------------------------------------------------------------------------------------------
  -- abilityTag.vue
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <span class="eote-ability">
        <BBadge :id="`ability-${ id }`">
            {{ abilityName }}
        </BBadge>
        <BPopover :title="abilityName" :target="`ability-${ id }`" triggers="hover" placement="top" teleport-to="body">
            <div :class="`${ mode }-system`">
                <MarkdownBlock :text="abilityText" inline />
                <Reference v-if="abilityReference" class="float-end mt-2 mb-2" :reference="abilityReference" />
            </div>
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
    import { computed } from 'vue';

    // Models
    import type { EoteAbility } from '../../../models.ts';

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

    const systemStore = useSystemStore();
    const supplementStore = useSupplementStore();

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const mode = computed(() => systemStore.current?.id ?? 'eote');

    const ability = computed(() =>
    {
        const abilities = supplementStore.get<EoteAbility>(mode.value, 'ability');
        return abilities.find((item) => item.id === props.id);
    });

    const abilityName = computed<string>(() => ability.value?.name ?? 'Unknown');
    const abilityText = computed<string>(() => ability.value?.description ?? 'Unknown ability.');
    const abilityReference = computed<string>(() => ability.value?.reference ?? '');
</script>

<!--------------------------------------------------------------------------------------------------------------------->
