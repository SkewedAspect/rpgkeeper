<!----------------------------------------------------------------------------------------------------------------------
  -- EditWoundsModal
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="edit-health-modal">
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
                    Edit Wounds
                    <CloseButton class="float-end" @click="cancel" />
                </h5>
            </template>

            <!-- Species Threshold Guidance -->
            <div v-if="species" class="species-statblock mb-3">
                <h6 class="text-center mb-2">
                    {{ species.name }} Starting Thresholds
                </h6>
                <div class="threshold-cards">
                    <div class="threshold-card">
                        <span class="threshold-label">Wounds</span>
                        <span class="threshold-value">{{ suggestedWoundThreshold }}</span>
                        <span class="threshold-formula">
                            {{ species.woundThreshold }} + Brawn {{ brawn }}
                        </span>
                    </div>
                    <div class="threshold-card">
                        <span class="threshold-label">Strain</span>
                        <span class="threshold-value">{{ suggestedStrainThreshold }}</span>
                        <span class="threshold-formula">
                            {{ species.strainThreshold }} + Willpower {{ willpower }}
                        </span>
                    </div>
                </div>
            </div>

            <hr v-if="species" class="mt-0 mb-3">

            <!-- Modal Content -->
            <div class="d-flex">
                <BFormGroup
                    class="flex-fill"
                    label="Wounds"
                    label-class="fw-bold"
                    label-for="wounds-input"
                >
                    <div class="d-flex">
                        <BInputGroup>
                            <BFormInput
                                id="wounds-input"
                                v-model.number="health.wounds"
                                type="number"
                                min="0"
                                max="99"
                                step="1"
                            />
                            <template #append>
                                <BButton @click="health.wounds = 0">
                                    <Fa icon="times" />
                                </BButton>
                            </template>
                        </BInputGroup>
                    </div>
                </BFormGroup>

                <BFormGroup
                    class="flex-fill ms-2"
                    label="Wound Threshold"
                    label-class="fw-bold"
                    label-for="wound-threshold-input"
                >
                    <div class="d-flex">
                        <BInputGroup>
                            <BFormInput
                                id="wound-threshold-input"
                                v-model.number="health.woundThreshold"
                                type="number"
                                min="0"
                                max="99"
                                step="1"
                            />
                            <template #append>
                                <BButton @click="health.woundThreshold = 0">
                                    <Fa icon="times" />
                                </BButton>
                            </template>
                        </BInputGroup>
                    </div>
                </BFormGroup>

                <BFormGroup
                    class="flex-fill ms-4"
                    label="Strain"
                    label-class="fw-bold"
                    label-for="strain-input"
                >
                    <div class="d-flex">
                        <BInputGroup>
                            <BFormInput
                                id="strain-input"
                                v-model.number="health.strain"
                                type="number"
                                min="0"
                                max="99"
                                step="1"
                            />
                            <template #append>
                                <BButton @click="health.strain = 0">
                                    <Fa icon="times" />
                                </BButton>
                            </template>
                        </BInputGroup>
                    </div>
                </BFormGroup>

                <BFormGroup
                    class="flex-fill ms-2"
                    label="Strain Threshold"
                    label-class="fw-bold"
                    label-for="strain-threshold-input"
                >
                    <div class="d-flex">
                        <BInputGroup>
                            <BFormInput
                                id="strain-threshold-input"
                                v-model.number="health.strainThreshold"
                                type="number"
                                min="0"
                                max="99"
                                step="1"
                            />
                            <template #append>
                                <BButton @click="health.strainThreshold = 0">
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

<style lang="scss" scoped>
    .species-statblock {
        .threshold-cards {
            display: flex;
            gap: 1rem;
            justify-content: center;

            .threshold-card {
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 0.5rem 1.5rem;
                background: var(--bs-tertiary-bg);
                border-radius: 0.25rem;
                min-width: 8rem;

                .threshold-label {
                    font-size: 0.7rem;
                    font-weight: bold;
                    text-transform: uppercase;
                }

                .threshold-value {
                    font-size: 1.4rem;
                    font-weight: bold;
                }

                .threshold-formula {
                    font-size: 0.75rem;
                    color: var(--bs-secondary-color);
                }
            }
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, ref, useTemplateRef } from 'vue';

    // Models
    import type { EoteOrGenCharacter } from '../../../models.ts';

    // Components
    import { BModal } from 'bootstrap-vue-next';
    import CloseButton from '@client/components/ui/closeButton.vue';

    // Utils
    import { useSpeciesLookup } from '../../lib/useSpeciesLookup.ts';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Wounds
    {
        wounds : number;
        woundThreshold : number;
        strain : number;
        strainThreshold : number;
    }

    type Events = (e : 'save', wounds : Wounds) => void;

    const emit = defineEmits<Events>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const health = ref({
        wounds: 0,
        woundThreshold: 0,
        strain: 0,
        strainThreshold: 0,
    });

    const speciesRef = ref<string | null>(null);
    const brawn = ref(0);
    const willpower = ref(0);

    const innerModal = useTemplateRef('innerModal');

    const { species } = useSpeciesLookup(speciesRef);

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const suggestedWoundThreshold = computed(() =>
    {
        return (species.value?.woundThreshold ?? 0) + brawn.value;
    });

    const suggestedStrainThreshold = computed(() =>
    {
        return (species.value?.strainThreshold ?? 0) + willpower.value;
    });

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function show(char : EoteOrGenCharacter) : void
    {
        health.value.wounds = char.details.health.wounds;
        health.value.woundThreshold = char.details.health.woundThreshold;
        health.value.strain = char.details.health.strain;
        health.value.strainThreshold = char.details.health.strainThreshold;

        speciesRef.value = char.details.speciesRef ?? null;
        brawn.value = char.details.characteristics.brawn;
        willpower.value = char.details.characteristics.willpower;

        innerModal.value?.show();
    }

    function hide() : void
    {
        innerModal.value?.hide();
    }

    function onSave() : void
    {
        emit('save', health.value);
    }

    function onCancel() : void
    {
        health.value.wounds = 0;
        health.value.woundThreshold = 0;
        health.value.strain = 0;
        health.value.strainThreshold = 0;
        speciesRef.value = null;
        brawn.value = 0;
        willpower.value = 0;
    }

    //------------------------------------------------------------------------------------------------------------------

    defineExpose({ show, hide });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
