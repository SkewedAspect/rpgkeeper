<!----------------------------------------------------------------------------------------------------------------------
  -- Reference Block
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="eote-reference" :class="{ inline: isInline }">
        <span class="name">{{ name }}</span>
        <span v-if="page">, p{{ page }}</span>
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss" scoped>
    .eote-reference {
        font-size: 0.8rem;
        font-style: italic;

        &.inline {
            display: inline-block;
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed } from 'vue';

    // Stores
    import { useSystemStore } from '../../lib/resource-access/stores/systems';
    import { useSupplementStore } from '../../lib/resource-access/stores/supplements';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Props
    {
        reference : string;
        inline ?: boolean;
    }

    const props = withDefaults(defineProps<Props>(), { inline: false });

    //------------------------------------------------------------------------------------------------------------------
    // Stores
    //------------------------------------------------------------------------------------------------------------------

    const systemStore = useSystemStore();
    const supplementStore = useSupplementStore();

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const isInline = computed(() => props.inline);

    const abbr = computed(() => props.reference.split(':')[0]);
    const page = computed(() => props.reference.split(':')[1]);
    const refObj = computed(() =>
    {
        const systemId = systemStore.current?.id;
        if(!systemId)
        {
            return undefined;
        }
        return supplementStore.getReferences(systemId).find((ref) => ref.abbr === abbr.value);
    });
    const name = computed(() => refObj.value?.name);
</script>

<!--------------------------------------------------------------------------------------------------------------------->
