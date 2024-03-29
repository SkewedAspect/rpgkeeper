<!----------------------------------------------------------------------------------------------------------------------
  -- EditArmorModal
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="edit-armor-modal">
        <b-modal
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
            <template #modal-title>
                <fa icon="file-edit"></fa>
                Edit Armor
            </template>

            <!-- Modal Content -->
            <div :class="`${ mode }-system`">
                <b-form-row>
                    <b-form-group
                        class="flex-fill pr-1 w-50"
                        label="Name"
                        label-class="font-weight-bold"
                        label-for="name-input"
                    >
                        <b-form-input
                            id="name-input"
                            v-model="editArmor.name"
                            type="text"
                        ></b-form-input>
                    </b-form-group>
                    <b-form-group
                        class="flex-fill pl-1 w-25"
                        label="Hardpoints"
                        label-class="font-weight-bold"
                        label-for="armor-hardpoints"
                    >
                        <b-form-input
                            id="armor-hardpoints"
                            v-model="editArmor.hardpoints"
                            number
                            type="number"
                            min="0"
                            step="0"
                        ></b-form-input>
                    </b-form-group>
                </b-form-row>

                <b-form-row>
                    <b-form-group
                        class="flex-fill pr-1 w-25"
                        label="Defense"
                        label-class="font-weight-bold"
                        label-for="armor-damage"
                    >
                        <b-form-input
                            id="armor-damage"
                            v-model="editArmor.defense"
                            number
                            type="number"
                            min="0"
                            step="0"
                        ></b-form-input>
                    </b-form-group>
                    <b-form-group
                        class="flex-fill pl-1 pr-1 w-25"
                        label="Soak"
                        label-class="font-weight-bold"
                        label-for="armor-critical"
                    >
                        <b-form-input
                            id="armor-critical"
                            v-model="editArmor.soak"
                            number
                            type="number"
                            min="0"
                            step="0"
                        ></b-form-input>
                    </b-form-group>
                    <b-form-group
                        class="flex-fill pl-1 pr-1 w-25"
                        label="Encumb."
                        label-class="font-weight-bold"
                        label-for="armor-encumbrance"
                    >
                        <b-form-input
                            id="armor-encumbrance"
                            v-model="editArmor.encumbrance"
                            number
                            type="number"
                            min="0"
                            step="0"
                        ></b-form-input>
                    </b-form-group>
                    <b-form-group
                        class="flex-fill pl-1 w-25"
                        label="Rarity"
                        label-class="font-weight-bold"
                        label-for="armor-rarity"
                    >
                        <b-form-input
                            id="armor-rarity"
                            v-model="editArmor.rarity"
                            number
                            type="number"
                            min="0"
                            step="0"
                        ></b-form-input>
                    </b-form-group>
                </b-form-row>

                <QualityEdit v-model:qualities="editArmor.qualities"></QualityEdit>

                <b-form-row>
                    <b-col cols="8" offset="2">
                        <b-button variant="danger" block @click="clear()">
                            <fa icon="trash-alt"></fa>
                            Clear Armor
                        </b-button>
                    </b-col>
                </b-form-row>
            </div>

            <!-- Modal Buttons -->
            <template #modal-ok>
                <fa icon="save"></fa>
                Save
            </template>
            <template #modal-cancel>
                <fa icon="times"></fa>
                Cancel
            </template>
        </b-modal>
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
    import { BModal } from 'bootstrap-vue';

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
