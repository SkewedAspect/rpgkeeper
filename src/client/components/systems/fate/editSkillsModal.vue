<!----------------------------------------------------------------------------------------------------------------------
  -- editSkillsModal
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="edit-skills-modal">
        <b-modal
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
            <template #modal-title>
                <fa icon="file-edit"></fa>
                Edit Skills
            </template>

            <!-- Modal Content -->
            <section v-for="rank in ranks" :key="rank.text" class="skill-group mb-3">
                <template v-if="filterRankSkills(rank.value).length > 0">
                    <h5 class="mb-0">
                        {{ rank.text }}
                    </h5>
                    <hr class="mt-1" />
                    <div v-if="filterRankSkills(rank.value).length < 1">
                        <h6 class="mb-0 text-center">
                            No skills.
                        </h6>
                    </div>
                    <div v-for="skill in filterRankSkills(rank.value)" :key="skill.name" class="d-flex mb-2">
                        <BFormInput v-model="skill.name"></BFormInput>
                        <BFormSelect v-model="skill.rank" class="ml-2 flex-grow-0 flex-shrink-0 w-auto" :options="ranks"></BFormSelect>
                        <BButton variant="danger" class="ml-2" @click="removeSkill(skill)">
                            <fa icon="trash-alt"></fa>
                        </BButton>
                    </div>
                </template>
            </section>

            <hr />

            <BCard
                header="New Skill"
                header-bg-variant="dark"
                header-text-variant="white"
            >
                <div class="d-flex">
                    <BFormInput id="name-input" v-model="newSkillName" placeholder="Skill name"></BFormInput>
                    <BFormSelect v-model="newSkillRank" class="ml-2 flex-grow-0 flex-shrink-0 w-auto" :options="ranks"></BFormSelect>
                    <BButton variant="primary" class="ml-2 text-nowrap" @click="addSkill">
                        <fa icon="plus"></fa>
                        Add
                    </BButton>
                </div>
            </BCard>

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
    import { computed, ref } from 'vue';
    import { orderBy } from 'lodash';

    // Interfaces
    import { FateSkill } from '../../../../common/interfaces/systems/fate';

    // Components
    import { BModal } from 'bootstrap-vue-next';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Events
    {
        (e : 'save', aspects : FateSkill[]) : void;
    }

    const emit = defineEmits<Events>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const ranks = ref([
        {
            text: 'Superb (+5)',
            value: 5
        },
        {
            text: 'Great (+4)',
            value: 4
        },
        {
            text: 'Good (+3)',
            value: 3
        },
        {
            text: 'Fair (+2)',
            value: 2
        },
        {
            text: 'Average (+1)',
            value: 1
        }
    ]);

    const skills = ref<FateSkill[]>([]);
    const newSkillName = ref<string>('');
    const newSkillRank = ref<number>(1);

    const innerModal = ref<InstanceType<typeof BModal> | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const skillsSorted = computed(() => orderBy(skills.value, [ 'rank', 'name' ], [ 'desc', 'asc' ]));

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function show(charSkills : FateSkill[]) : void
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
        skills.value.push({ name: newSkillName.value, rank: newSkillRank.value });
        newSkillName.value = '';
        newSkillRank.value = 1;
    }

    function removeSkill(skill : FateSkill) : void
    {
        const idx = skills.value.findIndex((item) => item === skill);
        if(idx > -1)
        {
            skills.value.splice(idx, 1);
        }
    }

    function filterRankSkills(rank : number) : FateSkill[]
    {
        return skillsSorted.value.filter((skill) => skill.rank === rank);
    }

    //------------------------------------------------------------------------------------------------------------------

    defineExpose({ show, hide });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
