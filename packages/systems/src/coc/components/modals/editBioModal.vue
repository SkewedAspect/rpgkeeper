<!----------------------------------------------------------------------------------------------------------------------
  -- editBioModal
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="edit-bio-modal">
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
                    Edit Identity
                    <CloseButton class="float-end" @click="cancel" />
                </h5>
            </template>

            <!-- Modal Content -->
            <div class="d-flex gap-2">
                <BFormGroup
                    id="name-input-group"
                    label="Name"
                    label-for="name-input"
                    class="flex-fill"
                >
                    <BFormInput id="name-input" v-model="innerBio.name" />
                </BFormGroup>
                <BFormGroup
                    id="age-input-group"
                    label="Age"
                    label-for="age-input"
                >
                    <BFormInput id="age-input" v-model="innerBio.age" type="number" step="1" min="0" max="150" number />
                </BFormGroup>
                <BFormGroup
                    id="pronouns-input-group"
                    label="Pronouns"
                    label-for="pronouns-input"
                >
                    <BInputGroup>
                        <BFormInput id="pronouns-input" v-model="innerBio.pronouns" />
                        <template #append>
                            <BDropdown text="Pronouns" variant="outline-secondary">
                                <BDropdownItem @click="innerBio.pronouns = 'Any'">
                                    Any
                                </BDropdownItem>
                                <BDropdownItem @click="innerBio.pronouns = 'He/Him'">
                                    He/Him
                                </BDropdownItem>
                                <BDropdownItem @click="innerBio.pronouns = 'She/Her'">
                                    She/Her
                                </BDropdownItem>
                                <BDropdownItem @click="innerBio.pronouns = 'They/Them'">
                                    They/Them
                                </BDropdownItem>
                            </BDropdown>
                        </template>
                    </BInputGroup>
                </BFormGroup>
            </div>
            <div class="d-flex gap-2 mt-2">
                <BFormGroup
                    id="birthplace-input-group"
                    label="Birthplace"
                    label-for="birthplace-input"
                    class="flex-fill"
                >
                    <BFormInput id="birthplace-input" v-model="innerBio.birthplace" />
                </BFormGroup>
                <BFormGroup
                    id="residence-input-group"
                    label="Residence"
                    label-for="residence-input"
                    class="flex-fill"
                >
                    <BFormInput id="residence-input" v-model="innerBio.residence" />
                </BFormGroup>
                <BFormGroup
                    id="occupation-input-group"
                    label="Occupation"
                    label-for="occupation-input"
                    class="flex-fill"
                >
                    <BFormInput id="occupation-input" v-model="innerBio.occupation" />
                </BFormGroup>
            </div>
            <BFormGroup
                id="desc-input-group"
                label="Description"
                label-for="desc-input"
                class="mt-2"
            >
                <MarkdownEditor v-model:text="innerBio.description" />
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
    import type { CoCSystemDetails, CocBiography } from '@rpgk/core/models/systems';

    // Components
    import { BModal } from 'bootstrap-vue-next';
    import MarkdownEditor from '@client/components/ui/markdownEditor.vue';
    import CloseButton from '@client/components/ui/closeButton.vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    type Events = (e : 'save', bio : { name : string, description : string }) => void;

    const emit = defineEmits<Events>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const innerBio = ref<CocBiography & { name : string, description : string }>({
        age: 0,
        birthplace: '',
        occupation: '',
        pronouns: '',
        residence: '',
        name: '',
        description: '',
    });

    const innerModal = ref<InstanceType<typeof BModal> | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function show(char : Character<CoCSystemDetails>) : void
    {
        innerBio.value.name = char.name;
        innerBio.value.description = char.description;
        innerBio.value.age = char.details.biography.age;
        innerBio.value.birthplace = char.details.biography.birthplace;
        innerBio.value.occupation = char.details.biography.occupation;
        innerBio.value.pronouns = char.details.biography.pronouns;
        innerBio.value.residence = char.details.biography.residence;

        innerModal.value.show();
    }

    function hide() : void
    {
        innerModal.value.hide();
    }

    function onSave() : void
    {
        emit('save', innerBio.value);
    }

    function onCancel() : void
    {
        innerBio.value.name = '';
        innerBio.value.description = '';
        innerBio.value.age = 0;
        innerBio.value.birthplace = '';
        innerBio.value.occupation = '';
        innerBio.value.pronouns = '';
        innerBio.value.residence = '';
    }

    //------------------------------------------------------------------------------------------------------------------

    defineExpose({ show, hide });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
