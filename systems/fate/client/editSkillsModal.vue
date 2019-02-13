<!----------------------------------------------------------------------------------------------------------------------
  -- editSkillsModal
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="edit-skills-modal" v-if="skills">
        <b-modal ref="modal"
            header-bg-variant="dark"
            header-text-variant="white"
            size="lg"
            @ok="onSave"
            @cancel="onCancel"
            @shown="onShown">

            <!-- Modal Header -->
            <template slot="modal-title">
                <font-awesome-icon icon="file-edit"></font-awesome-icon>
                Edit Skills
            </template>

            <!-- Modal Content -->

            <div class="d-flex mb-2" v-for="skill in skillsSorted">
                <b-form-input v-model="skill.name"></b-form-input>
                <b-form-input class="ml-2" type="number" v-model="skill.rank" min="0" step="1" max="5" style="max-width: 65px"></b-form-input>
                <b-btn variant="danger" class="ml-2" @click="removeSkill(skill)">
                    <font-awesome-icon icon="trash-alt"></font-awesome-icon>
                </b-btn>
            </div>

            <hr>

            <b-card header="New Skill"
                header-bg-variant="dark"
                header-text-variant="white">
                <div class="d-flex">
                    <b-form-input id="name-input" v-model="newSkillName" placeholder="Skill name"></b-form-input>
                    <b-form-input class="ml-2" id="rank-input" type="number" v-model.number="newSkillRank" min="0" step="1" max="5" style="max-width: 65px"></b-form-input>
                    <b-btn variant="primary" class="ml-2 text-nowrap" @click="addSkill">
                        <font-awesome-icon icon="plus"></font-awesome-icon>
                        Add
                    </b-btn>
                </div>
            </b-card>

            <!-- Modal Buttons -->
            <template slot="modal-ok">
                <font-awesome-icon icon="save"></font-awesome-icon>
                Save
            </template>
            <template slot="modal-cancel">
                <font-awesome-icon icon="times"></font-awesome-icon>
                Cancel
            </template>
        </b-modal>
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss">
    .edit-skills-modal {
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script>
    //------------------------------------------------------------------------------------------------------------------

    import _ from 'lodash';

    // Managers
    import charMan from '../../../client/api/managers/character';

    //------------------------------------------------------------------------------------------------------------------

    export default {
        name: 'EditSkillsModal',
        props: {
            value: {
                type: Array,
                required: true
            }
        },
        computed: {
            skillsSorted()
            {
                //return _.orderBy(this.skills, [ 'rank', 'name' ], [ 'desc', 'asc' ]);
                return this.skills;
            }
        },
        methods: {
            onShown()
            {
                // Copy the v-model value over our skills array.
                this.skills = _.cloneDeep(this.value);

                // Sort on shown
                this.skills = _.orderBy(this.skills, [ 'rank', 'name' ], [ 'desc', 'asc' ]);
            },
            onSave()
            {
                this.$emit('input', this.skills);

                // We have to wait for things to settle from updating the model
                this.$nextTick(async () =>
                {
                    // Save the character
                    try { await charMan.save(); }
                    catch(error)
                    {
                        // TODO: Let the user know about this!
                    } // end if
                });
            },
            onCancel()
            {
                // Clear our local variable
                this.skills = [];
            },

            addSkill()
            {
                this.skills.push({ name: this.newSkillName, rank: this.newSkillRank });
                this.newSkillName = '';
                this.newSkillRank = 0;
            },
            removeSkill(skill)
            {
                // We can't use lodash, since Vue doesn't track whatever magic `_.pull` does.
                // See: https://vuejs.org/v2/guide/list.html#Array-Change-Detection
                const idx = _.findIndex(this.skills, skill);
                if(idx > -1)
                {
                    this.skills.splice(idx, 1);
                } // end if
            },

            show()
            {
                this.$refs.modal.show();
            },
            hide()
            {
                this.$refs.modal.hide();
            }
        },
        data()
        {
            return {
                skills: _.cloneDeep(this.value),
                newSkillName: '',
                newSkillRank: 0
            };
        }
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
