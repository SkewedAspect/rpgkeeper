<!----------------------------------------------------------------------------------------------------------------------
  -- EditCharacteristicsModal
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="edit-characteristics-modal">
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
                Edit Characteristics
            </template>

            <!-- Modal Content -->
            <b-form-row>
                <b-col v-for="char in characteristicNames.slice(0, 3)" :key="char">
                    <b-form-group
                        :label="startCase(char)"
                        label-class="font-weight-bold"
                        :label-for="`${ char }-input`"
                    >
                        <div class="d-flex">
                            <b-input-group>
                                <b-form-input
                                    :id="`${ char }-input`"
                                    v-model="characteristics[char]"
                                    number
                                    type="number"
                                    step="1"
                                    min="0"
                                    max="99"
                                ></b-form-input>
                                <b-input-group-append>
                                    <b-button @click="characteristics[char] = 0">
                                        <fa icon="undo"></fa>
                                    </b-button>
                                </b-input-group-append>
                            </b-input-group>
                        </div>
                    </b-form-group>
                </b-col>
            </b-form-row>
            <b-form-row>
                <b-col v-for="char in characteristicNames.slice(3)" :key="char">
                    <b-form-group
                        :label="formatCharName(char)"
                        label-class="font-weight-bold"
                        :label-for="`${ char }-input`"
                    >
                        <div class="d-flex">
                            <b-input-group>
                                <b-form-input
                                    :id="`${ char }-input`"
                                    v-model="characteristics[char]"
                                    number
                                    type="number"
                                    step="1"
                                    min="0"
                                    max="99"
                                ></b-form-input>
                                <b-input-group-append>
                                    <b-button @click="characteristics[char] = 0">
                                        <fa icon="undo"></fa>
                                    </b-button>
                                </b-input-group-append>
                            </b-input-group>
                        </div>
                    </b-form-group>
                </b-col>
            </b-form-row>

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
    import { computed, ref } from 'vue';

    // Models
    import { EoteCharacteristics, EoteOrGenCharacter } from '../../../../../common/interfaces/systems/eote';

    // Utils
    import { startCase } from '../../../../../common/utils/misc';

    // Components
    import { BModal } from 'bootstrap-vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Events
    {
        (e : 'save', bio : EoteCharacteristics) : void;
    }

    const emit = defineEmits<Events>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const characteristics = ref<EoteCharacteristics>({
        brawn: 0,
        agility: 0,
        intellect: 0,
        cunning: 0,
        willpower: 0,
        presence: 0
    });

    const innerModal = ref<InstanceType<typeof BModal> | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const characteristicNames = computed(() =>
    {
        return Object.keys(characteristics.value);
    });

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function formatCharName(text) : string
    {
        return startCase(text);
    }

    function show(char : EoteOrGenCharacter) : void
    {
        characteristics.value = {
            ...characteristics.value,
            ...char.details.characteristics
        };

        innerModal.value.show();
    }

    function hide() : void
    {
        innerModal.value.hide();
    }

    function onSave() : void
    {
        emit('save', characteristics.value);
    }

    function onCancel() : void
    {
        characteristics.value = {
            brawn: 0,
            agility: 0,
            intellect: 0,
            cunning: 0,
            willpower: 0,
            presence: 0
        };
    }

    //------------------------------------------------------------------------------------------------------------------

    defineExpose({ show, hide });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
