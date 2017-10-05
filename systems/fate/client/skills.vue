<!--------------------------------------------------------------------------------------------------------------------->
<!-- Skills Component                                                                                                -->
<!--------------------------------------------------------------------------------------------------------------------->

<template>
    <md-card id="fate-skills" style="flex: 1">
        <md-toolbar class="md-dense">
            <h2 style="flex: 1" class="md-title">Skills</h2>
            <md-button @click="openEdit()">Edit</md-button>
        </md-toolbar>

        <table class="md-static-table">
            <tr>
                <td><b>Superb (+5)</b></td>
                <td v-for="idx in columns">{{ getSkillName('superb', idx) }}</td>
            </tr>
            <tr>
                <td><b>Great (+4)</b></td>
                <td v-for="idx in columns">{{ getSkillName('great', idx) }}</td>
            </tr>
            <tr>
                <td><b>Good (+3)</b></td>
                <td v-for="idx in columns">{{ getSkillName('good', idx) }}</td>
            </tr>
            <tr>
                <td><b>Fair (+2)</b></td>
                <td v-for="idx in columns">{{ getSkillName('fair', idx) }}</td>
            </tr>
            <tr>
                <td><b>Average (+1)</b></td>
                <td v-for="idx in columns">{{ getSkillName('average', idx) }}</td>
            </tr>
        </table>

        <!-- Edit Dialog -->
        <md-dialog id="fate-edit-skills" ref="editDialog">
            <md-dialog-title>Edit Skills</md-dialog-title>
            <md-dialog-content>
                <p>To remove a skill, simply set it's rank to <code>0</code>, and then save.</p>
                <md-layout md-gutter="16">
                    <md-layout md-flex="50" v-for="skill in skillsEdit" :key="skill.id">
                        <md-layout md-flex="75">
                            <md-input-container>
                                <label>Name</label>
                                <md-input v-model="skill.name"></md-input>
                            </md-input-container>
                        </md-layout>
                        <md-layout md-flex="25">
                            <md-input-container>
                                <label>Ranks</label>
                                <md-input type="number" v-model="skill.rank"></md-input>
                            </md-input-container>
                        </md-layout>
                    </md-layout>
                </md-layout>
                <md-card v-flex="1" style="margin-top: 10px;">
                    <md-card-content>
                        <md-layout md-gutter="8">
                            <md-layout>
                                <md-layout md-flex="75">
                                    <md-input-container>
                                        <label>Name</label>
                                        <md-input v-model="newSkill.name"></md-input>
                                    </md-input-container>
                                </md-layout>
                                <md-layout md-flex="25">
                                    <md-input-container>
                                        <label>Ranks</label>
                                        <md-input type="number" v-model="newSkill.rank"></md-input>
                                    </md-input-container>
                                </md-layout>
                            </md-layout>
                            <md-layout v-flex="shrink">
                                <div style="padding-top: 10px;">
                                    <md-button class="md-raised" @click="addNew()" :disabled="!newSkill.name || (newSkill.rank <= 0)">
                                        Add
                                    </md-button>
                                </div>
                            </md-layout>
                        </md-layout>
                    </md-card-content>
                </md-card>
            </md-dialog-content>

            <md-dialog-actions>
                <md-button class="md-primary" @click.native="closeEdit()">Cancel</md-button>
                <md-button class="md-accent" @click.native="closeEdit(true)">Save</md-button>
            </md-dialog-actions>
        </md-dialog>
    </md-card>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss">
    #fate-skills {
        table {
            height: calc(100% - 48px);

            tr {
                td:first-child {
                    width: 1%;
                    white-space: nowrap;
                    text-align: right;
                }
            }
        }
    }

    #fate-edit-skills .md-dialog {
        min-width: 80%;
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script>
    //------------------------------------------------------------------------------------------------------------------
    
    import _ from 'lodash';

    // Pull in the shortID utility
    import { shortID } from '../../../server/utilities';

    //------------------------------------------------------------------------------------------------------------------

    export default {
        props: {
            skills: {
                type: Array,
                required: true
            }
        },
        computed: {
            average()
            {
                const skills = _.filter(this.skills, { rank: 1 });

                // Ensure that we have a minimum length of 5, for display reasons
                skills.length = Math.max(5, skills.length);

                return skills;
            },
            fair(){ return _.filter(this.skills, { rank: 2 }) },
            good(){ return _.filter(this.skills, { rank: 3 }) },
            great(){ return _.filter(this.skills, { rank: 4 }) },
            superb(){ return _.filter(this.skills, { rank: 5 }) },

            // Should be a list of indexes for the other computed properties.
            columns(){ return _.range(this.average.length); }
        },
        methods: {
            getSkillName(list, idx)
            {
                return _.get(this, `${ list }[${ idx }].name`, '');
            },
            addNew()
            {
                this.skillsEdit.push(_.cloneDeep(this.newSkill));
                this.newSkill.name = '';
                this.newSkill.rank = 0;
            },
            addOrUpdateSkill(skill)
            {
                if(skill.id)
                {
                    const originalSkill = _.find(this.skills, { id: skill.id });
                    originalSkill.name = skill.name;
                    originalSkill.rank = skill.rank;
                }
                else
                {
                    this.skills.push({ id: shortID(), name: skill.name, rank: skill.rank });
                } // end if
            },
            removeSkill(skill)
            {
                const skillIndex = _.findIndex(this.skills, { id: skill.id });
                if(skillIndex !== -1)
                {
                    this.skills.splice(skillIndex, 1);
                } // end if
            },
            openEdit()
            {
                this.skillsEdit = _.cloneDeep(this.skills);
                this.newSkill.name = '';
                this.newSkill.rank = 0;

                // Open the dialog
                this.$refs.editDialog.open();
            },
            closeEdit(save)
            {
                if(save)
                {
                    _.each(this.skillsEdit, (skill) =>
                    {
                        if(skill.rank > 0)
                        {
                            this.addOrUpdateSkill(skill);
                        }
                        else if(skill.id)
                        {
                            this.removeSkill(skill);
                        } // end if
                    });
                } // end if

                this.skillsEdit = _.cloneDeep(this.skills);
                this.newSkill.name = '';
                this.newSkill.rank = 0;

                // Close the dialog
                this.$refs.editDialog.close();
            }
        },
        data()
        {
            return {
                skillsEdit: [],
                newSkill: {
                    name: '',
                    rank: 0
                }
            };
        }
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->