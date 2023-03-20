<!----------------------------------------------------------------------------------------------------------------------
  -- EditDefensesModal
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="edit-defenses-modal">
        <b-modal
            ref="innerModal"
            header-bg-variant="dark"
            header-text-variant="white"
            no-close-on-esc
            no-close-on-backdrop
            size="lg"
            @ok="onSave"
        >
            <!-- Modal Header -->
            <template #modal-title>
                <fa icon="file-edit"></fa>
                Edit Defenses
            </template>

            <!-- Modal Content -->
            <div class="d-flex">
                <b-form-group
                    class="flex-fill"
                    label="Soak"
                    label-class="font-weight-bold"
                    label-for="soak-input"
                >
                    <div class="d-flex">
                        <b-input-group>
                            <b-form-input id="soak-input" v-model="defenses.soak" number type="number" min="0" max="10" step="1"></b-form-input>
                            <b-input-group-append>
                                <b-button @click="defenses.soak = 0">
                                    <fa icon="times"></fa>
                                </b-button>
                            </b-input-group-append>
                        </b-input-group>
                    </div>
                </b-form-group>

                <b-form-group
                    class="flex-fill ml-2"
                    label="Melee"
                    label-class="font-weight-bold"
                    label-for="melee-input"
                >
                    <div class="d-flex">
                        <b-input-group>
                            <b-form-input id="melee-input" v-model="defenses.melee" number type="number" min="0" max="10" step="1"></b-form-input>
                            <b-input-group-append>
                                <b-button @click="defenses.melee = 0">
                                    <fa icon="times"></fa>
                                </b-button>
                            </b-input-group-append>
                        </b-input-group>
                    </div>
                </b-form-group>

                <b-form-group
                    class="flex-fill ml-2"
                    label="Ranged"
                    label-class="font-weight-bold"
                    label-for="ranged-input"
                >
                    <div class="d-flex">
                        <b-input-group>
                            <b-form-input id="ranged-input" v-model="defenses.ranged" number type="number" min="0" max="10" step="1"></b-form-input>
                            <b-input-group-append>
                                <b-button @click="defenses.ranged = 0">
                                    <fa icon="times"></fa>
                                </b-button>
                            </b-input-group-append>
                        </b-input-group>
                    </div>
                </b-form-group>
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

<script lang="ts" setup>
    import { ref } from 'vue';

    // Models
    import { EoteOrGenCharacter } from '../../../../../common/interfaces/systems/eote';

    // Components
    import { BModal } from 'bootstrap-vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Defenses
    {
        soak : number;
        melee : number;
        ranged : number;
    }

    interface Events
    {
        (e : 'save', def : Defenses) : void;
    }

    const emit = defineEmits<Events>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const defenses = ref<Defenses>({
        soak: 0,
        melee: 0,
        ranged: 0
    });

    const innerModal = ref<InstanceType<typeof BModal> | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function show(char : EoteOrGenCharacter) : void
    {
        defenses.value.soak = char.details.defenses.soak;
        defenses.value.melee = char.details.defenses.melee;
        defenses.value.ranged = char.details.defenses.ranged;

        innerModal.value.show();
    }

    function hide() : void
    {
        innerModal.value.hide();
    }

    function onSave() : void
    {
        emit('save', defenses.value);
    }

    function onCancel() : void
    {
        defenses.value.soak = 0;
        defenses.value.melee = 0;
        defenses.value.ranged = 0;
    }

    //------------------------------------------------------------------------------------------------------------------

    defineExpose({ show, hide });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
