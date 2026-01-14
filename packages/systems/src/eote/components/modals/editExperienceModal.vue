<!----------------------------------------------------------------------------------------------------------------------
  -- EditExperienceModal
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="edit-experience-modal">
        <BModal
            ref="innerModal"
            header-bg-variant="dark"
            header-text-variant="white"
            no-close-on-esc
            no-close-on-backdrop
            size="md"
            @ok="onSave"
        >
            <!-- Modal Header -->
            <template #header="{ cancel }">
                <h5 v-b-color-mode="'dark'" class="w-100 mb-0">
                    <Fa icon="file-edit" />
                    Edit Experience
                    <CloseButton class="float-end" @click="cancel" />
                </h5>
            </template>

            <!-- Modal Content -->
            <BFormGroup
                class="flex-fill"
                label="Add XP"
                label-class="fw-bold"
                label-for="add-xp-input"
            >
                <div class="d-flex flex-column">
                    <BInputGroup>
                        <BFormInput id="add-xp-input" v-model="xpToAdd" number type="number" min="0" step="1" />
                        <template #append>
                            <BButton variant="primary" @click="addXP()">
                                <Fa icon="plus" />
                                Add
                            </BButton>
                        </template>
                    </BInputGroup>
                    <p class="text-muted m-0">
                        <small>
                            To gain experience, use this form. It updates both the total, and the available. Just type
                            in the amount gained, and hit 'add'.
                        </small>
                    </p>
                </div>
            </BFormGroup>

            <hr class="mt-2 mb-2">

            <div class="d-flex">
                <BFormGroup
                    class="flex-fill"
                    label="Total"
                    label-class="fw-bold"
                    label-for="total-input"
                >
                    <div class="d-flex">
                        <BInputGroup>
                            <BFormInput
                                id="total-input"
                                v-model.number="experience.total"
                                type="number"
                                min="0"
                                step="1"
                            />
                            <template #append>
                                <BButton @click="experience.total = 0">
                                    <Fa icon="times" />
                                </BButton>
                            </template>
                        </BInputGroup>
                    </div>
                </BFormGroup>

                <BFormGroup
                    class="flex-fill ms-2"
                    label="Available"
                    label-class="fw-bold"
                    label-for="available-input"
                >
                    <div class="d-flex">
                        <BInputGroup>
                            <BFormInput
                                id="available-input"
                                v-model.number="experience.available"
                                type="number"
                                min="0"
                                step="1"
                            />
                            <template #append>
                                <BButton @click="experience.available = 0">
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

    interface Experience
    {
        total : number;
        available : number;
    }

    type Events = (e : 'save', exp : Experience) => void;

    const emit = defineEmits<Events>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const experience = ref<Experience>({
        total: 0,
        available: 0,
    });

    const xpToAdd = ref(0);
    const innerModal = ref<InstanceType<typeof BModal> | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function show(char : EoteOrGenCharacter) : void
    {
        experience.value.total = char.details.experience.total;
        experience.value.available = char.details.experience.available;

        innerModal.value.show();
    }

    function hide() : void
    {
        innerModal.value.hide();
    }

    function onSave() : void
    {
        emit('save', experience.value);
    }

    function onCancel() : void
    {
        experience.value.total = 0;
        experience.value.available = 0;
    }

    function addXP() : void
    {
        experience.value.total += xpToAdd.value;
        experience.value.available += xpToAdd.value;
    }

    //------------------------------------------------------------------------------------------------------------------

    defineExpose({ show, hide });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
