<!----------------------------------------------------------------------------------------------------------------------
  -- Supplement Browser Modal
  --
  -- A modal wrapper around SupplementBrowser that allows selecting a supplement from a list.
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="supplement-browser-modal">
        <BModal
            ref="innerModal"
            header-bg-variant="dark"
            header-text-variant="white"
            no-close-on-esc
            no-close-on-backdrop
            size="xl"
            @hidden="onHidden"
        >
            <!-- Modal Header -->
            <template #header="{ cancel }">
                <h5 v-b-color-mode="'dark'" class="w-100 mb-0">
                    <Fa icon="search" />
                    {{ title }}
                    <CloseButton class="float-end" @click="cancel" />
                </h5>
            </template>

            <!-- Modal Content -->
            <SupplementBrowser
                ref="browser"
                :supplements="supplements"
                :max-height="maxHeight"
                :sort-fn="sortFn"
                @select="onSelect"
            >
                <template v-if="$slots['list-item-extra']" #list-item-extra="{ supplement }">
                    <slot :supplement="supplement" name="list-item-extra" />
                </template>
                <template v-if="$slots['preview-title']" #preview-title="{ supplement }">
                    <slot :supplement="supplement" name="preview-title" />
                </template>
                <template v-if="$slots['no-selection']" #no-selection>
                    <slot name="no-selection" />
                </template>
                <template v-if="$slots.preview" #preview="{ supplement }">
                    <slot :supplement="supplement" name="preview" />
                </template>
            </SupplementBrowser>

            <!-- Modal Footer -->
            <template #footer>
                <BButton variant="success" @click="emit('add-new')">
                    <Fa icon="plus" />
                    Add New
                </BButton>
                <BButton
                    v-if="canEdit"
                    variant="warning"
                    class="ms-2"
                    @click="onEdit"
                >
                    <Fa icon="edit" />
                    Edit
                </BButton>
                <div class="ms-auto">
                    <BButton variant="secondary" class="me-2" @click="hide">
                        <Fa icon="times" />
                        Cancel
                    </BButton>
                    <BButton variant="primary" :disabled="!selectedSupplement" @click="onConfirmSelect">
                        <Fa icon="check" />
                        Select
                    </BButton>
                </div>
            </template>
        </BModal>
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup generic="TSupplement extends Supplement">
    import { computed, ref, useTemplateRef } from 'vue';

    // Models
    import type { Supplement } from '@rpgk/core';

    // Components
    import { BModal } from 'bootstrap-vue-next';
    import CloseButton from '../ui/closeButton.vue';
    import SupplementBrowser from './supplementBrowser.vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Props
    {
        title ?: string;
        supplements : TSupplement[];
        maxHeight ?: string;
        sortFn ?: (suppA : TSupplement, suppB : TSupplement) => number;
    }

    const props = withDefaults(
        defineProps<Props>(),
        {
            title: 'Browse Supplements',
            maxHeight: '400px',
            sortFn: undefined,
        }
    );

    const emit = defineEmits<{
        'select' : [supplement : TSupplement];
        'add-new' : [];
        'edit' : [supplement : TSupplement];
        'hidden' : [];
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

    const innerModal = useTemplateRef<InstanceType<typeof BModal>>('innerModal');
    const browser = ref<{ clearSelection : () => void } | null>(null);
    const selectedSupplement = ref<Supplement | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const canEdit = computed(() =>
    {
        return selectedSupplement.value && !selectedSupplement.value.official;
    });

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function onHidden() : void
    {
        selectedSupplement.value = null;
        browser.value?.clearSelection();
        emit('hidden');
    }

    function onSelect(supp : Supplement) : void
    {
        selectedSupplement.value = supp;
    }

    function show() : void
    {
        selectedSupplement.value = null;
        innerModal.value?.show();
    }

    function hide() : void
    {
        innerModal.value?.hide();
    }

    function onConfirmSelect() : void
    {
        if(selectedSupplement.value)
        {
            emit('select', selectedSupplement.value as TSupplement);
            hide();
        }
    }

    function onEdit() : void
    {
        if(selectedSupplement.value && !selectedSupplement.value.official)
        {
            emit('edit', selectedSupplement.value as TSupplement);
        }
    }

    //------------------------------------------------------------------------------------------------------------------

    defineExpose({ show, hide });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
