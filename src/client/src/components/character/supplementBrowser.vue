<!----------------------------------------------------------------------------------------------------------------------
  -- Supplement Browser
  --
  -- A two-panel browser for browsing and selecting supplements. Left panel shows a filterable list,
  -- right panel shows a read-only preview of the selected supplement.
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="supplement-browser">
        <BFormRow>
            <!-- Left Panel: Filterable List -->
            <BCol cols="5">
                <BCard class="h-100 overflow-hidden" no-body :style="{ maxHeight, minHeight: maxHeight }">
                    <template #header>
                        <BInputGroup>
                            <template #prepend>
                                <BInputGroupText>
                                    <Fa icon="search" />
                                </BInputGroupText>
                            </template>
                            <BFormInput
                                v-model="searchQuery"
                                placeholder="Search..."
                                autocomplete="off"
                            />
                        </BInputGroup>
                        <div class="d-flex gap-2 mt-2">
                            <BFormSelect
                                v-model="scopeFilter"
                                :options="scopeOptions"
                                size="sm"
                                class="w-auto"
                            />
                            <BFormSelect
                                v-model="sourceFilter"
                                :options="sourceOptions"
                                size="sm"
                                class="flex-grow-1"
                            />
                        </div>
                    </template>

                    <!-- Supplement List -->
                    <BListGroup v-if="filteredSupplements.length > 0" flush class="overflow-auto">
                        <BListGroupItem
                            v-for="supp in filteredSupplements"
                            :key="supp.id"
                            :active="selected?.id === supp.id"
                            class="d-flex align-items-center"
                            action
                            @click="selectSupplement(supp)"
                        >
                            <div class="flex-grow-1 text-truncate">
                                {{ supp.name }}
                            </div>
                            <div class="ms-2 flex-shrink-0">
                                <slot :supplement="supp" name="list-item-extra" />
                                <BBadge v-if="isAlreadyAdded(supp)" variant="secondary" class="me-1">
                                    Added
                                </BBadge>
                                <ScopeBadge :supplement="supp" />
                            </div>
                        </BListGroupItem>
                    </BListGroup>
                    <div v-else class="card-body text-center text-muted">
                        <i>No supplements found.</i>
                    </div>
                </BCard>
            </BCol>

            <!-- Right Panel: Preview -->
            <BCol cols="7">
                <BCard class="h-100" :style="{ maxHeight, minHeight: maxHeight }">
                    <template v-if="selected" #header>
                        <h4 class="mb-0">
                            <slot :supplement="selected" name="preview-title">
                                {{ selected.name }}
                            </slot>
                        </h4>
                    </template>
                    <div class="d-flex flex-column h-100 overflow-auto">
                        <slot v-if="!selected" name="no-selection">
                            <div class="text-center text-muted">
                                <i>Select a supplement to preview.</i>
                            </div>
                        </slot>
                        <slot v-else :supplement="selected" name="preview">
                            <MarkdownBlock
                                :text="selected.description ?? 'No description.'"
                                inline
                            />
                            <div class="text-end mt-auto pt-3">
                                <h5><ScopeBadge :supplement="selected" /></h5>
                                <ReferenceBlock :reference="selected.reference ?? ''" />
                            </div>
                        </slot>
                    </div>
                </BCard>
            </BCol>
        </BFormRow>
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss" scoped>
    .supplement-browser {
        .list-group-item {
            cursor: pointer;

            &:hover:not(.active) {
                background-color: rgba(0, 0, 0, 0.05);
            }
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup generic="TSupplement extends Supplement">
    import { computed, ref } from 'vue';

    // Models
    import type { Supplement } from '@rpgk/core';

    // Stores
    import { useSystemStore } from '../../lib/resource-access/stores/systems';
    import { useSupplementStore } from '../../lib/resource-access/stores/supplements';

    // Components
    import MarkdownBlock from '../ui/markdownBlock.vue';
    import ReferenceBlock from './referenceBlock.vue';
    import ScopeBadge from './scopeBadge.vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Props
    {
        supplements : TSupplement[];
        selectedIds ?: string[];
        maxHeight ?: string;
        sortFn ?: (suppA : TSupplement, suppB : TSupplement) => number;
    }

    const props = withDefaults(
        defineProps<Props>(),
        {
            selectedIds: () => [],
            maxHeight: '400px',
            sortFn: undefined,
        }
    );

    const emit = defineEmits<{
        select : [supplement : TSupplement];
    }>();

    defineSlots<{
        'list-item-extra' : (props : { supplement : TSupplement }) => unknown;
        'preview-title' : (props : { supplement : TSupplement }) => unknown;
        'no-selection' : () => unknown;
        'preview' : (props : { supplement : TSupplement }) => unknown;
    }>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const systemStore = useSystemStore();
    const supplementStore = useSupplementStore();

    const searchQuery = ref('');
    const scopeFilter = ref<'all' | 'official' | 'homebrew'>('all');
    const sourceFilter = ref<string>('all');
    const selectedSupplement = ref<Supplement | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const selected = computed(() => selectedSupplement.value as TSupplement | null);

    const sortFn = computed<(suppA : TSupplement, suppB : TSupplement) => number>(() =>
    {
        return props.sortFn ?? ((suppA, suppB) => suppA.name.localeCompare(suppB.name));
    });

    const scopeOptions = [
        { value: 'all', text: 'All' },
        { value: 'official', text: 'Official' },
        { value: 'homebrew', text: 'Homebrew' },
    ];

    const sourceOptions = computed(() =>
    {
        const systemId = systemStore.current?.id;
        const references = systemId ? supplementStore.getReferences(systemId) : [];

        // Collect unique source abbreviations
        const sources = new Set<string>();
        for(const supp of props.supplements)
        {
            if(supp.reference)
            {
                // Handle both string and string[] reference types
                const refs = Array.isArray(supp.reference) ? supp.reference : [ supp.reference ];
                for(const refStr of refs)
                {
                    // Extract abbreviation (e.g., "E-CRB:407" -> "E-CRB")
                    const abbr = refStr.split(':')[0];
                    if(abbr)
                    {
                        sources.add(abbr);
                    }
                }
            }
        }

        // Build options with nice names
        const options = [ { value: 'all', text: 'All Sources' } ];
        for(const abbr of [ ...sources ].sort())
        {
            const refObj = references.find((refItem) => refItem.abbr === abbr);
            const text = refObj?.name ?? abbr;
            options.push({ value: abbr, text });
        }
        return options;
    });

    const filteredSupplements = computed(() =>
    {
        const query = searchQuery.value.toLowerCase();
        return props.supplements
            .filter((supp) =>
            {
                // Text search filter
                if(!supp.name.toLowerCase().includes(query))
                {
                    return false;
                }

                // Scope filter
                if(scopeFilter.value === 'official' && !supp.official)
                {
                    return false;
                }
                if(scopeFilter.value === 'homebrew' && supp.official)
                {
                    return false;
                }

                // Source filter
                if(sourceFilter.value !== 'all')
                {
                    const refs = Array.isArray(supp.reference)
                        ? supp.reference
                        : (supp.reference ? [ supp.reference ] : []);
                    const abbrs = refs.map((refStr) => refStr.split(':')[0]);
                    if(!abbrs.includes(sourceFilter.value))
                    {
                        return false;
                    }
                }

                return true;
            })
            .sort(sortFn.value);
    });

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function isAlreadyAdded(supp : TSupplement) : boolean
    {
        return props.selectedIds.includes(supp.id ?? '');
    }

    function selectSupplement(supp : TSupplement) : void
    {
        selectedSupplement.value = supp;
        emit('select', supp);
    }

    function clearSelection() : void
    {
        selectedSupplement.value = null;
    }

    //------------------------------------------------------------------------------------------------------------------

    defineExpose({ clearSelection });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
