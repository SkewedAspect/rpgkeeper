<!----------------------------------------------------------------------------------------------------------------------
  -- Add/Edit Gear Modal
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="add-edit-gear-modal">
        <BModal
            ref="innerModal"
            header-bg-variant="dark"
            header-text-variant="white"
            no-close-on-esc
            no-close-on-backdrop
            size="lg"
            @ok="onSave"
            @cancel="onCancel"
        >
            <!-- Modal Header -->
            <template #header="{ cancel }">
                <h5 v-b-color-mode="'dark'" class="w-100 mb-0">
                    <Fa icon="backpack" />
                    {{ editMode ? 'Edit' : 'Add' }} Gear
                    <CloseButton class="float-end" @click="cancel" />
                </h5>
            </template>

            <!-- Modal Content -->
            <div :class="`${ mode }-system`">
                <BFormRow>
                    <!-- Name with autocomplete -->
                    <BFormGroup
                        class="flex-fill pe-1"
                        style="width: 60%"
                        label="Name"
                        label-class="fw-bold"
                        label-for="name-input"
                    >
                        <VueBootstrapAutocomplete
                            id="name-input"
                            v-model="workingGear.name"
                            :data="availableGear"
                            :serializer="(g : EoteGear) => g.name"
                            :max-matches="1000"
                            placeholder="Search or enter name..."
                            show-on-focus
                            @hit="onGearTemplateHit"
                        >
                            <template #append>
                                <BButton
                                    variant="secondary"
                                    title="Browse gear..."
                                    @click="openBrowseModal"
                                >
                                    <Fa icon="search" />
                                    Browse
                                </BButton>
                            </template>
                        </VueBootstrapAutocomplete>
                    </BFormGroup>

                    <!-- Encumbrance -->
                    <BFormGroup
                        class="flex-fill ps-1 pe-1"
                        style="width: 20%"
                        label="Encumb."
                        label-class="fw-bold"
                        label-for="encumbrance-input"
                    >
                        <BFormInput
                            id="encumbrance-input"
                            v-model.number="workingGear.encumbrance"
                            type="number"
                            min="0"
                            step="1"
                        />
                    </BFormGroup>

                    <!-- Rarity -->
                    <BFormGroup
                        class="flex-fill ps-1"
                        style="width: 20%"
                        label="Rarity"
                        label-class="fw-bold"
                        label-for="rarity-input"
                    >
                        <BFormInput
                            id="rarity-input"
                            v-model.number="workingGear.rarity"
                            type="number"
                            min="0"
                            step="1"
                        />
                    </BFormGroup>
                </BFormRow>

                <BFormRow class="mt-2">
                    <!-- Description -->
                    <BFormGroup
                        class="flex-fill"
                        label="Description"
                        label-class="fw-bold"
                        label-for="description-input"
                    >
                        <BFormTextarea
                            id="description-input"
                            v-model="workingGear.description"
                            rows="4"
                        />
                    </BFormGroup>
                </BFormRow>
            </div>

            <!-- Modal Footer -->
            <template #footer="{ cancel, ok }">
                <BButton variant="secondary" @click="cancel">
                    <Fa icon="times" />
                    Cancel
                </BButton>
                <BButton variant="primary" @click="ok">
                    <Fa icon="save" />
                    {{ editMode ? 'Save' : 'Add' }}
                </BButton>
            </template>
        </BModal>

        <!-- Browse Gear Modal -->
        <SupplementBrowserModal
            ref="browseModal"
            title="Browse Gear"
            :supplements="availableGear"
            @select="onBrowseSelect"
        >
            <template #preview="{ supplement }">
                <div class="gear-stats d-flex flex-wrap mb-2">
                    <span class="me-4"><strong>Encumbrance:</strong> {{ supplement.encumbrance }}</span>
                    <span><strong>Rarity:</strong> {{ supplement.rarity }}</span>
                </div>
                <hr class="my-2">
                <div class="gear-description flex-grow-1 overflow-auto">
                    <MarkdownBlock :text="supplement.description ?? 'No description.'" inline />
                </div>
                <div class="text-end mt-auto pt-2">
                    <h5 class="mb-1">
                        <ScopeBadge :supplement="supplement" />
                    </h5>
                    <ReferenceBlock :reference="supplement.reference ?? ''" />
                </div>
            </template>
        </SupplementBrowserModal>

        <!-- Confirm Overwrite Modal -->
        <ConfirmOverwriteModal
            ref="confirmOverwriteModal"
            title="Overwrite Gear"
            message="Overwrite current gear values?"
            description="This will replace all fields with the selected template values. Any changes you've made will be lost."
            @confirm="onConfirmOverwrite"
        />
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss" scoped>
    .add-edit-gear-modal {
        .gear-description {
            max-height: 250px;
            overflow-y: auto;
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, ref, useTemplateRef } from 'vue';
    import { storeToRefs } from 'pinia';

    // Models
    import type { EoteGear, EoteGearRef, EoteOrGenCharacter } from '../../../models.ts';

    // Stores
    import { useCharacterStore } from '@client/lib/resource-access/stores/characters';
    import { useSystemStore } from '@client/lib/resource-access/stores/systems';
    import { useSupplementStore } from '@client/lib/resource-access/stores/supplements';

    // Components
    import { BModal } from 'bootstrap-vue-next';
    import { VueBootstrapAutocomplete } from '@morgul/vue-bootstrap-autocomplete';
    import CloseButton from '@client/components/ui/closeButton.vue';
    import SupplementBrowserModal from '@client/components/character/supplementBrowserModal.vue';
    import ConfirmOverwriteModal from '@client/components/ui/confirmOverwriteModal.vue';
    import MarkdownBlock from '@client/components/ui/markdownBlock.vue';
    import ScopeBadge from '@client/components/character/scopeBadge.vue';
    import ReferenceBlock from '@client/components/character/referenceBlock.vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    const emit = defineEmits<{
        add : [gear : EoteGearRef];
        edit : [index : number, gear : EoteGearRef];
    }>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const { current } = storeToRefs(useCharacterStore());
    const systemStore = useSystemStore();
    const supplementStore = useSupplementStore();

    const innerModal = useTemplateRef<InstanceType<typeof BModal>>('innerModal');
    const browseModal = useTemplateRef<{ show : () => void; hide : () => void }>('browseModal');
    const confirmOverwriteModal = useTemplateRef<{ show : () => void }>('confirmOverwriteModal');

    const editIndex = ref<number>(-1);
    const pendingTemplate = ref<EoteGear | null>(null);
    const workingGear = ref<EoteGearRef>({
        name: '',
        description: '',
        encumbrance: 0,
        rarity: 0,
    });

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const character = computed<EoteOrGenCharacter>(() => current.value as EoteOrGenCharacter);
    const mode = computed(() => systemStore.current?.id ?? 'eote');
    const editMode = computed(() => editIndex.value !== -1);
    const availableGear = computed(() => supplementStore.get<EoteGear>(mode.value, 'gear'));

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function formHasValues() : boolean
    {
        return !!(
            workingGear.value.description
            || workingGear.value.encumbrance > 0
            || workingGear.value.rarity > 0
        );
    }

    function applyTemplate(template : EoteGear) : void
    {
        workingGear.value = {
            name: template.name,
            description: template.description ?? '',
            encumbrance: template.encumbrance ?? 0,
            rarity: template.rarity ?? 0,
        };
    }

    function onGearTemplateHit(template : EoteGear) : void
    {
        if(formHasValues())
        {
            pendingTemplate.value = template;
            confirmOverwriteModal.value?.show();
        }
        else
        {
            applyTemplate(template);
        }
    }

    function openBrowseModal() : void
    {
        browseModal.value?.show();
    }

    function onBrowseSelect(template : EoteGear) : void
    {
        if(formHasValues())
        {
            pendingTemplate.value = template;
            confirmOverwriteModal.value?.show();
        }
        else
        {
            applyTemplate(template);
        }
    }

    function onConfirmOverwrite() : void
    {
        if(pendingTemplate.value)
        {
            applyTemplate(pendingTemplate.value);
            pendingTemplate.value = null;
        }
    }

    function show(gear ?: EoteGearRef) : void
    {
        if(gear)
        {
            // Edit mode
            editIndex.value = character.value.details.gear.indexOf(gear);
            workingGear.value = { ...gear };
        }
        else
        {
            // Add mode
            editIndex.value = -1;
            workingGear.value = {
                name: '',
                description: '',
                encumbrance: 0,
                rarity: 0,
            };
        }

        innerModal.value?.show();
    }

    function hide() : void
    {
        innerModal.value?.hide();
    }

    function onSave() : void
    {
        if(editMode.value)
        {
            emit('edit', editIndex.value, workingGear.value);
        }
        else
        {
            emit('add', workingGear.value);
        }

        hide();
    }

    function onCancel() : void
    {
        pendingTemplate.value = null;
        hide();
    }

    //------------------------------------------------------------------------------------------------------------------
    // Expose
    //------------------------------------------------------------------------------------------------------------------

    defineExpose({
        show,
        hide,
    });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
