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
                    <fa icon="file-edit"></fa>
                    Edit Armor
                    <CloseButton class="float-end" @click="cancel"></CloseButton>
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
                        ></BFormInput>
                    </BFormGroup>
                    <BFormGroup
                        class="flex-fill ps-1 w-25"
                        label="Hardpoints"
                        label-class="fw-bold"
                        label-for="armor-hardpoints"
                    >
                        <BFormInput
                            id="armor-hardpoints"
                            v-model="editArmor.hardpoints"
                            number
                            type="number"
                            min="0"
                            step="0"
                        ></BFormInput>
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
                            v-model="editArmor.defense"
                            number
                            type="number"
                            min="0"
                            step="0"
                        ></BFormInput>
                    </BFormGroup>
                    <BFormGroup
                        class="flex-fill ps-1 pe-1 w-25"
                        label="Soak"
                        label-class="fw-bold"
                        label-for="armor-critical"
                    >
                        <BFormInput
                            id="armor-critical"
                            v-model="editArmor.soak"
                            number
                            type="number"
                            min="0"
                            step="0"
                        ></BFormInput>
                    </BFormGroup>
                    <BFormGroup
                        class="flex-fill ps-1 pe-1 w-25"
                        label="Encumb."
                        label-class="fw-bold"
                        label-for="armor-encumbrance"
                    >
                        <BFormInput
                            id="armor-encumbrance"
                            v-model="editArmor.encumbrance"
                            number
                            type="number"
                            min="0"
                            step="0"
                        ></BFormInput>
                    </BFormGroup>
                    <BFormGroup
                        class="flex-fill ps-1 w-25"
                        label="Rarity"
                        label-class="fw-bold"
                        label-for="armor-rarity"
                    >
                        <BFormInput
                            id="armor-rarity"
                            v-model="editArmor.rarity"
                            number
                            type="number"
                            min="0"
                            step="0"
                        ></BFormInput>
                    </BFormGroup>
                </BFormRow>

                <QualityEdit v-model:qualities="editArmor.qualities"></QualityEdit>

                <BFormRow>
                    <BCol cols="8" offset="2">
                        <BButton variant="danger" block @click="clear()">
                            <fa icon="trash-alt"></fa>
                            Clear Armor
                        </BButton>
                    </BCol>
                </BFormRow>
            </div>

            <!-- Modal Buttons -->
            <template #ok="{ ok }">
                <BButton variant="primary" @click="ok">
                    <fa icon="save"></fa>
                    Save
                </BButton>
            </template>
            <template #cancel="{ cancel }">
                <BButton variant="secondary" @click="cancel">
                    <fa icon="times"></fa>
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
    import { EoteArmorRef, EoteOrGenCharacter } from '../../../../../common/interfaces/systems/eote';

    // Managers
    import eoteMan from '../../../../lib/managers/systems/eote';

    // Components
    import QualityEdit from '../components/qualityEdit.vue';
    import { BModal } from 'bootstrap-vue-next';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Events
    {
        (e : 'save', armor : EoteArmorRef) : void;
    }

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
        qualities: []
    });

    const innerModal = ref<InstanceType<typeof BModal> | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const mode = computed(() => eoteMan.mode);
    const qualities = computed(() => eoteMan.qualities);

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function clear()
    {
        editArmor.value = {
            name: '',
            defense: 0,
            soak: 0,
            hardpoints: 0,
            encumbrance: 0,
            rarity: 0,
            qualities: []
        };
    }

    function show(char : EoteOrGenCharacter) : void
    {
        editArmor.value = char.details.armor;

        innerModal.value.show();
    }

    function hide() : void
    {
        clear();

        innerModal.value.hide();
    }

    async function onSave()
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
