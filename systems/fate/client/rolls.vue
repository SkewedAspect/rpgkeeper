<!----------------------------------------------------------------------------------------------------------------------
  -- FATE Rolls
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <rpgk-card id="rolls" icon="dice" title="Rolls" fill>

        <!-- Select a skill -->
        <b-form-select v-model="skill" :options="sortedSkills" text-field="display" value-field="name" :disabled="readonly">
            <template slot="first">
                <option value="No Skill">No Skill</option>
            </template>
        </b-form-select>

        <!-- Roll History -->
        <div class="flex-fill mt-3 mb-3 overflow-auto h-0">
            <ul class="list-unstyled">
                <li v-for="(item, index) in rolls" :key="index">
                    <div>{{ item.display }}</div>
                    <div class="text-muted"><small>{{ item.name }}</small></div></li>
            </ul>
        </div>

        <!-- Roll Buttons -->
        <div class="text-right">
            <b-btn @click="clearRolls()" :disabled="readonly">
                <font-awesome-icon icon="times"></font-awesome-icon>
                Clear
            </b-btn>
            <b-btn variant="primary" class="ml-1" @click="roll()" :disabled="readonly">
                <font-awesome-icon icon="dice"></font-awesome-icon>
                Roll
            </b-btn>
        </div>
    </rpgk-card>
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

<script>
    //------------------------------------------------------------------------------------------------------------------

    import _ from 'lodash';

    // Utils
    import diceUtil from '../../../client/api/utils/dice';

    // Components
    import RpgkCard from '../../../client/components/ui/card.vue';

    //------------------------------------------------------------------------------------------------------------------

    export default {
        name: 'FateRollsCard',
        components: {
            RpgkCard
        },
        props: {
            skills: {
                type: Array,
                required: true
            },
            readonly: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            sortedSkills()
            {
                return _(this.skills)
                    .orderBy(['rank', 'name'], ['desc', 'asc'])
                    .map(({ name, rank }) =>
                    {
                        return {
                            name,
                            rank,
                            display: `${ name } (+${ rank })`
                        };
                    })
                    .value();
            },
            selectedSkill()
            {
                return _.find(this.sortedSkills, { name: this.skill });
            }
        },
        methods: {
            roll()
            {
                const roll = diceUtil.rollFudge(_.get(this.selectedSkill, 'rank', 0));
                this.rolls.unshift({
                    roll,
                    name: _.get(this.selectedSkill, 'display', this.skill),
                    display: `${ roll.render() } = ${ roll.value }`
                });
            },
            clearRolls()
            {
                this.rolls = [];
                this.dice = null;
            }
        },
        data()
        {
            return {
                skill: 'No Skill',
                rolls: [],
            };
        }
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
