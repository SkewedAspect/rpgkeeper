<!----------------------------------------------------------------------------------------------------------------------
  -- FATE Rolls
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <RpgkCard id="rolls" icon="dice" title="Rolls" fill>
        <!-- Select a skill -->
        <b-form-select
            v-model="skill"
            :options="sortedSkills"
            text-field="display"
            value-field="name"
            :disabled="readonly"
        >
            <template #first>
                <option value="No Skill">
                    No Skill
                </option>
            </template>
        </b-form-select>

        <!-- Roll History -->
        <div class="flex-fill mt-3 mb-3 overflow-auto h-0">
            <ul class="list-unstyled">
                <li v-for="(item, index) in rolls" :key="index">
                    <div>{{ item.display }}</div>
                    <div class="text-muted">
                        <small>{{ item.name }}</small>
                    </div>
                </li>
            </ul>
        </div>

        <!-- Roll Buttons -->
        <div class="text-right">
            <b-btn :disabled="readonly" @click="clearRolls()">
                <fa icon="times"></fa>
                Clear
            </b-btn>
            <b-btn variant="primary" class="ml-1" :disabled="readonly" @click="roll()">
                <fa icon="dice"></fa>
                Roll
            </b-btn>
        </div>
    </RpgkCard>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss">
    #rolls {
        .card-body {
            display: flex;
            flex-direction: column;
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, ref } from 'vue';
    import { orderBy } from 'lodash';

    // Interfaces
    import { FateSkill } from '../../../../common/interfaces/systems/fate';

    // Utils
    import diceUtil from '../../../lib/utils/dice';

    // Components
    import RpgkCard from '../../ui/rpgkCard.vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Props
    {
        skills : FateSkill[];
        readonly : boolean;
    }

    const props = defineProps<Props>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    interface RollerRoll
    {
        name : string;
        display : string;
        roll : { render() : string, value : number }
    }

    const skill = ref<string>('No Skill');
    const rolls = ref<RollerRoll[]>([]);

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const readonly = computed(() => props.readonly);

    const sortedSkills = computed(() =>
    {
        const skills = props.skills.map(({ name, rank }) =>
        {
            return {
                name,
                rank,
                display: `${ name } (+${ rank })`
            };
        });

        return orderBy(skills, [ 'rank', 'name' ], [ 'desc', 'asc' ]);
    });

    const selectedSkill = computed(() => sortedSkills.value.find((item) => item.name === skill.value));

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function roll() : void
    {
        const rollInst = diceUtil.rollFudge(selectedSkill.value?.rank ?? 0);
        this.rolls.unshift({
            roll: rollInst,
            name: selectedSkill.value?.display ?? skill.value,
            display: `${ rollInst.render() } = ${ rollInst.value }`
        });
    }

    function clearRolls() : void
    {
        skill.value = 'No Skill';
        rolls.value = [];
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
