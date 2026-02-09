<!----------------------------------------------------------------------------------------------------------------------
  -- EditStatsModal
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="edit-stats-modal">
        <BModal
            ref="innerModal"
            header-bg-variant="dark"
            header-text-variant="white"
            no-close-on-esc
            no-close-on-backdrop
            size="lg"
            @ok="onSave"
            @cancel="onCancel"
        >
            <!-- Modal Header -->
            <template #header="{ cancel }">
                <h5 v-b-color-mode="'dark'" class="w-100 mb-0">
                    <Fa icon="file-edit" />
                    Edit Stats
                    <CloseButton class="float-end" @click="cancel" />
                </h5>
            </template>

            <!-- Modal Content -->
            <div class="d-flex gap-2">
                <BFormGroup
                    label="Hit Points"
                    label-class="fw-bold"
                    class="flex-fill"
                >
                    <div class="d-flex gap-2">
                        <BFormInput
                            id="hp-value-input"
                            v-model="hitPoints.value"
                            number
                            type="number"
                            step="1"
                            min="0"
                            max="999"
                            placeholder="Value"
                        />
                        <BFormInput
                            id="hp-max-input"
                            v-model="hitPoints.max"
                            number
                            type="number"
                            step="1"
                            min="0"
                            max="999"
                            placeholder="Max"
                        />
                    </div>
                </BFormGroup>
                <BFormGroup
                    label="Magic Points"
                    label-class="fw-bold"
                    class="flex-fill"
                >
                    <div class="d-flex gap-2">
                        <BFormInput
                            id="mp-value-input"
                            v-model="magicPoints.value"
                            number
                            type="number"
                            step="1"
                            min="0"
                            max="999"
                            placeholder="Value"
                        />
                        <BFormInput
                            id="mp-max-input"
                            v-model="magicPoints.max"
                            number
                            type="number"
                            step="1"
                            min="0"
                            max="999"
                            placeholder="Max"
                        />
                    </div>
                </BFormGroup>
            </div>
            <div class="d-flex gap-2 mt-2">
                <BFormGroup
                    label="Sanity"
                    label-class="fw-bold"
                    class="flex-fill"
                >
                    <div class="d-flex gap-2">
                        <BFormInput
                            id="sanity-value-input"
                            v-model="sanity.value"
                            number
                            type="number"
                            step="1"
                            min="0"
                            max="99"
                            placeholder="Value"
                        />
                        <BFormInput
                            id="sanity-max-input"
                            v-model="sanity.max"
                            number
                            type="number"
                            step="1"
                            min="0"
                            max="99"
                            placeholder="Max"
                        />
                    </div>
                </BFormGroup>
                <BFormGroup
                    label="Luck"
                    label-class="fw-bold"
                    class="flex-fill"
                >
                    <div class="d-flex gap-2">
                        <BFormInput
                            id="luck-value-input"
                            v-model="luck.value"
                            number
                            type="number"
                            step="1"
                            min="0"
                            max="99"
                            placeholder="Value"
                        />
                        <BFormInput
                            id="luck-max-input"
                            v-model="luck.max"
                            number
                            type="number"
                            step="1"
                            min="0"
                            max="99"
                            placeholder="Max"
                        />
                        <BFormInput
                            id="luck-starting-input"
                            v-model="luck.starting"
                            number
                            type="number"
                            step="1"
                            min="0"
                            max="99"
                            placeholder="Starting"
                        />
                    </div>
                </BFormGroup>
            </div>
            <div class="d-flex gap-2 mt-2">
                <BFormGroup
                    label="Movement"
                    label-class="fw-bold"
                >
                    <BFormInput
                        id="movement-input"
                        v-model="movement"
                        number
                        type="number"
                        step="1"
                        min="0"
                        max="99"
                    />
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
    import type { Character } from '@rpgk/core';
    import type { CoCStat, CoCSystemDetails } from '../../../models.ts';

    // Components
    import { BModal } from 'bootstrap-vue-next';
    import CloseButton from '@client/components/ui/closeButton.vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface CoCStatsPayload
    {
        hitPoints : CoCStat;
        magicPoints : CoCStat;
        sanity : CoCStat;
        luck : CoCStat;
        movement : number;
    }

    type Events = (e : 'save', stats : CoCStatsPayload) => void;

    const emit = defineEmits<Events>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const hitPoints = ref<CoCStat>({ value: 0, max: 0 });
    const magicPoints = ref<CoCStat>({ value: 0, max: 0 });
    const sanity = ref<CoCStat>({ value: 0, max: 0 });
    const luck = ref<CoCStat>({ value: 0, max: 0, starting: 0 });
    const movement = ref(0);

    const innerModal = ref<InstanceType<typeof BModal> | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function show(char : Character<CoCSystemDetails>) : void
    {
        hitPoints.value = { ...char.details.hitPoints };
        magicPoints.value = { ...char.details.magicPoints };
        sanity.value = { ...char.details.sanity };
        luck.value = { ...char.details.luck };
        movement.value = char.details.movement;

        innerModal.value?.show();
    }

    function hide() : void
    {
        innerModal.value?.hide();
    }

    function onSave() : void
    {
        emit('save', {
            hitPoints: hitPoints.value,
            magicPoints: magicPoints.value,
            sanity: sanity.value,
            luck: luck.value,
            movement: movement.value,
        });
    }

    function onCancel() : void
    {
        hitPoints.value = { value: 0, max: 0 };
        magicPoints.value = { value: 0, max: 0 };
        sanity.value = { value: 0, max: 0 };
        luck.value = { value: 0, max: 0, starting: 0 };
        movement.value = 0;
    }

    //------------------------------------------------------------------------------------------------------------------

    defineExpose({ show, hide });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
