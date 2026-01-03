<!----------------------------------------------------------------------------------------------------------------------
  -- EditCharacteristicsModal
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="edit-characteristics-modal">
        <BModal
            ref="innerModal"
            header-bg-variant="dark"
            header-text-variant="white"
            no-close-on-esc
            no-close-on-backdrop
            size="lg"
            @ok="onSave"
        >
            <!-- Modal Header -->
            <template #header="{ cancel }">
                <h5 v-b-color-mode="'dark'" class="w-100 mb-0">
                    <Fa icon="file-edit" />
                    Edit Characteristics
                    <CloseButton class="float-end" @click="cancel" />
                </h5>
            </template>

            <!-- Modal Content -->
            <div class="d-flex flex-wrap gap-2">
                <div v-for="char in characteristicNames" :key="char">
                    <BFormGroup
                        :label="formatCharName(char)"
                        label-class="fw-bold"
                        :label-for="`${ char }-input`"
                    >
                        <div class="d-flex">
                            <BInputGroup>
                                <BFormInput
                                    :id="`${ char }-input`"
                                    v-model="characteristics[char]"
                                    number
                                    type="number"
                                    step="1"
                                    min="0"
                                    max="99"
                                />
                                <template #append>
                                    <BButton @click="characteristics[char] = 0">
                                        <Fa icon="undo" />
                                    </BButton>
                                </template>
                            </BInputGroup>
                        </div>
                    </BFormGroup>
                </div>
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

<script lang="ts" setup>
    import { computed, ref } from 'vue';

    // Models
    import type { Character } from '@rpgk/core';
    import type {
        CoCCharacteristics,
        CoCSystemDetails,
    } from '@rpgk/core/models/systems';

    // Utils
    import { startCase } from '@client/lib/utils/misc';

    // Components
    import { BModal } from 'bootstrap-vue-next';
    import CloseButton from '@client/components/ui/closeButton.vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    type Events = (e : 'save', bio : CoCCharacteristics) => void;

    const emit = defineEmits<Events>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const characteristics = ref<CoCCharacteristics>({
        strength: 0,
        dexterity: 0,
        intelligence: 0,
        constitution: 0,
        appearance: 0,
        power: 0,
        size: 0,
        education: 0,
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

    function show(char : Character<CoCSystemDetails>) : void
    {
        characteristics.value = {
            ...characteristics.value,
            ...char.details.characteristics,
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
            appearance: 0,
            constitution: 0,
            dexterity: 0,
            education: 0,
            intelligence: 0,
            power: 0,
            size: 0,
            strength: 0,
        };
    }

    //------------------------------------------------------------------------------------------------------------------

    defineExpose({ show, hide });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
