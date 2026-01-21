<!----------------------------------------------------------------------------------------------------------------------
  -- Supplement Search
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="supp-search d-flex">
        <VueBootstrapAutocomplete
            v-model="search"
            class="w-100"
            :data="availableFiltered"
            placeholder="Search..."
            autocomplete="off"
            :max-matches="1000"
            :serializer="serializeSupplement"
            :popper-options="popperOptions"
            show-on-focus
            @hit="onHit"
        >
            <template #prepend>
                <BInputGroupText>
                    <Fa icon="search" />
                </BInputGroupText>
            </template>
            <template #append>
                <slot name="append-extra" />
            </template>
            <template #suggestion="{ data, htmlText }">
                <div class="float-end">
                    <slot :supplement="data" name="suggestion-extra" />
                    <ScopeBadge :supplement="data" />
                </div>

                <!-- Note: the v-html binding is used, as htmlText contains
                         the suggestion text highlighted with <strong> tags -->
                <!-- eslint-disable-next-line vue/no-v-html -->
                <span v-html="htmlText" />
            </template>
        </VueBootstrapAutocomplete>
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss">
    .supp-search {
        ul.vbt-autocomplete-list {
            max-height: 300px;
            overflow-y: auto;
            z-index: 1000;
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, ref } from 'vue';

    // Models
    import type { Supplement, SupplementInst } from '@rpgk/core';

    // Components
    import { VueBootstrapAutocomplete } from '@morgul/vue-bootstrap-autocomplete';
    import ScopeBadge from './scopeBadge.vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Props
    {
        available : Supplement[];
        selected : (SupplementInst | string | number)[];
        boundary ?: 'scrollParent' | 'viewport' | 'window';
        sortFn ?: (suppA : Supplement, suppB : Supplement) => number
    }

    const props = withDefaults(
        defineProps<Props>(),
        {
            boundary: 'window',
            sortFn: (suppA : Supplement, suppB : Supplement) => suppA.name.localeCompare(suppB.name),
        }
    );

    type Events = (e : 'add', supp : { id : string }) => void;

    const emit = defineEmits<Events>();

    defineSlots<{
        'suggestion-extra' : (props : { supplement : Supplement }) => unknown;
        'append-extra' : (props : object) => unknown;
    }>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const popperOptions = {
        strategy: 'fixed',
    };

    const search = ref('');

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const availableFiltered = computed(() =>
    {
        return props.available
            .filter((supp) =>
            {
                let alreadyAdded;
                const firstItem = props.selected[0];
                if(typeof firstItem === 'object' && firstItem?.id)
                {
                    alreadyAdded = !!(props.selected as SupplementInst[]).find((item) => item.id === supp.id);
                }
                else if(supp.id)
                {
                    alreadyAdded = (props.selected as (string | number)[]).includes(supp.id);
                }

                return supp.name.toLowerCase().includes(search.value.toLowerCase()) && !alreadyAdded;
            })
            .sort(props.sortFn);
    });

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function serializeSupplement(supplement : Supplement) : string
    {
        return supplement.name;
    }

    function onHit(supp : Supplement) : void
    {
        if(supp?.id)
        {
            emit('add', { id: supp.id });
            search.value = '';
        }
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
