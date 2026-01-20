<!----------------------------------------------------------------------------------------------------------------------
  -- EditArmorModal
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="edit-armor-modal">
        <BModal
            id="armorModal"
            ref="innerModal"
            header-bg-variant="dark"
            header-text-variant="white"
            no-close-on-esc
            no-close-on-backdrop
            body-class="position-static"
            size="xl"
            @ok="onSave"
            @cancel="onCancel"
        >
            <!-- Modal Header -->
            <template #header="{ cancel }">
                <h5 v-b-color-mode="'dark'" class="w-100 mb-0">
                    <Fa icon="file-edit" />
                    Edit Armor
                    <CloseButton class="float-end" @click="cancel" />
                </h5>
            </template>

            <!-- Modal Content -->
            <div :class="`${ mode }-system`">
                <BFormRow>
                    <BFormGroup
                        class="flex-fill pe-1"
                        label="Name"
                        label-class="fw-bold"
                        label-for="name-input"
                    >
                        <VueBootstrapAutocomplete
                            id="name-input"
                            v-model="editArmor.name"
                            :data="availableArmors"
                            :serializer="(a : EoteArmor) => a.name"
                            :max-matches="1000"
                            placeholder="Search or enter name..."
                            show-on-focus
                            @hit="onArmorTemplateHit"
                        >
                            <template #append>
                                <BButton
                                    variant="secondary"
                                    title="Browse armors..."
                                    @click="openBrowseModal"
                                >
                                    <Fa icon="search" />
                                    Browse Armor
                                </BButton>
                            </template>
                        </VueBootstrapAutocomplete>
                    </BFormGroup>
                </BFormRow>

                <BFormRow class="mt-2">
                    <BFormGroup
                        class="flex-fill pe-1"
                        style="width: 20%"
                        label="Defense"
                        label-class="fw-bold"
                        label-for="armor-defense"
                    >
                        <BFormInput
                            id="armor-defense"
                            v-model.number="editArmor.defense"
                            type="number"
                            min="0"
                            step="0"
                        />
                    </BFormGroup>
                    <BFormGroup
                        class="flex-fill ps-1 pe-1"
                        style="width: 20%"
                        label="Soak"
                        label-class="fw-bold"
                        label-for="armor-soak"
                    >
                        <BFormInput
                            id="armor-soak"
                            v-model.number="editArmor.soak"
                            type="number"
                            min="0"
                            step="0"
                        />
                    </BFormGroup>
                    <BFormGroup
                        class="flex-fill ps-1 pe-1"
                        style="width: 20%"
                        label="Hardpoints"
                        label-class="fw-bold"
                        label-for="armor-hardpoints"
                    >
                        <BFormInput
                            id="armor-hardpoints"
                            v-model.number="editArmor.hardpoints"
                            type="number"
                            min="0"
                            step="0"
                        />
                    </BFormGroup>
                    <BFormGroup
                        class="flex-fill ps-1 pe-1"
                        style="width: 20%"
                        label="Encumb."
                        label-class="fw-bold"
                        label-for="armor-encumbrance"
                    >
                        <BFormInput
                            id="armor-encumbrance"
                            v-model.number="editArmor.encumbrance"
                            type="number"
                            min="0"
                            step="0"
                        />
                    </BFormGroup>
                    <BFormGroup
                        class="flex-fill ps-1"
                        style="width: 20%"
                        label="Rarity"
                        label-class="fw-bold"
                        label-for="armor-rarity"
                    >
                        <BFormInput
                            id="armor-rarity"
                            v-model.number="editArmor.rarity"
                            type="number"
                            min="0"
                            step="0"
                        />
                    </BFormGroup>
                </BFormRow>

                <QualityEdit v-model:qualities="editArmor.qualities" class="mt-2" />
            </div>

            <!-- Modal Buttons -->
            <template #footer="{ ok, cancel }">
                <BButton variant="danger" @click="clear()">
                    <Fa icon="trash-alt" />
                    Clear Armor
                </BButton>
                <div class="ms-auto">
                    <BButton variant="secondary" class="me-2" @click="cancel">
                        <Fa icon="times" />
                        Cancel
                    </BButton>
                    <BButton variant="primary" @click="ok">
                        <Fa icon="save" />
                        Save
                    </BButton>
                </div>
            </template>
        </BModal>

        <!-- Browse Armors Modal -->
        <SupplementBrowserModal
            ref="browseModal"
            title="Browse Armors"
            :supplements="availableArmors"
            @select="onBrowseSelect"
            @add-new="onAddNewArmor"
            @edit="onEditArmorSupplement"
        >
            <template #preview="{ supplement }">
                <div class="mb-2">
                    <strong>Defense:</strong> {{ supplement.defense }}
                    <span class="ms-3"><strong>Soak:</strong> {{ supplement.soak }}</span>
                </div>
                <div class="mb-2">
                    <strong>Hardpoints:</strong> {{ supplement.hardpoints }}
                </div>
                <div class="mb-2">
                    <strong>Encumbrance:</strong> {{ supplement.encumbrance }}
                    <span class="ms-3"><strong>Rarity:</strong> {{ supplement.rarity }}</span>
                </div>
                <hr>
                <MarkdownBlock :text="supplement.description ?? 'No description.'" inline />
                <div class="text-end mt-auto pt-3">
                    <h5><ScopeBadge :supplement="supplement" /></h5>
                    <ReferenceBlock :reference="supplement.reference ?? ''" />
                </div>
            </template>
        </SupplementBrowserModal>

        <!-- Add/Edit Armor Supplement Modal -->
        <AddEditArmorModal
            ref="addEditArmorModal"
            @add="onArmorSupplementAdded"
            @edit="onArmorSupplementEdited"
        />

        <!-- Confirm Overwrite Modal -->
        <ConfirmOverwriteModal
            ref="confirmOverwriteModal"
            title="Overwrite Armor"
            message="Overwrite current armor values?"
            description="This will replace all fields with the selected template values. Any changes you've made will be lost."
            @confirm="onConfirmOverwrite"
        />
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss">
    #armorModal {
        .modal-content {
            overflow: initial !important;
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, ref, useTemplateRef } from 'vue';

    // Models
    import type { EoteArmor, EoteArmorRef, EoteOrGenCharacter, EoteQualityRef } from '../../../models.ts';

    // Stores
    import { useSystemStore } from '@client/lib/resource-access/stores/systems';
    import { useSupplementStore } from '@client/lib/resource-access/stores/supplements';

    // Components
    import QualityEdit from '../sub/qualityEdit.vue';
    import { BModal } from 'bootstrap-vue-next';
    import { VueBootstrapAutocomplete } from '@morgul/vue-bootstrap-autocomplete';
    import CloseButton from '@client/components/ui/closeButton.vue';
    import SupplementBrowserModal from '@client/components/character/supplementBrowserModal.vue';
    import ConfirmOverwriteModal from '@client/components/ui/confirmOverwriteModal.vue';
    import AddEditArmorModal from './addEditArmorModal.vue';
    import MarkdownBlock from '@client/components/ui/markdownBlock.vue';
    import ScopeBadge from '@client/components/character/scopeBadge.vue';
    import ReferenceBlock from '@client/components/character/referenceBlock.vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    type Events = (e : 'save', armor : EoteArmorRef) => void;

    const emit = defineEmits<Events>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const editArmor = ref({
        name: '',
        defense: 0,
        soak: 0,
        hardpoints: 0,
        encumbrance: 0,
        rarity: 0,
        attachments: [] as string[],
        qualities: [] as EoteQualityRef[],
    });

    const pendingTemplate = ref<EoteArmor | null>(null);

    const innerModal = useTemplateRef('innerModal');
    const browseModal = ref<{ show : () => void; hide : () => void } | null>(null);
    const addEditArmorModal = useTemplateRef<InstanceType<typeof AddEditArmorModal>>('addEditArmorModal');
    const confirmOverwriteModal = useTemplateRef<InstanceType<typeof ConfirmOverwriteModal>>('confirmOverwriteModal');

    const systemStore = useSystemStore();
    const supplementStore = useSupplementStore();

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const mode = computed(() => systemStore.current?.id ?? 'eote');
    const availableArmors = computed(() => supplementStore.get<EoteArmor>(mode.value, 'armor'));
    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function formHasValues() : boolean
    {
        // Don't check name since that's what the user types to search
        return !!(
            editArmor.value.defense > 0
            || editArmor.value.soak > 0
            || editArmor.value.hardpoints > 0
            || editArmor.value.encumbrance > 0
            || editArmor.value.rarity > 0
            || editArmor.value.qualities.length > 0
        );
    }

    function applyTemplate(template : EoteArmor) : void
    {
        // Cast to access qualities which may be present on supplement data
        const templateQualities = (template as EoteArmor & { qualities ?: EoteQualityRef[] }).qualities;
        editArmor.value = {
            name: template.name,
            defense: template.defense,
            soak: template.soak,
            hardpoints: template.hardpoints,
            encumbrance: template.encumbrance,
            rarity: template.rarity,
            attachments: [],
            qualities: templateQualities ? [ ...templateQualities ] : [],
        };
    }

    function onArmorTemplateHit(template : EoteArmor) : void
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

    function onBrowseSelect(template : EoteArmor) : void
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

    function onAddNewArmor() : void
    {
        browseModal.value?.hide();
        addEditArmorModal.value?.show();
    }

    function onArmorSupplementAdded(newArmor : EoteArmor) : void
    {
        // Optionally auto-apply the new armor to the form
        applyTemplate(newArmor);
    }

    function onEditArmorSupplement(armor : EoteArmor) : void
    {
        addEditArmorModal.value?.show(armor);
    }

    function onArmorSupplementEdited(updatedArmor : EoteArmor) : void
    {
        // Optionally auto-apply the updated armor to the form
        applyTemplate(updatedArmor);
    }

    function clear() : void
    {
        editArmor.value = {
            name: '',
            defense: 0,
            soak: 0,
            hardpoints: 0,
            encumbrance: 0,
            rarity: 0,
            attachments: [],
            qualities: [],
        };
    }

    function show(char : EoteOrGenCharacter) : void
    {
        // Deep copy to avoid mutating original until save
        const armor = char.details.armor;
        editArmor.value = {
            name: armor.name,
            defense: armor.defense,
            soak: armor.soak,
            hardpoints: armor.hardpoints,
            encumbrance: armor.encumbrance,
            rarity: armor.rarity,
            attachments: [ ...armor.attachments ],
            qualities: [ ...armor.qualities ],
        };

        innerModal.value?.show();
    }

    function hide() : void
    {
        clear();

        innerModal.value?.hide();
    }

    function onSave() : void
    {
        emit('save', editArmor.value as EoteArmorRef);
    }

    function onCancel() : void
    {
        pendingTemplate.value = null;
        clear();
    }

    //------------------------------------------------------------------------------------------------------------------

    defineExpose({ show, hide });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
