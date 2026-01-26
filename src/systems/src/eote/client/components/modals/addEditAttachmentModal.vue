<!----------------------------------------------------------------------------------------------------------------------
  -- AddEditAttachmentModal
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="add-attachment-modal">
        <BModal
            ref="innerModal"
            header-bg-variant="dark"
            header-text-variant="white"
            no-close-on-esc
            no-close-on-backdrop
            size="lg"
            @ok="onSave"
            @hidden="onCancel"
        >
            <!-- Modal Header -->
            <template #header="{ cancel }">
                <h5 v-b-color-mode="'dark'" class="w-100 mb-0">
                    <Fa icon="file-edit" />
                    <span v-if="isEdit">
                        Edit
                    </span>
                    <span v-else>
                        Add
                    </span>
                    Attachment
                    <CloseButton class="float-end" @click="cancel" />
                </h5>
            </template>

            <!-- Modal Content -->
            <BFormRow>
                <BCol cols="6">
                    <BFormGroup
                        label="Name"
                        label-class="fw-bold"
                        label-for="name-input"
                    >
                        <BFormInput id="name-input" v-model="name" autocomplete="off" />
                    </BFormGroup>
                </BCol>
                <BCol cols="2">
                    <BFormGroup
                        label="Use With"
                        label-class="fw-bold"
                        label-for="usewith-select"
                    >
                        <BFormSelect id="usewith-select" v-model="useWithValue" :options="useWithOptions" />
                    </BFormGroup>
                </BCol>
                <BCol cols="2">
                    <BFormGroup
                        label="HP Required"
                        label-class="fw-bold"
                        label-for="hp-input"
                    >
                        <BFormInput id="hp-input" v-model.number="hpRequired" type="number" min="0" />
                    </BFormGroup>
                </BCol>
                <BCol cols="2">
                    <BFormGroup
                        label="Rarity"
                        label-class="fw-bold"
                        label-for="rarity-input"
                    >
                        <BFormInput id="rarity-input" v-model.number="rarity" type="number" min="0" />
                    </BFormGroup>
                </BCol>
            </BFormRow>

            <BFormGroup
                class="mt-2"
                label="Description"
                label-class="fw-bold"
                label-for="desc-input"
            >
                <MarkdownEditor v-model:text="description" />
            </BFormGroup>

            <!-- Base Modifier -->
            <BFormGroup class="mt-2" label="Base Modifier (Always Active)" label-class="fw-bold">
                <ModOptionEdit
                    v-model="baseModifier"
                    :use-with="useWithValue"
                    label="Base Modifier"
                    :removable="false"
                />
            </BFormGroup>

            <!-- Mod Options -->
            <BFormGroup class="mt-2" label="Mod Options (Activated with Advantage/Triumph)" label-class="fw-bold">
                <div class="d-flex flex-column gap-2 mb-2">
                    <ModOptionEdit
                        v-for="(_mod, index) in modOptions"
                        :key="index"
                        v-model="modOptions[index]"
                        :use-with="useWithValue"
                        :label="`Mod Option ${index + 1}`"
                        @remove="removeModOption(index)"
                    />
                </div>
                <BButton variant="secondary" size="sm" @click="addModOption">
                    <Fa icon="plus" />
                    Add Mod Option
                </BButton>
            </BFormGroup>

            <EditReference v-model:reference="reference" class="mt-2" />

            <!-- Modal Buttons -->
            <template #ok="{ ok }">
                <BButton variant="primary" @click="ok">
                    <Fa icon="save" />
                    Save
                </BButton>
            </template>
            <template #cancel="{ cancel }">
                <BButton variant="secondary" @click="cancel">
                    <Fa icon="times" />
                    Cancel
                </BButton>
            </template>
        </BModal>
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, ref, useTemplateRef } from 'vue';

    // Models
    import type { EoteAttachment, EoteModOption } from '../../../models.ts';
    import type { BoundedRange } from '@rpgk/core/utils/types';

    // Stores
    import { useSystemStore } from '@client/lib/resource-access/stores/systems';
    import { useSupplementStore } from '@client/lib/resource-access/stores/supplements';

    // Components
    import EditReference from '@client/components/character/editReference.vue';
    import MarkdownEditor from '@client/components/ui/markdownEditor.vue';
    import ModOptionEdit from '../sub/modOptionEdit.vue';
    import { BModal } from 'bootstrap-vue-next';
    import CloseButton from '@client/components/ui/closeButton.vue';

    // Utils
    import { normalizeReference } from '@client/lib/utils/misc';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Props
    {
        useWith : 'weapon' | 'armor';
    }

    const props = defineProps<Props>();

    const emit = defineEmits<{
        add : [attachment: EoteAttachment]
        edit : [attachment: EoteAttachment]
    }>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const id = ref<string | undefined>(undefined);
    const name = ref('');
    const description = ref('');
    const reference = ref('');
    const useWithValue = ref<'weapon' | 'armor' | 'any'>('weapon');
    const hpRequired = ref(0);
    const rarity = ref(0);
    const baseModifier = ref<EoteModOption>({});
    const modOptions = ref<EoteModOption[]>([]);

    const innerModal = useTemplateRef('innerModal');

    const systemStore = useSystemStore();
    const supplementStore = useSupplementStore();

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const mode = computed(() => systemStore.current?.id ?? 'eote');
    const isEdit = computed(() => id.value !== undefined);

    const useWithOptions = computed(() =>
    {
        const specificOption = props.useWith === 'weapon'
            ? { value: 'weapon', text: 'Weapon' }
            : { value: 'armor', text: 'Armor' };

        return [
            specificOption,
            { value: 'any', text: 'Any' },
        ];
    });

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function resetForm() : void
    {
        id.value = undefined;
        name.value = '';
        description.value = '';
        useWithValue.value = props.useWith;
        hpRequired.value = 0;
        rarity.value = 0;
        baseModifier.value = {};
        modOptions.value = [];
        reference.value = '';
    }

    function addModOption() : void
    {
        modOptions.value.push({});
    }

    function removeModOption(index : number) : void
    {
        modOptions.value.splice(index, 1);
    }

    function show(attachment ?: EoteAttachment) : void
    {
        if(attachment)
        {
            id.value = attachment.id;
            name.value = attachment.name;
            description.value = attachment.description;
            useWithValue.value = attachment.useWith ?? props.useWith;
            hpRequired.value = attachment.hpRequired ?? 0;
            rarity.value = attachment.rarity ?? 0;
            baseModifier.value = attachment.baseModifier ?? {};
            modOptions.value = [ ...(attachment.modOptions ?? []) ];
            reference.value = normalizeReference(attachment.reference);
        }
        else
        {
            resetForm();
        }

        innerModal.value?.show();
    }

    function hide() : void
    {
        resetForm();
        innerModal.value?.hide();
    }

    function isModOptionEmpty(mod : EoteModOption) : boolean
    {
        const hasDescription = mod.description && mod.description.trim() !== '';
        const hasStructuredMods = mod.qualities
            || mod.damageModifier !== undefined
            || mod.criticalModifier !== undefined
            || mod.encumbranceModifier !== undefined
            || mod.defenseModifier !== undefined
            || mod.soakModifier !== undefined;
        return !hasDescription && !hasStructuredMods;
    }

    async function onSave() : Promise<void>
    {
        const filteredModOptions = modOptions.value.filter((mod) => !isModOptionEmpty(mod));

        const attachmentData = {
            name: name.value,
            description: description.value,
            useWith: useWithValue.value,
            hpRequired: hpRequired.value as BoundedRange<0, 50>,
            rarity: rarity.value,
            baseModifier: baseModifier.value,
            modOptions: filteredModOptions,
            reference: reference.value,
            official: false,
        };

        if(isEdit.value)
        {
            const attachment = await supplementStore.update<EoteAttachment>(
                mode.value,
                'attachment',
                { id: id.value, ...attachmentData }
            );
            emit('edit', attachment);
        }
        else
        {
            const attachment = await supplementStore.add<EoteAttachment>(
                mode.value,
                'attachment',
                attachmentData
            );
            emit('add', attachment);
        }
    }

    function onCancel() : void
    {
        resetForm();
    }

    //------------------------------------------------------------------------------------------------------------------

    defineExpose({ show, hide });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
