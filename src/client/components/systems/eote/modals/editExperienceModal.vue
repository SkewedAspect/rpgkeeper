<!----------------------------------------------------------------------------------------------------------------------
  -- EditExperienceModal
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="edit-experience-modal">
        <b-modal
            ref="innerModal"
            header-bg-variant="dark"
            header-text-variant="white"
            no-close-on-esc
            no-close-on-backdrop
            size="md"
            @ok="onSave"
        >
            <!-- Modal Header -->
            <template #modal-title>
                <fa icon="file-edit"></fa>
                Edit Experience
            </template>

            <!-- Modal Content -->
            <b-form-group
                class="flex-fill"
                label="Add XP"
                label-class="font-weight-bold"
                label-for="add-xp-input"
            >
                <div class="d-flex flex-column">
                    <b-input-group>
                        <b-form-input id="add-xp-input" v-model="xpToAdd" number type="number" min="0" step="1"></b-form-input>
                        <b-input-group-append>
                            <b-button variant="primary" @click="addXP()">
                                <fa icon="plus"></fa>
                                Add
                            </b-button>
                        </b-input-group-append>
                    </b-input-group>
                    <p class="text-muted m-0">
                        <small>
                            To gain experience, use this form. It updates both the total, and the available. Just type
                            in the amount gained, and hit 'add'.
                        </small>
                    </p>
                </div>
            </b-form-group>

            <hr class="mt-2 mb-2" />

            <div class="d-flex">
                <b-form-group
                    class="flex-fill"
                    label="Total"
                    label-class="font-weight-bold"
                    label-for="total-input"
                >
                    <div class="d-flex">
                        <b-input-group>
                            <b-form-input id="total-input" v-model="experience.total" number type="number" min="0" step="1"></b-form-input>
                            <b-input-group-append>
                                <b-button @click="experience.total = 0">
                                    <fa icon="times"></fa>
                                </b-button>
                            </b-input-group-append>
                        </b-input-group>
                    </div>
                </b-form-group>

                <b-form-group
                    class="flex-fill ml-2"
                    label="Available"
                    label-class="font-weight-bold"
                    label-for="available-input"
                >
                    <div class="d-flex">
                        <b-input-group>
                            <b-form-input id="available-input" v-model="experience.available" number type="number" min="0" step="1"></b-form-input>
                            <b-input-group-append>
                                <b-button @click="experience.available = 0">
                                    <fa icon="times"></fa>
                                </b-button>
                            </b-input-group-append>
                        </b-input-group>
                    </div>
                </b-form-group>
            </div>

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
    import { ref } from 'vue';

    // Models
    import { EoteOrGenCharacter } from '../../../../../common/interfaces/systems/eote';

    // Components
    import { BModal } from 'bootstrap-vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Experience
    {
        total : number;
        available : number;
    }

    interface Events
    {
        (e : 'save', exp : Experience) : void;
    }

    const emit = defineEmits<Events>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const experience = ref<Experience>({
        total: 0,
        available: 0
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
