<!----------------------------------------------------------------------------------------------------------------------
  -- EditDefensesModal
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="edit-defenses-modal">
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
                    Edit Defenses
                    <CloseButton class="float-end" @click="cancel" />
                </h5>
            </template>

            <!-- Modal Content -->
            <div class="d-flex">
                <BFormGroup
                    class="flex-fill"
                    label="Soak"
                    label-class="fw-bold"
                    label-for="soak-input"
                >
                    <div class="d-flex">
                        <BInputGroup>
                            <BFormInput
                                id="soak-input"
                                v-model.number="defenses.soak"
                                type="number"
                                min="0"
                                max="10"
                                step="1"
                            />
                            <template #append>
                                <BButton @click="defenses.soak = 0">
                                    <Fa icon="times" />
                                </BButton>
                            </template>
                        </BInputGroup>
                    </div>
                </BFormGroup>

                <BFormGroup
                    class="flex-fill ms-2"
                    label="Melee"
                    label-class="fw-bold"
                    label-for="melee-input"
                >
                    <div class="d-flex">
                        <BInputGroup>
                            <BFormInput
                                id="melee-input"
                                v-model.number="defenses.melee"
                                type="number"
                                min="0"
                                max="10"
                                step="1"
                            />
                            <template #append>
                                <BButton @click="defenses.melee = 0">
                                    <Fa icon="times" />
                                </BButton>
                            </template>
                        </BInputGroup>
                    </div>
                </BFormGroup>

                <BFormGroup
                    class="flex-fill ms-2"
                    label="Ranged"
                    label-class="fw-bold"
                    label-for="ranged-input"
                >
                    <div class="d-flex">
                        <BInputGroup>
                            <BFormInput
                                id="ranged-input"
                                v-model.number="defenses.ranged"
                                type="number"
                                min="0"
                                max="10"
                                step="1"
                            />
                            <template #append>
                                <BButton @click="defenses.ranged = 0">
                                    <Fa icon="times" />
                                </BButton>
                            </template>
                        </BInputGroup>
                    </div>
                </BFormGroup>
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
    import { ref } from 'vue';

    // Models
    import type { EoteOrGenCharacter } from '../../models.ts';

    // Components
    import { BModal } from 'bootstrap-vue-next';
    import CloseButton from '@client/components/ui/closeButton.vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Defenses
    {
        soak : number;
        melee : number;
        ranged : number;
    }

    type Events = (e : 'save', def : Defenses) => void;

    const emit = defineEmits<Events>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const defenses = ref<Defenses>({
        soak: 0,
        melee: 0,
        ranged: 0,
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
