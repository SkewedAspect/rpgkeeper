<!----------------------------------------------------------------------------------------------------------------------
  -- EditSkillsModal
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="edit-skills-modal">
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
                    Edit Skills
                    <CloseButton class="float-end" @click="cancel" />
                </h5>
            </template>

            <!-- Modal Content -->
            <div
                v-for="(skill, index) in sortedSkills"
                :key="index"
                class="d-flex align-items-center mb-2"
            >
                <BFormInput
                    v-model="skill.name"
                    placeholder="Skill name"
                    class="me-2"
                />
                <BFormInput
                    v-model="skill.value"
                    number
                    type="number"
                    step="1"
                    min="0"
                    placeholder="Value"
                    style="max-width: 100px;"
                    class="me-2"
                />
                <BFormCheckbox
                    v-model="skill.used"
                    class="me-2"
                >
                    Used
                </BFormCheckbox>
                <BButton variant="danger" class="ms-2" @click="removeSkill(skill)">
                    <Fa icon="trash-alt" />
                </BButton>
            </div>

            <hr>

            <BCard
                header="New Skill"
                header-bg-variant="dark"
                header-text-variant="white"
            >
                <div class="d-flex">
                    <BFormInput
                        v-model="newSkillName"
                        placeholder="Skill name"
                        class="me-2"
                    />
                    <BFormInput
                        v-model="newSkillDefault"
                        number
                        type="number"
                        step="1"
                        min="0"
                        placeholder="Default value"
                        style="max-width: 120px;"
                        class="me-2"
                    />
                    <BButton variant="primary" class="text-nowrap" @click="addSkill">
                        <Fa icon="plus" />
                        Add
                    </BButton>
                </div>
            </BCard>

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
    import { computed, ref } from 'vue';

    // Models
    import type { Character } from '@rpgk/core';
    import type { CoCSkill, CoCSystemDetails } from '../../../models.ts';

    // Components
    import { BModal } from 'bootstrap-vue-next';
    import CloseButton from '@client/components/ui/closeButton.vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    type Events = (e : 'save', skills : CoCSkill[]) => void;

    const emit = defineEmits<Events>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const skills = ref<CoCSkill[]>([]);
    const newSkillName = ref<string>('');
    const newSkillDefault = ref<number | null>(null);

    const innerModal = ref<InstanceType<typeof BModal> | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const sortedSkills = computed(() =>
    {
        return [ ...skills.value ].sort((a, b) => a.name.localeCompare(b.name));
    });

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function show(char : Character<CoCSystemDetails>) : void
    {
        // Clone the array of skills
        skills.value = char.details.skills.map((skill) => ({ ...skill }));

        // Show the modal
        innerModal.value?.show();
    }

    function hide() : void
    {
        innerModal.value?.hide();
    }

    function onSave() : void
    {
        emit('save', skills.value);
        skills.value = [];
    }

    function onCancel() : void
    {
        skills.value = [];
    }

    function addSkill() : void
    {
        if(!newSkillName.value.trim())
        {
            return;
        }

        skills.value.push({
            name: newSkillName.value.trim(),
            defaultValue: newSkillDefault.value,
            value: null,
            used: false,
        });

        newSkillName.value = '';
        newSkillDefault.value = null;
    }

    function removeSkill(skill : CoCSkill) : void
    {
        const idx = skills.value.findIndex((item) => item === skill);
        if(idx > -1)
        {
            skills.value.splice(idx, 1);
        }
    }

    //------------------------------------------------------------------------------------------------------------------

    defineExpose({ show, hide });

    //------------------------------------------------------------------------------------------------------------------
</script>

<!--------------------------------------------------------------------------------------------------------------------->
