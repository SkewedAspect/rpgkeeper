<!----------------------------------------------------------------------------------------------------------------------
  -- editBackstoryModal
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="edit-backstory-modal">
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
                    Edit Backstory
                    <CloseButton class="float-end" @click="cancel" />
                </h5>
            </template>

            <!-- Modal Content -->
            <BFormGroup
                id="backstory-desc-input-group"
                label="Description"
                label-for="backstory-desc-input"
            >
                <BFormTextarea id="backstory-desc-input" v-model="innerBackstory.description" rows="3" />
            </BFormGroup>
            <div class="d-flex gap-2 mt-2">
                <BFormGroup
                    id="ideology-input-group"
                    label="Ideology"
                    label-for="ideology-input"
                    class="flex-fill"
                >
                    <BFormTextarea id="ideology-input" v-model="innerBackstory.ideology" rows="2" />
                </BFormGroup>
                <BFormGroup
                    id="significant-people-input-group"
                    label="Significant People"
                    label-for="significant-people-input"
                    class="flex-fill"
                >
                    <BFormTextarea id="significant-people-input" v-model="innerBackstory.significantPeople" rows="2" />
                </BFormGroup>
            </div>
            <div class="d-flex gap-2 mt-2">
                <BFormGroup
                    id="meaningful-locations-input-group"
                    label="Meaningful Locations"
                    label-for="meaningful-locations-input"
                    class="flex-fill"
                >
                    <BFormTextarea
                        id="meaningful-locations-input"
                        v-model="innerBackstory.meaningfulLocations"
                        rows="2"
                    />
                </BFormGroup>
                <BFormGroup
                    id="treasured-possession-input-group"
                    label="Treasured Possession"
                    label-for="treasured-possession-input"
                    class="flex-fill"
                >
                    <BFormTextarea
                        id="treasured-possession-input"
                        v-model="innerBackstory.treasuredPossession"
                        rows="2"
                    />
                </BFormGroup>
            </div>
            <div class="d-flex gap-2 mt-2">
                <BFormGroup
                    id="traits-input-group"
                    label="Traits"
                    label-for="traits-input"
                    class="flex-fill"
                >
                    <BFormTextarea id="traits-input" v-model="innerBackstory.traits" rows="2" />
                </BFormGroup>
                <BFormGroup
                    id="injuries-input-group"
                    label="Injuries"
                    label-for="injuries-input"
                    class="flex-fill"
                >
                    <BFormTextarea id="injuries-input" v-model="innerBackstory.injuries" rows="2" />
                </BFormGroup>
            </div>
            <div class="d-flex gap-2 mt-2">
                <BFormGroup
                    id="phobias-input-group"
                    label="Phobias"
                    label-for="phobias-input"
                    class="flex-fill"
                >
                    <BFormTextarea id="phobias-input" v-model="innerBackstory.phobias" rows="2" />
                </BFormGroup>
                <BFormGroup
                    id="arcane-tomes-input-group"
                    label="Arcane Tomes"
                    label-for="arcane-tomes-input"
                    class="flex-fill"
                >
                    <BFormTextarea id="arcane-tomes-input" v-model="innerBackstory.arcaneTomes" rows="2" />
                </BFormGroup>
            </div>
            <BFormGroup
                id="encounters-input-group"
                label="Encounters"
                label-for="encounters-input"
                class="mt-2"
            >
                <BFormTextarea id="encounters-input" v-model="innerBackstory.encounters" rows="2" />
            </BFormGroup>

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

    // Interfaces
    import type { Character } from '@rpgk/core';
    import type { CoCSystemDetails, CoCBackstory } from '../../../models.ts';

    // Components
    import { BModal } from 'bootstrap-vue-next';
    import CloseButton from '@client/components/ui/closeButton.vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    type Events = (e : 'save', backstory : CoCBackstory) => void;

    const emit = defineEmits<Events>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const innerBackstory = ref<CoCBackstory>({
        description: '',
        ideology: '',
        significantPeople: '',
        meaningfulLocations: '',
        treasuredPossession: '',
        traits: '',
        injuries: '',
        phobias: '',
        arcaneTomes: '',
        encounters: '',
    });

    const innerModal = ref<InstanceType<typeof BModal> | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function show(char : Character<CoCSystemDetails>) : void
    {
        innerBackstory.value.description = char.details.backstory.description ?? '';
        innerBackstory.value.ideology = char.details.backstory.ideology ?? '';
        innerBackstory.value.significantPeople = char.details.backstory.significantPeople ?? '';
        innerBackstory.value.meaningfulLocations = char.details.backstory.meaningfulLocations ?? '';
        innerBackstory.value.treasuredPossession = char.details.backstory.treasuredPossession ?? '';
        innerBackstory.value.traits = char.details.backstory.traits ?? '';
        innerBackstory.value.injuries = char.details.backstory.injuries ?? '';
        innerBackstory.value.phobias = char.details.backstory.phobias ?? '';
        innerBackstory.value.arcaneTomes = char.details.backstory.arcaneTomes ?? '';
        innerBackstory.value.encounters = char.details.backstory.encounters ?? '';

        innerModal.value?.show();
    }

    function hide() : void
    {
        innerModal.value?.hide();
    }

    function onSave() : void
    {
        emit('save', innerBackstory.value);
    }

    function onCancel() : void
    {
        innerBackstory.value.description = '';
        innerBackstory.value.ideology = '';
        innerBackstory.value.significantPeople = '';
        innerBackstory.value.meaningfulLocations = '';
        innerBackstory.value.treasuredPossession = '';
        innerBackstory.value.traits = '';
        innerBackstory.value.injuries = '';
        innerBackstory.value.phobias = '';
        innerBackstory.value.arcaneTomes = '';
        innerBackstory.value.encounters = '';
    }

    //------------------------------------------------------------------------------------------------------------------

    defineExpose({ show, hide });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
