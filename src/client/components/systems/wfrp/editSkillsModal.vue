<!----------------------------------------------------------------------------------------------------------------------
  -- editSkillsModal
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="edit-skills-modal">
        <b-modal
            ref="innerModal"
            header-bg-variant="dark"
            header-text-variant="white"
            size="lg"
            no-close-on-esc
            no-close-on-backdrop
            @ok="onSave"
            @cancel="onCancel"
        >
            <!-- Modal Header -->
            <template #modal-title>
                <fa icon="file-edit"></fa>
                Edit Skills
            </template>

            <!-- Modal Content -->
            <div v-for="(skill, index) in skills" :key="index" class="d-flex mb-2">
                <b-form-input v-model="skill.value" number type="number" min="1" max="99" step="1" style="max-width: 60px; min-width: 60px;"></b-form-input>
                <b-form-input v-model="skill.description" class="ml-2" placeholder="Description"></b-form-input>
                <b-btn variant="danger" class="ml-2" @click="removeSkill(skill)">
                    <fa icon="trash-alt"></fa>
                </b-btn>
            </div>

            <hr />

            <b-card
                header="New Skill"
                header-bg-variant="dark"
                header-text-variant="white"
            >
                <div class="d-flex">
                    <b-form-input v-model="newValue" number type="number" min="1" max="99" step="1" style="max-width: 60px; min-width: 60px;"></b-form-input>
                    <b-form-input id="new-desc" v-model="newDesc" class="ml-2" placeholder="Description"></b-form-input>
                    <b-btn variant="primary" class="ml-2 text-nowrap" :disabled="!isAddValid" @click="addSkill">
                        <fa icon="plus"></fa>
                        Add
                    </b-btn>
                </div>
            </b-card>

            <!-- Modal Buttons -->
            <template #modal-ok>
                <fa icon="save"></fa>
                Save
            </template>
            <template #modal-cancel>
                <fa icon="times"></fa>
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

<script lang="ts" setup>
    import { computed, ref } from 'vue';

    // Interfaces
    import { WFRPSkill } from '../../../../common/interfaces/systems/wfrp';

    // Components
    import { BModal } from 'bootstrap-vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Events
    {
        (e : 'save', hooks : Record<string, unknown>[]) : void;
    }

    const emit = defineEmits<Events>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const skills = ref<Record<string, unknown>[]>([]);
    const newValue = ref<number>(1);
    const newDesc = ref<string>('');

    const innerModal = ref<InstanceType<typeof BModal> | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const isAddValid = computed(() =>
    {
        return Number.isFinite(newValue.value) && !!newDesc.value;
    });

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function show(charSkills : WFRPSkill[]) : void
    {
        // Clone the array of skills
        skills.value = charSkills.map((skill) => ({ ...skill }));

        // Show the modal
        innerModal.value.show();
    }

    function hide() : void
    {
        innerModal.value.hide();
    }

    function onSave() : void
    {
        emit('save', skills.value);
        skills.value = [];
    }

    function onCancel() : void
    {
        skills.value = [];
    }

    function addSkill() : void
    {
        skills.value.push({
            description: newDesc.value,
            value: newValue.value
        });

        newDesc.value = '';
        newValue.value = 1;
    }

    function removeSkill(skill : WFRPSkill) : void
    {
        const idx = skills.value.findIndex((item) => item === skill);
        if(idx > -1)
        {
            skills.value.splice(idx, 1);
        }
    }

    //------------------------------------------------------------------------------------------------------------------

    defineExpose({ show, hide });

    // export default defineComponent({
    //     name: 'EditSkillsModal',
    //     props: {
    //         value: {
    //             type: Array,
    //             required: true
    //         }
    //     },
    //     emits: [ 'input' ],
    //     data()
    //     {
    //         return {
    //             skills: _.cloneDeep(this.value),
    //             newValue: 1,
    //             newDesc: ''
    //         };
    //     },
    //     computed: {
    //         isAddValid()
    //         {
    //             return _.isFinite(this.newValue) && !!this.newDesc;
    //         }
    //     },
    //     methods: {
    //         onShown()
    //         {
    //             // Copy the v-model value over our skills array.
    //             this.skills = _.cloneDeep(this.value);
    //         },
    //         onSave()
    //         {
    //             // Filter out invalid skills.
    //             this.skills = this.skills.filter((skill) => _.isFinite(skill.value) && !!skill.description);
    //
    //             this.$emit('input', this.skills);
    //
    //             // We have to wait for things to settle from updating the model
    //             this.$nextTick(async() =>
    //             {
    //                 // Save the character
    //                 try { await charMan.save(); }
    //                 catch (error)
    //                 {
    //                     console.error('Error saving:', error);
    //                     // TODO: Let the user know about this!
    //                 }
    //             });
    //         },
    //         onCancel()
    //         {
    //             // Clear our local variable
    //             this.skills = [];
    //         },
    //
    //         addSkill()
    //         {
    //             this.skills.push({
    //                 description: this.newDesc,
    //                 value: this.newValue
    //             });
    //             this.newDesc = '';
    //             this.newValue = 1;
    //         },
    //         removeSkills(skill)
    //         {
    //             // We can't use lodash, since Vue doesn't track whatever magic `_.pull` does.
    //             // See: https://vuejs.org/v2/guide/list.html#Array-Change-Detection
    //             const idx = _.findIndex(this.skills, skill);
    //             if(idx > -1)
    //             {
    //                 this.skills.splice(idx, 1);
    //             }
    //         },
    //
    //         show()
    //         {
    //             this.$refs.modal.show();
    //         },
    //         hide()
    //         {
    //             this.$refs.modal.hide();
    //         }
    //     }
    // });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
