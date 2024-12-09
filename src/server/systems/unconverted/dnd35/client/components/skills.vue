<template>
    <div id="skills" class="card">
        <div class="card-header">
            <div class="btn-toolbar pull-right">
                <button class="btn btn-secondary" :class="{ active: showSkills }" title="Show/Hide Skills" @click="toggleShowSkills()">
                    <i class="fa" :class="{ 'fa-eye': showSkills, 'fa-eye-slash': !showSkills }" />
                </button>
                <button class="btn btn-primary" title="Add Skill...">
                    <i class="fa fa-plus" />
                </button>
            </div>

            <i class="fa fa-list" />
            Skills
        </div>
        <table class="table table-sm table-hover">
            <thead class="thead-default">
                <tr>
                    <th>Skill</th>
                    <th>Ability</th>
                    <th>Total</th>
                    <th>Ranks</th>
                    <th />
                </tr>
            </thead>
            <tbody>
                <tr v-for="skill in char.skills" v-if="showSkills || !skill.hidden" class="skill" :class="{ 'table-info': skill.hidden }" @click="rollSkill(skill)">
                    <td>
                        <span class="name">{{ skill.name }}</span><span v-if="skill.armorPenalty" class="armorPenalty" title="Armor Check Penalty applies">*</span>
                        <span v-if="skill.untrained" class="untrained" title="Can be used untrained">&diams;</span>
                    </td>
                    <td class="text-center">
                        {{ skill.ability | abilityShort }}
                    </td>
                    <td class="text-center">
                        <b>{{ calcSkill(skill) || 0 }}</b>
                    </td>
                    <td class="text-center">
                        {{ skill.ranks || 0 }}
                    </td>
                    <td>
                        <button class="close" title="Edit Skill...">
                            <i class="fa fa-edit" />
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style lang="scss">
    #skills {
        flex: 1 1 auto;

        .table {
            font-size: .75rem;
            margin-bottom: 0;

            tbody {
                td {
                    cursor: pointer;

                    button.close {
                        font-size: 1rem;
                    }
                }
            }
        }
    }
</style>

<script type="text/babel">
    import _ from 'lodash';
    import rollsSvc from '../services/rolls';

    export default {
        filters: {
            abilityShort(ability)
            {
                return ability.substr(0, 3).toLocaleUpperCase();
            },
        },
        props: {
            char: {
                required: true,
            },
        },
        data()
        {
            return {
                showSkills: false,
            };
        },
        methods: {
            toggleShowSkills()
            {
                this.showSkills = !this.showSkills;
            },
            calcSkill(skill)
            {
                return (skill.ranks || 0) + this.char[`${ skill.ability.substr(0, 3) }Mod`]; // + bonuses
            },
            rollSkill(skill)
            {
                var rollText = `1d20 + 'skill.ranks' + ${ skill.ability.substr(0, 3) }Mod + bonuses`;
                var scope = _.merge({}, this.char.toJSON(), { skill: { ranks: 0 } }, { skill }, { bonuses: 0 });

                rollsSvc.roll(rollText, scope, skill.name);
            },
        },
    };
</script>
