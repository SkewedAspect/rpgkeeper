<!----------------------------------------------------------------------------------------------------------------------
  -- Skills Component
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <RpgkCard id="fate-skills" class="ms-2" :class="{ readonly: readonly }" no-body fill>
        <template #header>
            <div class="d-flex">
                <h5 class="align-items-center d-flex text-nowrap m-0 me-2 flex-grow-0 flex-shrink-0 w-auto">
                    <Fa class="me-1" icon="scroll" />
                    <span class="d-none d-md-inline">Skills</span>
                </h5>
                <div v-if="!readonly" class="ms-auto">
                    <BButton size="sm" style="margin-bottom: 1px;" @click="openEditModal()">
                        <Fa icon="edit" fixed-width />
                        <span class="d-none d-md-inline">Edit</span>
                    </BButton>
                </div>
            </div>
        </template>

        <!-- Content -->
        <table class="table table-bordered mb-0 font-sm">
            <tbody>
                <!-- eslint-disable-next-line vue/no-template-shadow -->
                <tr v-for="{ name, skills } in rows" :key="name">
                    <td class="text-end text-nowrap" style="width: 1%">
                        <b>{{ name }}</b>
                    </td>
                    <td v-for="columnIdx in columns" :key="columnIdx" style="min-width: 80px">
                        {{ (skills[ columnIdx ] || {}).name }}
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- Modals -->
        <EditSkillsModal ref="editModal" :readonly="readonly" @save="onEditSave" />
    </RpgkCard>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, ref } from 'vue';
    import { orderBy, range } from 'lodash';

    // Interfaces
    import type { FateSkill } from '../../models.ts';

    // Components
    import RpgkCard from '@client/components/ui/rpgkCard.vue';
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
        (e : 'update:skills', aspects : FateSkill[]) : void;
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

    const readonly = computed(() => props.readonly);

    const skills = computed<FateSkill[]>({
        get() { return orderBy(props.skills, [ 'rank', 'name' ], [ 'desc', 'asc' ]); },
        set(val) { emit('update:skills', val); },
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
                skills: superbSkills.value,
            },
            {
                name: 'Great (+4)',
                skills: greatSkills.value,
            },
            {
                name: 'Good (+3)',
                skills: goodSkills.value,
            },
            {
                name: 'Fair (+2)',
                skills: fairSkills.value,
            },
            {
                name: 'Average (+1)',
                skills: averageSkills.value,
            },
        ];
    });

    const columns = computed(() =>
    {
        const maxLength = rows.value.reduce((max, row) => Math.max(max, row.skills.length), 5);
        return range(maxLength);
    });

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function openEditModal() : void
    {
        editModal.value?.show(skills.value);
    }

    function onEditSave(newSkills : FateSkill[]) : void
    {
        skills.value = newSkills;

        emit('save');
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
