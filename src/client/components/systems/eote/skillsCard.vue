<!----------------------------------------------------------------------------------------------------------------------
  -- skillsCard.vue
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <RpgkCard id="eote-skills-block" :class="{ readonly: readonly }" fill>
        <!-- Header -->
        <template #header>
            <div class="d-flex">
                <h5 class="align-items-center d-flex text-nowrap m-0 mr-2 flex-grow-0 flex-shrink-0 w-auto">
                    <fa class="mr-1" icon="address-card"></fa>
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

        <!-- Card Body -->
        <div class="d-flex flex-wrap align-content-stretch">
            <div class="skill-column">
                <div class="skill-group">
                    <b>General</b>
                    <b-table
                        class="font-sm"
                        :items="general"
                        :fields="fields"
                        small
                        hover
                        @row-clicked="onRowClicked"
                    >
                        <template #cell(name)="data">
                            <b>{{ data.value }}</b>
                            <small class="ml-1 text-muted">({{ formatCharName(data.item.characteristic) }})</small>
                        </template>
                        <template #cell(career)="data">
                            <div class="text-center">
                                <fa :icon="data.value ? 'check-square' : ['far', 'square']"></fa>
                            </div>
                        </template>
                        <template #cell(ranks)="data">
                            <div class="text-nowrap">
                                <fa
                                    v-for="index in range(5)"
                                    :key="index"
                                    class="skill-pip"
                                    :icon="index >= data.value ? ['far', 'circle'] : 'circle'"
                                ></fa>
                            </div>
                        </template>
                    </b-table>
                </div>
                <div v-if="mode === 'genesys' && magic.length" class="skill-group">
                    <b>Magic</b>
                    <b-table
                        class="font-sm"
                        :items="magic"
                        :fields="fields"
                        small
                        hover
                        @row-clicked="onRowClicked"
                    >
                        <template #cell(name)="data">
                            <b>{{ data.value }}</b>
                            <small class="ml-1 text-muted">({{ formatCharName(data.item.characteristic) }})</small>
                        </template>
                        <template #cell(career)="data">
                            <div class="text-center">
                                <fa :icon="data.value ? 'check-square' : ['far', 'square']"></fa>
                            </div>
                        </template>
                        <template #cell(ranks)="data">
                            <div class="text-nowrap">
                                <fa
                                    v-for="index in range(5)"
                                    :key="index"
                                    class="skill-pip"
                                    :icon="index >= data.value ? ['far', 'circle'] : 'circle'"
                                ></fa>
                            </div>
                        </template>
                    </b-table>
                </div>
            </div>
            <div class="skill-column">
                <div v-if="combat.length" class="skill-group">
                    <b>Combat</b>
                    <b-table
                        class="font-sm"
                        :items="combat"
                        :fields="fields"
                        small
                        hover
                        @row-clicked="onRowClicked"
                    >
                        <template #cell(name)="data">
                            <b>{{ data.value }}</b>
                            <small class="ml-1 text-muted">({{ formatCharName(data.item.characteristic) }})</small>
                        </template>
                        <template #cell(career)="data">
                            <div class="text-center">
                                <fa :icon="data.value ? 'check-square' : ['far', 'square']"></fa>
                            </div>
                        </template>
                        <template #cell(ranks)="data">
                            <div class="text-nowrap">
                                <fa
                                    v-for="index in range(5)"
                                    :key="index"
                                    class="skill-pip"
                                    :icon="index >= data.value ? ['far', 'circle'] : 'circle'"
                                ></fa>
                            </div>
                        </template>
                    </b-table>
                </div>
                <div v-if="social.length" class="skill-group">
                    <b>Social</b>
                    <b-table
                        class="font-sm"
                        :items="social"
                        :fields="fields"
                        small
                        hover
                        @row-clicked="onRowClicked"
                    >
                        <template #cell(name)="data">
                            <b>{{ data.value }}</b>
                            <small class="ml-1 text-muted">({{ formatCharName(data.item.characteristic) }})</small>
                        </template>
                        <template #cell(career)="data">
                            <div class="text-center">
                                <fa :icon="data.value ? 'check-square' : ['far', 'square']"></fa>
                            </div>
                        </template>
                        <template #cell(ranks)="data">
                            <div class="text-nowrap">
                                <fa
                                    v-for="index in range(5)"
                                    :key="index"
                                    class="skill-pip"
                                    :icon="index >= data.value ? ['far', 'circle'] : 'circle'"
                                ></fa>
                            </div>
                        </template>
                    </b-table>
                </div>
                <div v-if="knowledge.length" class="skill-group">
                    <b>Knowledge</b>
                    <b-table
                        class="font-sm mb-0"
                        :items="knowledge"
                        :fields="fields"
                        small
                        hover
                        @row-clicked="onRowClicked"
                    >
                        <template #cell(name)="data">
                            <b>{{ data.value }}</b>
                            <small class="ml-1 text-muted">({{ formatCharName(data.item.characteristic) }})</small>
                        </template>
                        <template #cell(career)="data">
                            <div class="text-center">
                                <fa :icon="data.value ? 'check-square' : ['far', 'square']"></fa>
                            </div>
                        </template>
                        <template #cell(ranks)="data">
                            <div class="text-nowrap">
                                <fa
                                    v-for="index in range(5)"
                                    :key="index"
                                    class="skill-pip"
                                    :icon="index >= data.value ? ['far', 'circle'] : 'circle'"
                                ></fa>
                            </div>
                        </template>
                    </b-table>
                </div>
            </div>
        </div>

        <!-- Edit Modal -->
        <EditModal ref="editModal" @save="onEditSave"></EditModal>
    </RpgkCard>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss">
    #eote-skills-block {
        .table tr {
            cursor: pointer;
        }

        .skill-column {
            flex: 1 1 auto;
        }

        .skill-group {
            margin-right: 0.5rem;
            margin-left: 0.5rem;
        }

        .skill-pip {
            margin-right: 1px;
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, ref } from 'vue';
    import { storeToRefs } from 'pinia';

    // Models
    import { EoteOrGenCharacter, EoteSkill } from '../../../../common/interfaces/systems/eote';

    // Stores
    import { useCharactersStore } from '../../../lib/stores/characters';

    // Components
    import RpgkCard from '../../ui/rpgkCard.vue';
    import EditModal from './modals/editSkillsModal.vue';

    // Utils
    import { startCase } from '../../../../common/utils/misc';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface DiceRoll
    {
        ability : number;
        proficiency : number;
    }

    interface Props
    {
        readonly : boolean;
    }

    const props = defineProps<Props>();

    interface Events
    {
        (e : 'roll', dice : DiceRoll, name : string) : void;
        (e : 'save') : void;
    }

    const emit = defineEmits<Events>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const fields = ref([ 'name', 'career', 'ranks' ]);

    const { current } = storeToRefs(useCharactersStore());
    const editModal = ref<InstanceType<typeof EditModal> | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const character = computed<EoteOrGenCharacter>(() => current.value as any);
    const mode = computed(() => current.value.system);
    const readonly = computed(() => props.readonly);

    const skills = computed<EoteSkill[]>(() => character.value.details.skills);

    const general = computed(() =>
    {
        return skills.value.filter((skill) => skill.type === 'general');
    });

    const magic = computed(() =>
    {
        return skills.value.filter((skill) => skill.type === 'magic');
    });

    const combat = computed(() =>
    {
        return skills.value.filter((skill) => skill.type === 'combat');
    });

    const social = computed(() =>
    {
        return skills.value.filter((skill) => skill.type === 'social');
    });

    const knowledge = computed(() =>
    {
        return skills.value.filter((skill) => skill.type === 'knowledge');
    });

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function openEditModal() : void
    {
        editModal.value.show(character.value);
    }

    function onEditSave(newSkills : EoteSkill[]) : void
    {
        character.value.details.skills = newSkills;

        emit('save');
    }

    function onRowClicked(item : EoteSkill) : void
    {
        const dice = { ability: 0, proficiency: 0 };
        const charCount = character.value.details.characteristics[item.characteristic];
        const rankCount = item.ranks;

        if(charCount > rankCount)
        {
            dice.ability = charCount - rankCount;
            dice.proficiency = rankCount;
        }
        else
        {
            dice.ability = rankCount - charCount;
            dice.proficiency = charCount;
        }

        emit('roll', dice, item.name);
    }

    function range(num)
    {
        const rangeArray = Array(num).fill(0);
        return rangeArray.map((_, index) => index);
    }

    function formatCharName(text) : string
    {
        return startCase(text);
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
