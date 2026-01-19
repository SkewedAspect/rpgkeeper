<!----------------------------------------------------------------------------------------------------------------------
  -- Supplement Select
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <BFormGroup
        class="supplement-select"
        :label="label"
        :label-class="labelClass"
    >
        <BFormRow>
            <BCol>
                <BCard class="h-100 overflow-hidden" no-body :style="{ maxHeight, minHeight: maxHeight }">
                    <template #header>
                        <div class="d-flex">
                            <SupplementSearch
                                class="w-100"
                                :available="available"
                                :selected="selected"
                                :sort-fn="sortFn"
                                @add="onAdd"
                            >
                                <template #suggestion-extra="{ supplement }">
                                    <slot :supplement="supplement" name="suggestion-extra" />
                                </template>
                                <template #append-extra>
                                    <BButton
                                        class="ms-2 text-nowrap"
                                        variant="success"
                                        title="Add New..."
                                        @click="addNew()"
                                    >
                                        <Fa icon="plus" />
                                        New
                                    </BButton>
                                </template>
                            </SupplementSearch>
                        </div>
                    </template>

                    <!-- Supplement Selection -->
                    <BListGroup v-if="selectedSupplements.length > 0" flush class="overflow-auto">
                        <BListGroupItem
                            v-for="supp in selectedSupplements"
                            :key="supp.instance.id"
                            :variant=" supp.instance.id === currentSelection ? 'primary' : null"
                            @click="selectSupp(supp.instance)"
                        >
                            <div class="float-end">
                                <slot :instance="supp.instance" :supplement="supp.supplement" name="selection-extra" />
                                <ScopeBadge v-if="supp.supplement" :supplement="supp.supplement" />
                                <BButton
                                    class="ms-2 text-nowrap"
                                    variant="danger"
                                    title="Remove"
                                    @click.prevent.stop="removeSupp(supp.instance)"
                                >
                                    <Fa icon="times" />
                                </BButton>
                            </div>
                            <div class="pt-2">
                                {{ supp.supplement?.name }}
                            </div>
                        </BListGroupItem>
                    </BListGroup>
                    <div v-else class="card-body">
                        <h5 class="m-0 text-center">
                            Nothing added to character.
                        </h5>
                    </div>
                </BCard>
            </BCol>
            <BCol>
                <BCard class="h-100">
                    <template v-if="currentSelection && currentSupplement" #header>
                        <slot :instance="supplementInstance" :supplement="currentSupplement" name="header">
                            <div v-if="canModify" class="float-end">
                                <BButton size="sm" class="mt-1" @click="editSupp(currentSupplement)">
                                    <Fa icon="edit" />
                                    Edit
                                </BButton>
                                <BButton
                                    variant="danger"
                                    class="ms-1 mt-1"
                                    size="sm"
                                    @click="deleteSupp(currentSupplement)"
                                >
                                    <Fa icon="trash-alt" />
                                    Delete
                                </BButton>
                            </div>
                            <div style="height: 38px; padding-top: 6px">
                                <h4>
                                    <slot
                                        :instance="supplementInstance"
                                        :supplement="currentSupplement"
                                        name="preview-title"
                                    >
                                        {{ currentSupplement.name }}
                                    </slot>
                                </h4>
                            </div>
                        </slot>
                    </template>
                    <div class="d-flex flex-column h-100">
                        <slot v-if="!currentSupplement" name="noSelection">
                            <div class="text-center">
                                <i>Please select an option to view/edit it.</i>
                            </div>
                        </slot>
                        <slot v-else :instance="supplementInstance" :supplement="currentSupplement" name="preview">
                            <MarkdownBlock
                                :text="currentSupplement.description ?? 'No description.'"
                                inline
                            />
                            <div class="text-end mt-auto">
                                <h5><ScopeBadge :supplement="currentSupplement" /></h5>
                                <ReferenceBlock :reference="currentSupplement.reference ?? ''" />
                            </div>
                        </slot>
                    </div>
                </BCard>
            </BCol>
        </BFormRow>
    </BFormGroup>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup generic="TSupplement extends Supplement, TInstance extends SupplementInst">
    import { computed, ref } from 'vue';
    import { storeToRefs } from 'pinia';

    // Models
    import type { Supplement, SupplementInst } from '@rpgk/core';

    // Managers
    import authMan from '../../lib/managers/auth';

    // Stores
    import { useCharacterStore } from '../../lib/resource-access/stores/characters';

    // Components
    import SupplementSearch from './supplementSearch.vue';
    import MarkdownBlock from '../ui/markdownBlock.vue';
    import ReferenceBlock from './referenceBlock.vue';
    import ScopeBadge from './scopeBadge.vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Props
    {
        label : string;
        labelClass : string;
        available : TSupplement[];
        selected : (TInstance | string)[];
        maxHeight ?: string;
        sortFn ?: (suppA : Supplement, suppB : Supplement) => number
    }

    const props = withDefaults(
        defineProps<Props>(),
        {
            maxHeight: '300px',
            sortFn: undefined,
        }
    );

    const emit = defineEmits<{
        new : [];
        add : [supp : TInstance];
        edit : [supp : TSupplement];
        delete : [supp : TSupplement];
        remove : [supp : TInstance];
    }>();

    defineSlots<{
        'suggestion-extra' : (props : { supplement : TSupplement }) => unknown;
        'selection-extra' : (props : { instance : TInstance; supplement : TSupplement | undefined }) => unknown;
        'header' : (props : { instance : TInstance | undefined; supplement : TSupplement }) => unknown;
        'preview-title' : (props : { instance : TInstance | undefined; supplement : TSupplement }) => unknown;
        'noSelection' : () => unknown;
        'preview' : (props : { instance : TInstance | undefined; supplement : TSupplement }) => unknown;
    }>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const currentSelection = ref();
    const { current } = storeToRefs(useCharacterStore());

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    interface SelectedWithSupplement
    {
        instance : TInstance;
        supplement : TSupplement | undefined;
    }

    const selectedSupplements = computed<SelectedWithSupplement[]>(() =>
    {
        // Normalize the selected supplements to an array of objects with `id`, paired with their supplement.
        return props.selected.map((supp) : SelectedWithSupplement =>
        {
            // If we have an object with `id`, assume we're in the right format
            if(typeof supp === 'object' && supp.id)
            {
                return {
                    instance: supp,
                    supplement: props.available.find((avail) => avail.id === supp.id),
                };
            }

            // Otherwise assume we're just the id, and wrap ourselves in an object. This is Good Enough™.
            return {
                instance: { id: supp } as TInstance,
                supplement: props.available.find((avail) => avail.id === supp),
            };
        });
    });

    const currentSupplement = computed<TSupplement | undefined>(() =>
    {
        if(currentSelection.value)
        {
            return props.available.find((supp) => supp.id === currentSelection.value);
        }

        return undefined;
    });

    const supplementInstance = computed<TInstance | undefined>(() =>
    {
        if(currentSelection.value)
        {
            const found = selectedSupplements.value.find((supp) => supp.instance.id === currentSelection.value);
            return found?.instance;
        }

        return undefined;
    });

    const sortFn = computed<(suppA : Supplement, suppB : Supplement) => number>(() =>
    {
        return props.sortFn ?? ((suppA, suppB) => suppA.name.localeCompare(suppB.name));
    });

    const canModify = computed(() =>
    {
        const system = current.value?.system;
        if(supplementInstance.value && system)
        {
            const suppBase = props.available.find((supp) => supp.id === supplementInstance.value?.id);
            if(!suppBase)
            {
                return false;
            }

            const hasRight = authMan.hasPerm(`${ system }/canModifyContent`);
            const isOwner = !suppBase.official && suppBase.owner === authMan.account?.id;
            return isOwner || hasRight;
        }

        return false;
    });

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function onAdd(supp : { id : string }) : void
    {
        emit('add', supp as TInstance);
    }

    function selectSupp(supp : TInstance) : void
    {
        if(currentSelection.value !== supp.id)
        {
            currentSelection.value = supp.id;
        }
        else
        {
            currentSelection.value = undefined;
        }
    }

    function clearSelection() : void
    {
        currentSelection.value = null;
    }

    function editSupp(supp : TSupplement) : void
    {
        emit('edit', supp);
    }

    function deleteSupp(supp : TSupplement) : void
    {
        emit('delete', supp);
    }

    function addNew() : void
    {
        emit('new');
    }

    function removeSupp(supp : TInstance) : void
    {
        clearSelection();
        emit('remove', supp);
    }

    //------------------------------------------------------------------------------------------------------------------

    defineExpose({ clearSelection });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
