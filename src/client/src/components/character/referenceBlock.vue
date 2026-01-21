<!----------------------------------------------------------------------------------------------------------------------
  -- Reference Block
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="eote-reference" :class="{ inline }">
        <div v-for="(ref, idx) in parsedRefs" :key="idx" class="ref-item">
            <span class="name">{{ ref.name }}</span>
            <span v-if="ref.page">, p{{ ref.page }}</span>
        </div>
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss" scoped>
    .eote-reference {
        font-size: 0.8rem;
        font-style: italic;
        margin-right: 2px;

        &.inline {
            display: inline-block;

            .ref-item {
                display: inline;

                &:not(:last-child)::after {
                    content: '; ';
                }
            }
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed } from 'vue';

    // Stores
    import { useSystemStore } from '../../lib/resource-access/stores/systems';
    import { useSupplementStore } from '../../lib/resource-access/stores/supplements';

    // Utils
    import { toReferenceArray } from '../../lib/utils/misc';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Props
    {
        reference : string | string[];
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

    interface ParsedReference
    {
        abbr : string;
        page : string | undefined;
        name : string | undefined;
    }

    const parsedRefs = computed<ParsedReference[]>(() =>
    {
        const systemId = systemStore.current?.id;
        const references = supplementStore.getReferences(systemId ?? '');

        return toReferenceArray(props.reference).map((refStr) =>
        {
            const [ abbr, page ] = refStr.split(':');
            const refObj = references.find((ref) => ref.abbr === abbr);
            return {
                abbr,
                page,
                name: refObj?.name ?? abbr,
            };
        });
    });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
