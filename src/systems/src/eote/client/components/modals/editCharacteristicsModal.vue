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
            @hidden="onCancel"
        >
            <!-- Modal Header -->
            <template #header="{ cancel }">
                <h5 v-b-color-mode="'dark'" class="w-100 mb-0">
                    <Fa icon="file-edit" />
                    Edit Characteristics
                    <CloseButton class="float-end" @click="cancel" />
                </h5>
            </template>

            <!-- Species Statblock -->
            <div v-if="species" class="species-statblock mb-3">
                <h6 class="text-center mb-2">
                    {{ species.name }} Base Stats
                </h6>
                <!-- Characteristics -->
                <div class="characteristics mb-2">
                    <div
                        v-for="(value, char) in species.characteristics"
                        :key="char"
                        class="char-item"
                    >
                        <span class="char-label">{{ charAbbrev(char) }}</span>
                        <span class="char-value">{{ value }}</span>
                    </div>
                </div>
                <!-- Thresholds and XP -->
                <div class="thresholds">
                    <span class="threshold-item">
                        <b>WT:</b> {{ species.woundThreshold }}
                    </span>
                    <span class="threshold-item">
                        <b>ST:</b> {{ species.strainThreshold }}
                    </span>
                    <span class="threshold-item">
                        <b>XP:</b> {{ species.startingXP }}
                    </span>
                </div>
            </div>

            <hr v-if="species" class="mt-0 mb-3">

            <!-- Modal Content -->
            <BFormRow>
                <BCol v-for="char in characteristicNames.slice(0, 3)" :key="char">
                    <BFormGroup
                        :label="startCase(char)"
                        label-class="fw-bold"
                        :label-for="`${ char }-input`"
                    >
                        <BInputGroup>
                            <BFormInput
                                :id="`${ char }-input`"
                                v-model.number="characteristics[char]"
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
                    </BFormGroup>
                </BCol>
            </BFormRow>
            <BFormRow class="mt-2">
                <BCol v-for="char in characteristicNames.slice(3)" :key="char">
                    <BFormGroup
                        :label="startCase(char)"
                        label-class="fw-bold"
                        :label-for="`${ char }-input`"
                    >
                        <BInputGroup>
                            <BFormInput
                                :id="`${ char }-input`"
                                v-model.number="characteristics[char]"
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
                    </BFormGroup>
                </BCol>
            </BFormRow>

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
        .characteristics {
            display: flex;
            gap: 0.5rem;
            justify-content: center;

            .char-item {
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 0.25rem 0.5rem;
                background: var(--bs-tertiary-bg);
                border-radius: 0.25rem;
                min-width: 2.5rem;

                .char-label {
                    font-size: 0.7rem;
                    font-weight: bold;
                    text-transform: uppercase;
                }

                .char-value {
                    font-size: 1.1rem;
                    font-weight: bold;
                }
            }
        }

        .thresholds {
            display: flex;
            gap: 1rem;
            justify-content: center;

            .threshold-item {
                font-size: 0.9rem;
            }
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, ref, useTemplateRef } from 'vue';

    // Models
    import type { EoteCharacteristics, EoteOrGenCharacter } from '../../../models.ts';

    // Components
    import { BModal } from 'bootstrap-vue-next';
    import CloseButton from '@client/components/ui/closeButton.vue';

    // Utils
    import { charAbbrev } from '../../lib/charUtils.ts';
    import { useSpeciesLookup } from '../../lib/useSpeciesLookup.ts';
    import { startCase } from '@client/lib/utils/misc';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    const emit = defineEmits<{
        save : [bio : EoteCharacteristics];
    }>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const characteristics = ref<EoteCharacteristics>({
        brawn: 0,
        agility: 0,
        intellect: 0,
        cunning: 0,
        willpower: 0,
        presence: 0,
    });

    const speciesRef = ref<string | null>(null);
    const innerModal = useTemplateRef('innerModal');

    const { species } = useSpeciesLookup(speciesRef);

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const characteristicNames = computed(() =>
    {
        return Object.keys(characteristics.value) as (keyof EoteCharacteristics)[];
    });

    function show(char : EoteOrGenCharacter) : void
    {
        characteristics.value = {
            ...characteristics.value,
            ...char.details.characteristics,
        };

        speciesRef.value = char.details.speciesRef ?? null;

        innerModal.value?.show();
    }

    function hide() : void
    {
        innerModal.value?.hide();
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
            presence: 0,
        };
        speciesRef.value = null;
    }

    //------------------------------------------------------------------------------------------------------------------

    defineExpose({ show, hide });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
