<!----------------------------------------------------------------------------------------------------------------------
  -- Skills Component
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <RpgkCard id="fate-skills" class="ml-2" :class="{ readonly: readonly }" no-body fill>
        <template #header>
            <div class="d-flex">
                <h5 class="align-items-center d-flex text-nowrap m-0 mr-2 flex-grow-0 flex-shrink-0 w-auto">
                    <fa class="mr-1" icon="scroll"></fa>
                    <span class="d-none d-md-inline">Skills</span>
                </h5>
                <div v-if="!readonly" class="ml-auto">
                    <b-btn size="sm" style="margin-bottom: 1px;" @click="openEditModal()">
                        <fa icon="edit" fixed-width></fa>
                        <span class="d-none d-md-inline">Edit</span>
                    </b-btn>
                </div>
            </div>
        </template>

        <!-- Content -->
        <table class="table table-bordered mb-0 font-sm">
            <!-- eslint-disable-next-line vue/no-template-shadow -->
            <tr v-for="{ name, skills } in rows" :key="name">
                <td class="text-right text-nowrap" style="width: 1%">
                    <b>{{ name }}</b>
                </td>
                <td v-for="columnIdx in columns" :key="columnIdx" style="min-width: 80px">
                    {{ (skills[ columnIdx ] || {}).name }}
                </td>
            </tr>
        </table>

        <!-- Modals -->
        <EditSkillsModal ref="editModal" :readonly="readonly" @save="onEditSave"></EditSkillsModal>
    </RpgkCard>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss" scoped>
    #fate-skills {
        table {
            border-left: none !important;
            border-right: none !important;

            td:first-child {
                border-left: none !important;
            }

            td:last-child {
                border-right: none !important;
            }
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, ref } from 'vue';
    import { orderBy, range } from 'lodash';

    // Interfaces
    import { FateSkill } from '../../../../common/interfaces/systems/fate';

    // Components
    import RpgkCard from '../../ui/rpgkCard.vue';
    import EditSkillsModal from './editSkillsModal.vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Props
    {
        skills : FateSkill[];
        readonly : boolean;
    }

    const props = defineProps<Props>();

    interface Events
    {
        (e : 'update:skills', aspects : FateSkill[]);
        (e : 'save') : void;
    }

    const emit = defineEmits<Events>();

    //------------------------------------------------------------------------------------------------------------------
    // Ref
    //------------------------------------------------------------------------------------------------------------------

    const editModal = ref<InstanceType<typeof EditSkillsModal> | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const skills = computed<FateSkill[]>({
        get() { return orderBy(props.skills, [ 'rank', 'name' ], [ 'desc', 'asc' ]); },
        set(val) { emit('update:skills', val); }
    });

    const averageSkills = computed<FateSkill[]>(() => skills.value.filter((skill) => skill.rank === 1));
    const fairSkills = computed<FateSkill[]>(() => skills.value.filter((skill) => skill.rank === 2));
    const goodSkills = computed<FateSkill[]>(() => skills.value.filter((skill) => skill.rank === 3));
    const greatSkills = computed<FateSkill[]>(() => skills.value.filter((skill) => skill.rank === 4));
    const superbSkills = computed<FateSkill[]>(() => skills.value.filter((skill) => skill.rank === 5));

    const rows = computed(() =>
    {
        return [
            {
                name: 'Superb (+5)',
                skills: superbSkills.value
            },
            {
                name: 'Great (+4)',
                skills: greatSkills.value
            },
            {
                name: 'Good (+3)',
                skills: goodSkills.value
            },
            {
                name: 'Fair (+2)',
                skills: fairSkills.value
            },
            {
                name: 'Average (+1)',
                skills: averageSkills.value
            }
        ];
    });

    const columns = computed(() =>
    {
        // eslint-disable-next-line no-shadow
        const maxLength = rows.value.reduce((max, { skills }) => Math.max(max, skills.length), 5);
        return range(maxLength);
    });

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function openEditModal() : void
    {
        editModal.value.show(skills.value);
    }

    function onEditSave(newSkills : FateSkill[]) : void
    {
        skills.value = newSkills;

        emit('save');
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
