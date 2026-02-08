<!----------------------------------------------------------------------------------------------------------------------
  -- Edit Status Modal
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <BModal
        id="edit-status-modal"
        ref="modal"
        size="lg"
        header-bg-variant="dark"
        header-text-variant="white"
        no-close-on-backdrop
        no-close-on-esc
        @ok="onSave"
        @cancel="onCancel"
    >
        <template #header>
            <h5 class="mb-0">
                <Fa icon="heart" />
                Edit Status
            </h5>
        </template>

        <div v-if="localDetails">
            <!-- Resource Stats -->
            <h6 class="mb-3">Resources</h6>

            <BFormGroup label="Sanity" label-for="sanity-current">
                <div class="d-flex gap-2">
                    <BFormInput
                        id="sanity-current"
                        v-model.number="localDetails.sanity.value"
                        type="number"
                        min="0"
                        :max="localDetails.sanity.max"
                    />
                    <span class="align-self-center">/</span>
                    <BFormInput
                        v-model.number="localDetails.sanity.max"
                        type="number"
                        min="0"
                        max="99"
                    />
                </div>
            </BFormGroup>

            <BFormGroup label="Hit Points" label-for="hp-current">
                <div class="d-flex gap-2">
                    <BFormInput
                        id="hp-current"
                        v-model.number="localDetails.hitPoints.value"
                        type="number"
                        min="0"
                        :max="localDetails.hitPoints.max"
                    />
                    <span class="align-self-center">/</span>
                    <BFormInput
                        v-model.number="localDetails.hitPoints.max"
                        type="number"
                        min="0"
                    />
                </div>
            </BFormGroup>

            <BFormGroup label="Magic Points" label-for="mp-current">
                <div class="d-flex gap-2">
                    <BFormInput
                        id="mp-current"
                        v-model.number="localDetails.magicPoints.value"
                        type="number"
                        min="0"
                        :max="localDetails.magicPoints.max"
                    />
                    <span class="align-self-center">/</span>
                    <BFormInput
                        v-model.number="localDetails.magicPoints.max"
                        type="number"
                        min="0"
                    />
                </div>
            </BFormGroup>

            <BFormGroup label="Luck" label-for="luck-current">
                <div class="d-flex gap-2">
                    <BFormInput
                        id="luck-current"
                        v-model.number="localDetails.luck.value"
                        type="number"
                        min="0"
                        :max="localDetails.luck.max"
                    />
                    <span class="align-self-center">/</span>
                    <BFormInput
                        v-model.number="localDetails.luck.max"
                        type="number"
                        min="0"
                        max="99"
                    />
                </div>
                <template v-if="localDetails.luck.starting !== undefined">
                    <small class="text-muted">Starting: {{ localDetails.luck.starting }}</small>
                </template>
            </BFormGroup>

            <BFormGroup label="Movement Rate" label-for="movement">
                <BFormInput
                    id="movement"
                    v-model.number="localDetails.movement"
                    type="number"
                    min="0"
                />
            </BFormGroup>

            <!-- Conditions -->
            <h6 class="mb-3 mt-4">Conditions</h6>

            <BFormGroup>
                <BFormCheckbox v-model="localDetails.status.temporaryInsanity">
                    Temporary Insanity
                </BFormCheckbox>
                <BFormCheckbox v-model="localDetails.status.indefiniteInsanity">
                    Indefinite Insanity
                </BFormCheckbox>
                <BFormCheckbox v-model="localDetails.status.majorWound">
                    Major Wound
                </BFormCheckbox>
                <BFormCheckbox v-model="localDetails.status.unconscious">
                    Unconscious
                </BFormCheckbox>
                <BFormCheckbox v-model="localDetails.status.dying">
                    Dying
                </BFormCheckbox>
            </BFormGroup>
        </div>
    </BModal>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { ref } from 'vue';
    import type { BModal } from 'bootstrap-vue-next';

    // Models
    import type { Character } from '@rpgk/core';
    import type { CoCSystemDetails } from '../../../models.ts';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Events
    {
        (e : 'save', details : Partial<CoCSystemDetails>) : void;
    }

    const emit = defineEmits<Events>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const modal = ref<InstanceType<typeof BModal> | null>(null);
    const localDetails = ref<CoCSystemDetails | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function show(char : Character<CoCSystemDetails>) : void
    {
        // Deep copy to avoid mutating the original until save
        localDetails.value = JSON.parse(JSON.stringify(char.details));
        modal.value?.show();
    }

    function onSave() : void
    {
        if(localDetails.value)
        {
            emit('save', {
                sanity: localDetails.value.sanity,
                hitPoints: localDetails.value.hitPoints,
                magicPoints: localDetails.value.magicPoints,
                luck: localDetails.value.luck,
                movement: localDetails.value.movement,
                status: localDetails.value.status,
            });
        }
    }

    function onCancel() : void
    {
        localDetails.value = null;
    }

    //------------------------------------------------------------------------------------------------------------------

    defineExpose({ show });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
