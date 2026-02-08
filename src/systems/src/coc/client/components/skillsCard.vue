<!----------------------------------------------------------------------------------------------------------------------
  -- Skills Card Component
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <RpgkCard id="coc-skills-block" :class="{ readonly: readonly }" fill no-body>
        <!-- Header -->
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

        <!-- Card Body -->
        <div class="skills-table-wrapper">
            <table class="table table-sm table-bordered mb-0">
                <thead>
                    <tr>
                        <th style="width: 30%">Skill</th>
                        <th style="width: 10%" class="text-center">Value</th>
                        <th style="width: 10%" class="text-center">Half</th>
                        <th style="width: 10%" class="text-center">Fifth</th>
                        <th v-if="!readonly" style="width: 10%" class="text-center">Used</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(skill, index) in skills" :key="index" :class="{ 'skill-used': skill.used }">
                        <td>{{ skill.name }}</td>
                        <td class="text-center">
                            {{ getSkillValue(skill) }}
                        </td>
                        <td class="text-center text-muted">
                            {{ getSkillHalf(skill) }}
                        </td>
                        <td class="text-center text-muted">
                            {{ getSkillFifth(skill) }}
                        </td>
                        <td v-if="!readonly" class="text-center">
                            <BFormCheckbox
                                v-model="skill.used"
                                :disabled="readonly"
                                @change="onSkillUsedToggle"
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Edit Modal -->
        <EditSkillsModal ref="editModal" @save="onEditSave" />
    </RpgkCard>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss" scoped>
    #coc-skills-block {
        .skills-table-wrapper {
            max-height: 600px;
            overflow-y: auto;
        }

        .skill-used {
            background-color: rgba(var(--bs-success-rgb), 0.1);
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, ref } from 'vue';
    import { storeToRefs } from 'pinia';

    // Models
    import type { Character } from '@rpgk/core';
    import type { CoCSkill, CoCSystemDetails } from '../../models.ts';

    // Stores
    import { useCharacterStore } from '@client/lib/resource-access/stores/characters';

    // Components
    import RpgkCard from '@client/components/ui/rpgkCard.vue';
    import EditSkillsModal from './modals/editSkillsModal.vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Props
    {
        readonly : boolean;
    }

    const props = defineProps<Props>();

    type Events = (e : 'save') => void;

    const emit = defineEmits<Events>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const { current } = storeToRefs(useCharacterStore());
    const editModal = ref<InstanceType<typeof EditSkillsModal> | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const character = computed<Character<CoCSystemDetails>>(() => current.value as any);
    const readonly = computed(() => props.readonly);

    const skills = computed(() => character.value.details.skills);

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function openEditModal() : void
    {
        editModal.value?.show(character.value);
    }

    function onEditSave(editedSkills : CoCSkill[]) : void
    {
        character.value.details.skills = editedSkills;
        emit('save');
    }

    function onSkillUsedToggle() : void
    {
        emit('save');
    }

    function getSkillValue(skill : CoCSkill) : number | string
    {
        if(skill.value !== null)
        {
            return skill.value;
        }

        // Calculate from characteristic if needed
        if(skill.characteristic && skill.half === undefined)
        {
            return character.value.details.characteristics[skill.characteristic];
        }
        else if(skill.characteristic && skill.half)
        {
            return Math.floor(character.value.details.characteristics[skill.characteristic] / 2);
        }

        return '-';
    }

    function getSkillHalf(skill : CoCSkill) : number | string
    {
        const value = getSkillValue(skill);
        return typeof value === 'number' ? Math.floor(value / 2) : '-';
    }

    function getSkillFifth(skill : CoCSkill) : number | string
    {
        const value = getSkillValue(skill);
        return typeof value === 'number' ? Math.floor(value / 5) : '-';
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
