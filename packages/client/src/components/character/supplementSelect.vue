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
                            :key="supp.id"
                            :variant=" supp.id === currentSelection ? 'primary' : null"
                            @click="selectSupp(supp)"
                        >
                            <div class="float-end">
                                <slot :instance="supp" :supplement="getSupp(supp.id)" name="selection-extra" />
                                <ScopeBadge :supplement="getSupp(supp.id)" />
                                <BButton
                                    class="ms-2 text-nowrap"
                                    variant="danger"
                                    title="Remove"
                                    @click.prevent.stop="removeSupp(supp)"
                                >
                                    <Fa icon="times" />
                                </BButton>
                            </div>
                            <div class="pt-2">
                                {{ getSupp(supp.id)?.name }}
                                <span v-if="getSupp(supp.id)?.ranked">{{ supp.ranks }}</span>
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
                    <template v-if="currentSelection" #header>
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
                                        <span v-if="currentSupplement.ranked">{{ supplementInstance?.ranks }}</span>
                                    </slot>
                                </h4>
                            </div>
                        </slot>
                    </template>
                    <div class="d-flex flex-column h-100">
                        <slot v-if="!currentSelection" name="noSelection">
                            <div class="text-center">
                                <i>Please select an option to view/edit it.</i>
                            </div>
                        </slot>
                        <slot v-else :instance="supplementInstance" :supplement="currentSupplement" name="preview">
                            <div v-if="currentSupplement.ranked" class="mb-2">
                                <label>Ranks</label>
                                <BFormSpinbutton id="sb-inline" v-model="supplementInstance.ranks" inline />
                            </div>
                            <MarkdownBlock :text="currentSupplement.description" inline />
                            <div class="text-end mt-auto">
                                <h5><ScopeBadge :supplement="currentSupplement" /></h5>
                                <ReferenceBlock :reference="currentSupplement.reference" />
                            </div>
                        </slot>
                    </div>
                </BCard>
            </BCol>
        </BFormRow>
    </BFormGroup>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, ref } from 'vue';
    import { storeToRefs } from 'pinia';

    // Models
    import type { Supplement, SupplementInst } from '@rpgk/core/models/systems';

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

    // TODO: Can't figure out how to define generic Supplements, so we define something a little better.
    // eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
    interface GenericSupplement extends Supplement
    {
        [key : string] : any;
    }

    // eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
    interface GenericSupplementInst extends SupplementInst
    {
        [key : string] : any;
    }

    interface Props
    {
        label : string;
        labelClass : string;
        available : GenericSupplement[];
        selected : (GenericSupplementInst | string | number)[];
        maxHeight ?: string;
        sortFn ?: (suppA : Supplement, suppB : Supplement) => number
    }

    const props = withDefaults(
        defineProps<Props>(),
        {
            maxHeight: '300px',
            sortFn: (suppA : Supplement, suppB : Supplement) => suppA.name.localeCompare(suppB.name),
        }
    );

    const emit = defineEmits<{
        new : [];
        add : [supp : GenericSupplement];
        edit : [supp : GenericSupplement];
        delete : [supp : GenericSupplement];
        remove : [supp : { id : string | number }];
    }>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const currentSelection = ref();
    const { current } = storeToRefs(useCharacterStore());

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const selectedSupplements = computed<GenericSupplementInst[]>(() =>
    {
        // Normalize the selected supplements to an array of objects with `id`.
        return props.selected.map((supp) =>
        {
            // If we have an object with `id`, assume we're in the right format
            if(typeof supp === 'object' && supp.id)
            {
                return supp;
            }
            else
            {
                // Otherwise assume we're just the id, and wrap ourselves in an object. This is Good Enough™.
                return { id: supp as string | number } satisfies SupplementInst;
            }
        });
    });

    const currentSupplement = computed(() =>
    {
        if(currentSelection.value)
        {
            return props.available.find((supp) => supp.id === currentSelection.value);
        }

        return undefined;
    });

    const supplementInstance = computed(() =>
    {
        if(currentSelection.value)
        {
            return selectedSupplements.value.find((supp) => supp.id === currentSelection.value);
        }

        return undefined;
    });

    const canModify = computed(() =>
    {
        const system = current.value?.system;
        if(supplementInstance.value && system)
        {
            const suppBase = props.available.find((supp) => supp.id === supplementInstance.value.id);

            const hasRight = authMan.hasPerm(`${ system }/canModifyContent`);
            const isOwner = suppBase.scope === 'user' && suppBase.owner === authMan.account.id;
            return isOwner || hasRight;
        }

        return false;
    });

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function onAdd(supp) : void
    {
        emit('add', supp);
    }

    function getSupp(id) : GenericSupplement | undefined
    {
        if(id)
        {
            return props.available.filter((supp) => supp.id === id)[0];
        }

        return undefined;
    }

    function selectSupp(supp) : void
    {
        if(supp && currentSelection.value !== supp.id)
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

    function editSupp(supp) : void
    {
        emit('edit', supp);
    }

    function deleteSupp(supp) : void
    {
        emit('delete', supp);
    }

    function addNew() : void
    {
        emit('new');
    }

    function removeSupp(supp) : void
    {
        clearSelection();
        emit('remove', { id: supp.id });
    }

    //------------------------------------------------------------------------------------------------------------------

    defineExpose({ clearSelection });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
