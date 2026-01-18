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
                        class="flex-fill pe-1 w-50"
                        label="Name"
                        label-class="fw-bold"
                        label-for="name-input"
                    >
                        <BFormInput
                            id="name-input"
                            v-model="editArmor.name"
                            type="text"
                        />
                    </BFormGroup>
                    <BFormGroup
                        class="flex-fill ps-1 w-25"
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
                </BFormRow>

                <BFormRow>
                    <BFormGroup
                        class="flex-fill pe-1 w-25"
                        label="Defense"
                        label-class="fw-bold"
                        label-for="armor-damage"
                    >
                        <BFormInput
                            id="armor-damage"
                            v-model.number="editArmor.defense"
                            type="number"
                            min="0"
                            step="0"
                        />
                    </BFormGroup>
                    <BFormGroup
                        class="flex-fill ps-1 pe-1 w-25"
                        label="Soak"
                        label-class="fw-bold"
                        label-for="armor-critical"
                    >
                        <BFormInput
                            id="armor-critical"
                            v-model.number="editArmor.soak"
                            type="number"
                            min="0"
                            step="0"
                        />
                    </BFormGroup>
                    <BFormGroup
                        class="flex-fill ps-1 pe-1 w-25"
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
                        class="flex-fill ps-1 w-25"
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

                <QualityEdit v-model:qualities="editArmor.qualities" />

                <BFormRow>
                    <BCol cols="8" offset="2">
                        <BButton variant="danger" block @click="clear()">
                            <Fa icon="trash-alt" />
                            Clear Armor
                        </BButton>
                    </BCol>
                </BFormRow>
            </div>

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

<style lang="scss">
    #armorModal {
        .modal-content {
            overflow: initial !important;
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, ref } from 'vue';

    // Models
    import type { EoteArmorRef, EoteOrGenCharacter, EoteQuality } from '../../../models.ts';

    // Stores
    import { useSystemStore } from '@client/lib/resource-access/stores/systems';
    import { useSupplementStore } from '@client/lib/resource-access/stores/supplements';

    // Components
    import QualityEdit from '../sub/qualityEdit.vue';
    import { BModal } from 'bootstrap-vue-next';
    import CloseButton from '@client/components/ui/closeButton.vue';

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
        qualities: [],
    });

    const innerModal = ref<InstanceType<typeof BModal> | null>(null);

    const systemStore = useSystemStore();
    const supplementStore = useSupplementStore();

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const mode = computed(() => systemStore.current?.id ?? 'eote');
    const qualities = computed(() => supplementStore.get<EoteQuality>(mode.value, 'quality'));

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function clear() : void
    {
        editArmor.value = {
            name: '',
            defense: 0,
            soak: 0,
            hardpoints: 0,
            encumbrance: 0,
            rarity: 0,
            qualities: [],
        };
    }

    function show(char : EoteOrGenCharacter) : void
    {
        editArmor.value = char.details.armor;

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
        clear();
    }

    //------------------------------------------------------------------------------------------------------------------

    defineExpose({ show, hide });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
