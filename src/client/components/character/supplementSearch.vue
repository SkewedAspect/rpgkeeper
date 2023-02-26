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
            show-on-focus
            @hit="onHit"
        >
            <template #prepend>
                <b-input-group-text>
                    <fa icon="search"></fa>
                </b-input-group-text>
            </template>
            <template #append>
                <b-button class="text-nowrap" variant="primary" title="Add..." @click="addSup()">
                    <fa icon="plus"></fa>
                    Add
                </b-button>
            </template>
            <template #suggestion="{ data, htmlText }">
                <div class="float-right">
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
        .vbt-autocomplete-list {
            position: fixed;
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
    import { Supplement } from '../../../common/interfaces/systems/supplements';

    // Components
    import VueBootstrapAutocomplete from '@vue-bootstrap-components/vue-bootstrap-autocomplete';
    import ScopeBadge from './scopeBadge.vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Props
    {
        available : Supplement[];
        selected : Supplement[];
        sortFn : (suppA : Supplement, suppB : Supplement) => number
    }

    const props = withDefaults(
        defineProps<Props>(),
        {
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
