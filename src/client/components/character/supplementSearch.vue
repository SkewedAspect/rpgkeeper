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
            :serializer="(s) => s.name"
            :popper-options="popperOptions"
            show-on-focus
            @hit="onHit"
        >
            <template #prepend>
                <BInputGroupText>
                    <fa icon="search"></fa>
                </BInputGroupText>
            </template>
            <template #append>
                <BButton class="text-nowrap" variant="primary" title="Add..." @click="addSup()">
                    <fa icon="plus"></fa>
                    Add
                </BButton>
            </template>
            <template #suggestion="{ data, htmlText }">
                <div class="float-end">
                    <slot :supplement="data" name="suggestion-extra"></slot>
                    <ScopeBadge :supplement="data"></ScopeBadge>
                </div>

                <!-- Note: the v-html binding is used, as htmlText contains
                         the suggestion text highlighted with <strong> tags -->
                <!-- eslint-disable-next-line vue/no-v-html -->
                <span v-html="htmlText"></span>
            </template>
        </VueBootstrapAutocomplete>
        <slot name="append-extra"></slot>
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
    import { Supplement, SupplementInst } from '../../../common/interfaces/systems/supplements';

    // Components
    import { VueBootstrapAutocomplete } from '@morgul/vue-bootstrap-autocomplete';
    import ScopeBadge from './scopeBadge.vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Props
    {
        available : Supplement[];
        selected : SupplementInst[];
        boundary ?: 'scrollParent' | 'viewport' | 'window';
        sortFn ?: (suppA : Supplement, suppB : Supplement) => number
    }

    const props = withDefaults(
        defineProps<Props>(),
        {
            boundary: 'window',
            sortFn: (suppA : Supplement, suppB : Supplement) => suppA.name.localeCompare(suppB.name)
        }
    );

    interface Events
    {
        (e : 'add', supp : { id : string | number }) : void;
    }

    const emit = defineEmits<Events>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const popperOptions = {
        strategy: 'fixed'
    };

    const search = ref('');
    const suppToAdd = ref<Supplement>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const availableFiltered = computed(() =>
    {
        return props.available
            .filter((supp) =>
            {
                let alreadyAdded;
                if(props.selected[0]?.id)
                {
                    alreadyAdded = !!(props.selected.find((item) => item.id === supp.id));
                }
                else
                {
                    alreadyAdded = props.selected.includes(supp.id);
                }

                return supp.name.toLowerCase().includes(search.value.toLowerCase()) && !alreadyAdded;
            })
            .sort(props.sortFn);
    });

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function onHit(supp : Supplement)
    {
        suppToAdd.value = supp;
    }

    function addSup()
    {
        emit('add', { id: suppToAdd.value.id });
        suppToAdd.value = null;
        search.value = '';
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
