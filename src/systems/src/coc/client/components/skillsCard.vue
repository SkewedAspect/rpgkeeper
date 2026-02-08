<!----------------------------------------------------------------------------------------------------------------------
  -- Skills Card
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <RpgkCard id="coc-skills-block" :class="{ readonly: readonly }" fill no-body>
        <!-- Header -->
        <template #header>
            <div class="d-flex">
                <h5 class="align-items-center d-flex text-nowrap m-0 me-2 flex-grow-0 flex-shrink-0 w-auto">
                    <Fa class="me-1" icon="book" />
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
            <table class="table table-sm table-striped mb-0">
                <thead>
                    <tr>
                        <th>Skill</th>
                        <th class="text-center">Value</th>
                        <th class="text-center">Half</th>
                        <th class="text-center">Fifth</th>
                        <th v-if="!readonly" class="text-center">Used</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="skill in sortedSkills" :key="skill.name">
                        <td>{{ skill.name }}</td>
                        <td class="text-center">{{ getEffectiveValue(skill) }}</td>
                        <td class="text-center text-muted">{{ getHalfValue(skill) }}</td>
                        <td class="text-center text-muted">{{ getFifthValue(skill) }}</td>
                        <td v-if="!readonly" class="text-center">
                            <BFormCheckbox
                                v-model="skill.used"
                                class="d-inline-block"
                                @change="emit('save')"
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Edit Modal -->
        <EditSkillsModal ref="editSkillsModal" @save="onEditSave" />
    </RpgkCard>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss" scoped>
    #coc-skills-block {
        .skills-table-wrapper {
            max-height: 400px;
            overflow-y: auto;
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
    const editSkillsModal = ref<InstanceType<typeof EditSkillsModal> | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const character = computed<Character<CoCSystemDetails>>(() => current.value as any);
    const readonly = computed(() => props.readonly);

    const sortedSkills = computed(() =>
    {
        return [ ...character.value.details.skills ]
            .sort((a, b) => a.name.localeCompare(b.name));
    });

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function openEditModal() : void
    {
        editSkillsModal.value?.show(character.value);
    }

    function onEditSave(skills : CoCSkill[]) : void
    {
        character.value.details.skills = skills;
        emit('save');
    }

    function getEffectiveValue(skill : CoCSkill) : number
    {
        if(skill.value !== null)
        {
            return skill.value;
        }

        if(skill.characteristic)
        {
            const charValue = character.value.details.characteristics[skill.characteristic];
            return skill.half ? Math.floor(charValue / 2) : charValue;
        }

        return skill.defaultValue ?? 0;
    }

    function getHalfValue(skill : CoCSkill) : number
    {
        return Math.floor(getEffectiveValue(skill) / 2);
    }

    function getFifthValue(skill : CoCSkill) : number
    {
        return Math.floor(getEffectiveValue(skill) / 5);
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
