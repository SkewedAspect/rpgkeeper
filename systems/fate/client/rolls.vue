<!--------------------------------------------------------------------------------------------------------------------->
<!-- rolls.vue                                                                                                         -->
<!--------------------------------------------------------------------------------------------------------------------->

<template>
    <md-card id="rolls" style="flex: 1">
        <md-toolbar class="md-dense">
            <h2 class="md-title">Rolls</h2>
        </md-toolbar>
        <md-card-content style="flex: 1; padding-bottom: 0">
            <md-input-container md-inline style="margin-bottom: 10px;">
                <md-select name="skills" id="skills" v-model="skillID" :disabled="!isAuthorized">
                    <md-option value="noskill">No Skill</md-option>
                    <md-option :value="skill.id" v-for="skill in sortedSkills" :key="skill.id">{{ skill.name }} (+{{ skill.rank }})</md-option>
                </md-select>

            </md-input-container>
            <md-list class="md-double-line md-dense roll-list">
                <md-list-item v-for="item in rolls">
                    <div class="md-list-text-container">
                        <span>{{ item.display }}</span>
                        <span>{{ item.name }}</span>
                    </div>
                </md-list-item>
            </md-list>
        </md-card-content>
        <md-card-actions>
            <md-button @click.native="roll()" :disabled="!isAuthorized">Roll</md-button>
            <md-button @click.native="clearRolls()" :disabled="!isAuthorized">Clear</md-button>
        </md-card-actions>
    </md-card>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss">
    #rolls {
        .roll-list {
            overflow-y: auto;
            max-height: 275px;

            .md-list-item-container {
                min-height: 35px !important;
            }
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script>
    //------------------------------------------------------------------------------------------------------------------

    import _ from 'lodash';

    // Services
    import diceSvc from '../../../client/services/dice';

    //------------------------------------------------------------------------------------------------------------------

    export default {
        props: {
            skills: {
                type: Array,
                required: true
            },
            isAuthorized: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            sortedSkills(){ return _.orderBy(this.skills, ['rank', 'name'], ['desc', 'asc']); },
            skill(){ return _.find(this.skills.concat([{ id: 'noskill', name: 'No Skill', rank: 0 }]), { id: this.skillID }); }
        },
        methods: {
            roll()
            {
                const roll = diceSvc.rollFudge(_.get(this.skill, 'rank', 0));
                this.rolls.unshift({ roll, name: _.get(this.skill, 'name'), display: `${ roll.render() } = ${ roll.value }` });
                this.rollName = undefined;
            },
            clearRolls()
            {
                this.rolls = [];
                this.dice = null;
                this.rollName = undefined;
            },
        },
        data()
        {
            return {
                skillID: 'noskill',
                rolls: [],
            };
        }
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->