<!----------------------------------------------------------------------------------------------------------------------
  -- AddEditArmorModal
  --
  -- Modal for creating or editing armor supplements in the database.
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="add-armor-modal">
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
                    Armor
                    <CloseButton class="float-end" @click="cancel" />
                </h5>
            </template>

            <!-- Modal Content -->
            <BFormRow>
                <BCol cols="8">
                    <BFormGroup
                        label="Name"
                        label-class="fw-bold"
                        label-for="name-input"
                    >
                        <BFormInput id="name-input" v-model="name" autocomplete="off" />
                    </BFormGroup>
                </BCol>
                <BCol cols="4">
                    <BFormGroup
                        label="Hardpoints"
                        label-class="fw-bold"
                        label-for="hardpoints-input"
                    >
                        <BFormInput
                            id="hardpoints-input"
                            v-model.number="hardpoints"
                            type="number"
                            min="0"
                            step="1"
                        />
                    </BFormGroup>
                </BCol>
            </BFormRow>

            <BFormRow>
                <BCol cols="3">
                    <BFormGroup
                        label="Defense"
                        label-class="fw-bold"
                        label-for="defense-input"
                    >
                        <BFormInput
                            id="defense-input"
                            v-model.number="defense"
                            type="number"
                            min="0"
                            step="1"
                        />
                    </BFormGroup>
                </BCol>
                <BCol cols="3">
                    <BFormGroup
                        label="Soak"
                        label-class="fw-bold"
                        label-for="soak-input"
                    >
                        <BFormInput
                            id="soak-input"
                            v-model.number="soak"
                            type="number"
                            min="0"
                            step="1"
                        />
                    </BFormGroup>
                </BCol>
                <BCol cols="3">
                    <BFormGroup
                        label="Encumb."
                        label-class="fw-bold"
                        label-for="encumbrance-input"
                    >
                        <BFormInput
                            id="encumbrance-input"
                            v-model.number="encumbrance"
                            type="number"
                            min="0"
                            step="1"
                        />
                    </BFormGroup>
                </BCol>
                <BCol cols="3">
                    <BFormGroup
                        label="Rarity"
                        label-class="fw-bold"
                        label-for="rarity-input"
                    >
                        <BFormInput
                            id="rarity-input"
                            v-model.number="rarity"
                            type="number"
                            min="0"
                            step="1"
                        />
                    </BFormGroup>
                </BCol>
            </BFormRow>

            <BFormGroup
                label="Description"
                label-class="fw-bold"
                label-for="description-input"
            >
                <MarkdownEditor v-model:text="description" height="150px" />
            </BFormGroup>

            <EditReference v-model:reference="reference" />

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
    import { computed, ref } from 'vue';

    // Models
    import type { EoteArmor } from '../../../models.ts';

    // Stores
    import { useSystemStore } from '@client/lib/resource-access/stores/systems';
    import { useSupplementStore } from '@client/lib/resource-access/stores/supplements';

    // Components
    import EditReference from '@client/components/character/editReference.vue';
    import MarkdownEditor from '@client/components/ui/markdownEditor.vue';
    import { BModal } from 'bootstrap-vue-next';
    import CloseButton from '@client/components/ui/closeButton.vue';

    // Utils
    import { normalizeReference } from '@client/lib/utils/misc';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    const emit = defineEmits<{
        add : [armor : EoteArmor]
        edit : [armor : EoteArmor]
    }>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const id = ref<string | undefined>(undefined);
    const name = ref('');
    const defense = ref(0);
    const soak = ref(0);
    const hardpoints = ref(0);
    const encumbrance = ref(0);
    const rarity = ref(0);
    const restricted = ref(false);
    const description = ref('');
    const reference = ref('');

    const innerModal = ref<InstanceType<typeof BModal> | null>(null);

    const systemStore = useSystemStore();
    const supplementStore = useSupplementStore();

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const mode = computed(() => systemStore.current?.id ?? 'eote');
    const isEdit = computed(() => id.value !== undefined);

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function clearForm() : void
    {
        id.value = undefined;
        name.value = '';
        defense.value = 0;
        soak.value = 0;
        hardpoints.value = 0;
        encumbrance.value = 0;
        rarity.value = 0;
        restricted.value = false;
        description.value = '';
        reference.value = '';
    }

    function show(armor ?: EoteArmor) : void
    {
        if(armor)
        {
            id.value = armor.id;
            name.value = armor.name;
            defense.value = armor.defense;
            soak.value = armor.soak;
            hardpoints.value = armor.hardpoints;
            encumbrance.value = armor.encumbrance;
            rarity.value = armor.rarity;
            restricted.value = armor.restricted ?? false;
            description.value = armor.description;
            reference.value = normalizeReference(armor.reference);
        }
        else
        {
            clearForm();
        }

        innerModal.value?.show();
    }

    function hide() : void
    {
        innerModal.value?.hide();
    }

    async function onSave() : Promise<void>
    {
        const armorData = {
            name: name.value,
            defense: defense.value,
            soak: soak.value,
            hardpoints: hardpoints.value,
            encumbrance: encumbrance.value,
            rarity: rarity.value,
            restricted: restricted.value,
            description: description.value,
            reference: reference.value,
            qualities: [],
            official: false,
        };

        if(isEdit.value)
        {
            const armor = await supplementStore.update<EoteArmor>(mode.value, 'armor', {
                id: id.value,
                ...armorData,
            });

            emit('edit', armor);
        }
        else
        {
            const armor = await supplementStore.add<EoteArmor>(mode.value, 'armor', armorData);
            emit('add', armor);
        }
    }

    function onCancel() : void
    {
        clearForm();
    }

    //------------------------------------------------------------------------------------------------------------------

    defineExpose({ show, hide });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
