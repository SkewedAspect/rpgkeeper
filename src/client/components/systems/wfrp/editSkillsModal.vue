<!----------------------------------------------------------------------------------------------------------------------
  -- editSkillsModal
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="edit-skills-modal">
        <BModal
            ref="innerModal"
            header-bg-variant="dark"
            header-text-variant="white"
            size="lg"
            no-close-on-esc
            no-close-on-backdrop
            @ok="onSave"
            @cancel="onCancel"
        >
            <!-- Modal Header -->
            <template #header="{ cancel }">
                <h5 v-b-color-mode="'dark'" class="w-100 mb-0">
                    <fa icon="file-edit"></fa>
                    Edit Skills
                    <CloseButton class="float-end" @click="cancel"></CloseButton>
                </h5>
            </template>

            <!-- Modal Content -->
            <div v-for="(skill, index) in skills" :key="index" class="d-flex mb-2">
                <BFormInput v-model="skill.value" number type="number" min="1" max="99" step="1" style="max-width: 60px; min-width: 60px;"></BFormInput>
                <BFormInput v-model="skill.description" class="ms-2" placeholder="Description"></BFormInput>
                <BButton variant="danger" class="ms-2" @click="removeSkill(skill)">
                    <fa icon="trash-alt"></fa>
                </BButton>
            </div>

            <hr />

            <BCard
                header="New Skill"
                header-bg-variant="dark"
                header-text-variant="white"
            >
                <div class="d-flex">
                    <BFormInput v-model="newValue" number type="number" min="1" max="99" step="1" style="max-width: 60px; min-width: 60px;"></BFormInput>
                    <BFormInput id="new-desc" v-model="newDesc" class="ms-2" placeholder="Description"></BFormInput>
                    <BButton variant="primary" class="ms-2 text-nowrap" :disabled="!isAddValid" @click="addSkill">
                        <fa icon="plus"></fa>
                        Add
                    </BButton>
                </div>
            </BCard>

            <!-- Modal Buttons -->
            <template #ok="{ ok }">
                <BButton variant="primary" @click="ok">
                    <fa icon="save"></fa>
                    Save
                </BButton>
            </template>
            <template #cancel="{ cancel }">
                <BButton variant="secondary" @click="cancel">
                    <fa icon="times"></fa>
                    Cancel
                </BButton>
            </template>
        </BModal>
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss">
    .edit-skills-modal {
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, ref } from 'vue';

    // Interfaces
    import { WFRPSkill } from '../../../../common/interfaces/systems/wfrp';

    // Components
    import { BModal } from 'bootstrap-vue-next';
    import CloseButton from '../../ui/closeButton.vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Events
    {
        (e : 'save', hooks : Record<string, unknown>[]) : void;
    }

    const emit = defineEmits<Events>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const skills = ref<Record<string, unknown>[]>([]);
    const newValue = ref<number>(1);
    const newDesc = ref<string>('');

    const innerModal = ref<InstanceType<typeof BModal> | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const isAddValid = computed(() =>
    {
        return Number.isFinite(newValue.value) && !!newDesc.value;
    });

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function show(charSkills : WFRPSkill[]) : void
    {
        // Clone the array of skills
        skills.value = charSkills.map((skill) => ({ ...skill }));

        // Show the modal
        innerModal.value.show();
    }

    function hide() : void
    {
        innerModal.value.hide();
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
        skills.value.push({
            description: newDesc.value,
            value: newValue.value
        });

        newDesc.value = '';
        newValue.value = 1;
    }

    function removeSkill(skill : WFRPSkill) : void
    {
        const idx = skills.value.findIndex((item) => item === skill);
        if(idx > -1)
        {
            skills.value.splice(idx, 1);
        }
    }

    //------------------------------------------------------------------------------------------------------------------

    defineExpose({ show, hide });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
