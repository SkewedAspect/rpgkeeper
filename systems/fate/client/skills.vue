<!----------------------------------------------------------------------------------------------------------------------
  -- Skills Component
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <rpgk-card id="fate-skills" class="ml-2" :class="{ readonly: readonly }" no-body fill>
        <div slot="header" class="d-flex">
            <h5 class="align-items-center d-flex text-nowrap m-0 mr-2 flex-grow-0 flex-shrink-0 w-auto">
                <font-awesome-icon class="mr-1" icon="scroll"></font-awesome-icon>
                <span class="d-none d-md-inline">Skills</span>
            </h5>
            <div class="ml-auto" v-if="!readonly">
                <b-btn @click="openEditModal()" size="sm" style="margin-bottom: 1px;">
                    <font-awesome-icon icon="edit" fixed-width></font-awesome-icon>
                    <span class="d-none d-md-inline">Edit</span>
                </b-btn>
            </div>
        </div>

        <!-- Content -->
        <table class="table table-bordered mb-0 font-sm">
            <tr v-for="{ name, skills } in rows">
                <td class="text-right text-nowrap" style="width: 1%">
                    <b>{{ name }}</b>
                </td>
                <td style="min-width: 80px" v-for="columnIdx in columns">
                    {{ (skills[columnIdx] || {}).name }}
                </td>
            </tr>
        </table>

        <!-- Modals -->
        <edit-skills-modal ref="editModal" v-model="skills" :readonly="readonly"></edit-skills-modal>
    </rpgk-card>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss" scoped>
    #fate-skills {
        table {
            border-left: none !important;
            border-right: none !important;

            td:first-child {
                border-left: none !important;
            }

            td:last-child {
                border-right: none !important;
            }
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script>
    //------------------------------------------------------------------------------------------------------------------

    import _ from 'lodash';

    // Components
    import RpgkCard from '../../../client/components/ui/card.vue';
    import EditSkillsModal from './editSkillsModal.vue';

    //------------------------------------------------------------------------------------------------------------------

    export default {
        name: 'FateSkillsCard',
        components: {
            EditSkillsModal,
            RpgkCard
        },
        props: {
            value: {
                type: Array,
                required: true
            },
            readonly: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            skills: {
                get(){ return this.value },
                set(val){ this.$emit('input', val); }
            },
            averageSkills(){ return _.filter(this.skills, { rank: 1 }); },
            fairSkills(){ return _.filter(this.skills, { rank: 2 }); },
            goodSkills(){ return _.filter(this.skills, { rank: 3 }); },
            greatSkills(){ return _.filter(this.skills, { rank: 4 }); },
            superbSkills(){ return _.filter(this.skills, { rank: 5 }); },

            rows()
            {
                const skillList = [
                    {
                        name: 'Superb (+5)',
                        skills: this.superbSkills
                    },
                    {
                        name: 'Great (+4)',
                        skills: this.greatSkills
                    },
                    {
                        name: 'Good (+3)',
                        skills: this.goodSkills
                    },
                    {
                        name: 'Fair (+2)',
                        skills: this.fairSkills
                    },
                    {
                        name: 'Average (+1)',
                        skills: this.averageSkills
                    }
                ];

                return _.filter(skillList, ({ skills }) =>
                {
                    return skills.length > 0;
                });
            },
            columns()
            {
                const maxLength = this.rows.reduce((max, { skills }) => Math.max(max, skills.length), 5);
                return _.range(maxLength);
            }
        },
        methods: {
            openEditModal()
            {
                this.$refs.editModal.show();
            }

            // getSkillName(list, idx)
            // {
            //     return _.get(this, `${ list }[${ idx }].name`, '');
            // },
            // addNew()
            // {
            //     this.skillsEdit.push(_.cloneDeep(this.newSkill));
            //     this.newSkill.name = '';
            //     this.newSkill.rank = 0;
            // },
            // addOrUpdateSkill(skill)
            // {
            //     if(skill.id)
            //     {
            //         const originalSkill = _.find(this.skills, { id: skill.id });
            //         originalSkill.name = skill.name;
            //         originalSkill.rank = skill.rank;
            //     }
            //     else
            //     {
            //         this.skills.push({ id: shortID(), name: skill.name, rank: skill.rank });
            //     } // end if
            // },
            // removeSkill(skill)
            // {
            //     const skillIndex = _.findIndex(this.skills, { id: skill.id });
            //     if(skillIndex !== -1)
            //     {
            //         this.skills.splice(skillIndex, 1);
            //     } // end if
            // },
            // openEdit()
            // {
            //     this.skillsEdit = _.cloneDeep(this.skills);
            //     this.newSkill.name = '';
            //     this.newSkill.rank = 0;
            //
            //     // Open the dialog
            //     this.$refs.editDialog.open();
            // },
            // closeEdit(save)
            // {
            //     if(save)
            //     {
            //         _.each(this.skillsEdit, (skill) =>
            //         {
            //             if(skill.rank > 0)
            //             {
            //                 this.addOrUpdateSkill(skill);
            //             }
            //             else if(skill.id)
            //             {
            //                 this.removeSkill(skill);
            //             } // end if
            //         });
            //     } // end if
            //
            //     this.skillsEdit = _.cloneDeep(this.skills);
            //     this.newSkill.name = '';
            //     this.newSkill.rank = 0;
            //
            //     // Close the dialog
            //     this.$refs.editDialog.close();
            // }
        },
        data()
        {
            return {
                // skillsEdit: [],
                // newSkill: {
                //     name: '',
                //     rank: 0
                // }
            };
        }
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
