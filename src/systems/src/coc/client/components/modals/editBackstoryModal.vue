<!----------------------------------------------------------------------------------------------------------------------
  -- Edit Backstory Modal
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <BModal
        id="edit-backstory-modal"
        ref="modal"
        size="xl"
        header-bg-variant="dark"
        header-text-variant="white"
        no-close-on-backdrop
        no-close-on-esc
        @ok="onSave"
        @cancel="onCancel"
    >
        <template #header>
            <h5 class="mb-0">
                <Fa icon="book-open" />
                Edit Backstory & Investigation
            </h5>
        </template>

        <div v-if="localBackstory">
            <h6 class="mb-3">Personal Background</h6>

            <BFormGroup label="Personal Description" label-for="description">
                <BFormTextarea
                    id="description"
                    v-model="localBackstory.description"
                    rows="3"
                    placeholder="Describe your investigator..."
                />
            </BFormGroup>

            <BFormGroup label="Ideology / Beliefs" label-for="ideology">
                <BFormTextarea
                    id="ideology"
                    v-model="localBackstory.ideology"
                    rows="2"
                    placeholder="What do you believe in?"
                />
            </BFormGroup>

            <BFormGroup label="Significant People" label-for="significant-people">
                <BFormTextarea
                    id="significant-people"
                    v-model="localBackstory.significantPeople"
                    rows="2"
                    placeholder="Who is important to you?"
                />
            </BFormGroup>

            <BFormGroup label="Meaningful Locations" label-for="locations">
                <BFormTextarea
                    id="locations"
                    v-model="localBackstory.meaningfulLocations"
                    rows="2"
                    placeholder="What places matter to you?"
                />
            </BFormGroup>

            <BFormGroup label="Treasured Possessions" label-for="possessions">
                <BFormTextarea
                    id="possessions"
                    v-model="localBackstory.treasuredPossession"
                    rows="2"
                    placeholder="What do you treasure?"
                />
            </BFormGroup>

            <BFormGroup label="Traits" label-for="traits">
                <BFormTextarea
                    id="traits"
                    v-model="localBackstory.traits"
                    rows="2"
                    placeholder="Describe your character traits..."
                />
            </BFormGroup>

            <hr class="my-4">

            <h6 class="mb-3">
                <Fa icon="search" />
                Investigation Notes
            </h6>

            <BFormGroup label="Scars & Injuries" label-for="injuries">
                <BFormTextarea
                    id="injuries"
                    v-model="localBackstory.injuries"
                    rows="2"
                    placeholder="Record scars and injuries sustained..."
                />
            </BFormGroup>

            <BFormGroup label="Phobias & Manias" label-for="phobias">
                <BFormTextarea
                    id="phobias"
                    v-model="localBackstory.phobias"
                    rows="2"
                    placeholder="Document phobias and manias developed..."
                />
            </BFormGroup>

            <BFormGroup label="Arcane Tomes & Spells" label-for="tomes">
                <BFormTextarea
                    id="tomes"
                    v-model="localBackstory.arcaneTomes"
                    rows="3"
                    placeholder="List tomes read and spells learned..."
                />
            </BFormGroup>

            <BFormGroup label="Encounters with Strange Entities" label-for="encounters">
                <BFormTextarea
                    id="encounters"
                    v-model="localBackstory.encounters"
                    rows="3"
                    placeholder="Record encounters with otherworldly beings..."
                />
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
    import type { CoCBackstory, CoCSystemDetails } from '../../../models.ts';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Events
    {
        (e : 'save', backstory : CoCBackstory) : void;
    }

    const emit = defineEmits<Events>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const modal = ref<InstanceType<typeof BModal> | null>(null);
    const localBackstory = ref<CoCBackstory | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function show(char : Character<CoCSystemDetails>) : void
    {
        // Deep copy to avoid mutating the original until save
        localBackstory.value = JSON.parse(JSON.stringify(char.details.backstory));
        modal.value?.show();
    }

    function onSave() : void
    {
        if(localBackstory.value)
        {
            emit('save', localBackstory.value);
        }
    }

    function onCancel() : void
    {
        localBackstory.value = null;
    }

    //------------------------------------------------------------------------------------------------------------------

    defineExpose({ show });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
