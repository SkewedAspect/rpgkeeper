<!----------------------------------------------------------------------------------------------------------------------
  -- Wfrp Skills
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <RpgkCard id="wfrp-skills-block" :class="{ readonly: readonly }" fill no-body>
        <!-- Header -->
        <template #header>
            <div class="d-flex">
                <h5 class="align-items-center d-flex text-nowrap m-0 me-2 flex-grow-0 flex-shrink-0 w-auto">
                    <Fa class="me-1" icon="flame" />
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
        <BListGroup v-if="skills && skills.length > 0" flush>
            <BListGroupItem v-for="skill in skills" :key="skill.description" class="d-flex">
                <div class="d-inline-block flex-fill">
                    <div>
                        <b>{{ skill.description }}</b> ({{ skill.value }})
                    </div>
                </div>
            </BListGroupItem>
        </BListGroup>
        <div v-else class="card-body">
            <h4 class="text-center text-muted m-0">
                No Skills yet.
            </h4>
        </div>

        <!-- Edit Modal -->
        <EditSkillsModal ref="editModal" @save="onEditSave" />
    </RpgkCard>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss">
    #wfrp-skills-block {
        &.card:not(.readonly) {
            .card-header {
                padding-top: 0.5rem !important;
                padding-bottom: 0.5rem !important;
            }
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, ref } from 'vue';
    import { storeToRefs } from 'pinia';

    // Interfaces
    import { Character } from '../../../../common/interfaces/common';
    import { WFRPSkill, WFRPSystemDetails } from '../../../../common/interfaces/systems/wfrp';

    // Stores
    import { useCharactersStore } from '../../../lib/stores/characters';

    // Components
    import EditSkillsModal from './editSkillsModal.vue';
    import RpgkCard from '../../ui/rpgkCard.vue';

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

    const { current } = storeToRefs(useCharactersStore());
    const editModal = ref<InstanceType<typeof EditSkillsModal> | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const readonly = computed(() => props.readonly);

    const char = computed<Character<WFRPSystemDetails>>(() => current.value as any);

    const skills = computed(() =>
    {
        return char.value.details.skills;
    });

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function openEditModal() : void
    {
        editModal.value.show(skills.value);
    }

    function onEditSave(newSkills : WFRPSkill[]) : void
    {
        char.value.details.skills = newSkills;

        emit('save');
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
