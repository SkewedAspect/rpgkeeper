<!----------------------------------------------------------------------------------------------------------------------
  -- editSkillsModal
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="edit-skills-modal">
        <b-modal
            ref="innerModal"
            header-bg-variant="dark"
            header-text-variant="white"
            size="xl"
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
            <div class="skill-group">
                <h4>General</h4>
                <div v-for="(skill, index) in skills" :key="index" class="mb-2">
                    <div v-if="skill.type === 'general'" class="d-flex">
                        <b-btn-group>
                            <b-btn :disabled="index === 0" @click="moveSkillUp(index)">
                                <fa icon="chevron-up"></fa>
                            </b-btn>
                            <b-btn :disabled="index === (skills.length - 1)" @click="moveSkillDown(index)">
                                <fa icon="chevron-down"></fa>
                            </b-btn>
                        </b-btn-group>
                        <b-form-input v-model="skill.name" class="ml-2" placeholder="Name"></b-form-input>
                        <b-form-checkbox v-model="skill.career" class="ml-2 mt-2" name="check-button" switch>
                            Career
                        </b-form-checkbox>
                        <b-form-input v-model="skill.ranks" number class="ml-2" type="number" min="0" max="5" step="1" style="max-width: 60px; min-width: 60px;"></b-form-input>
                        <b-form-select v-model="skill.characteristic" class="ml-2" :options="characteristics"></b-form-select>
                        <b-form-select v-model="skill.type" class="ml-2" :options="skillTypes"></b-form-select>
                        <b-btn variant="danger" class="ml-2" @click="removeSkill(index)">
                            <fa icon="trash-alt"></fa>
                        </b-btn>
                    </div>
                </div>
                <h5 v-if="skills.filter((skill) => skill.type === 'general').length === 0" class="text-center">
                    No skills.
                </h5>
            </div>
            <div v-if="mode === 'genesys'" class="skill-group">
                <h4>Magic</h4>
                <div v-for="(skill, index) in skills" :key="index" class="mb-2">
                    <div v-if="skill.type === 'magic'" class="d-flex">
                        <b-btn-group>
                            <b-btn :disabled="index === 0" @click="moveSkillUp(index)">
                                <fa icon="chevron-up"></fa>
                            </b-btn>
                            <b-btn :disabled="index === (skills.length - 1)" @click="moveSkillDown(index)">
                                <fa icon="chevron-down"></fa>
                            </b-btn>
                        </b-btn-group>
                        <b-form-input v-model="skill.name" class="ml-2" placeholder="Name"></b-form-input>
                        <b-form-checkbox v-model="skill.career" class="ml-2 mt-2" name="check-button" switch>
                            Career
                        </b-form-checkbox>
                        <b-form-input v-model="skill.ranks" number class="ml-2" type="number" min="0" max="5" step="1" style="max-width: 60px; min-width: 60px;"></b-form-input>
                        <b-form-select v-model="skill.characteristic" class="ml-2" :options="characteristics"></b-form-select>
                        <b-form-select v-model="skill.type" class="ml-2" :options="skillTypes"></b-form-select>
                        <b-btn variant="danger" class="ml-2" @click="removeSkill(index)">
                            <fa icon="trash-alt"></fa>
                        </b-btn>
                    </div>
                </div>
                <h5 v-if="skills.filter((skill) => skill.type === 'magic').length === 0" class="text-center">
                    No skills.
                </h5>
            </div>
            <div class="skill-group">
                <h4>Combat</h4>
                <div v-for="(skill, index) in skills" :key="index" class="mb-2">
                    <div v-if="skill.type === 'combat'" class="d-flex">
                        <b-btn-group>
                            <b-btn :disabled="index === 0" @click="moveSkillUp(index)">
                                <fa icon="chevron-up"></fa>
                            </b-btn>
                            <b-btn :disabled="index === (skills.length - 1)" @click="moveSkillDown(index)">
                                <fa icon="chevron-down"></fa>
                            </b-btn>
                        </b-btn-group>
                        <b-form-input v-model="skill.name" class="ml-2" placeholder="Name"></b-form-input>
                        <b-form-checkbox v-model="skill.career" class="ml-2 mt-2" name="check-button" switch>
                            Career
                        </b-form-checkbox>
                        <b-form-input v-model="skill.ranks" number class="ml-2" type="number" min="0" max="5" step="1" style="max-width: 60px; min-width: 60px;"></b-form-input>
                        <b-form-select v-model="skill.characteristic" class="ml-2" :options="characteristics"></b-form-select>
                        <b-form-select v-model="skill.type" class="ml-2" :options="skillTypes"></b-form-select>
                        <b-btn variant="danger" class="ml-2" @click="removeSkill(index)">
                            <fa icon="trash-alt"></fa>
                        </b-btn>
                    </div>
                </div>
                <h5 v-if="skills.filter((skill) => skill.type === 'combat').length === 0" class="text-center">
                    No skills.
                </h5>
            </div>
            <div class="skill-group">
                <h4>Social</h4>
                <div v-for="(skill, index) in skills" :key="index" class="mb-2">
                    <div v-if="skill.type === 'social'" class="d-flex">
                        <b-btn-group>
                            <b-btn :disabled="index === 0" @click="moveSkillUp(index)">
                                <fa icon="chevron-up"></fa>
                            </b-btn>
                            <b-btn :disabled="index === (skills.length - 1)" @click="moveSkillDown(index)">
                                <fa icon="chevron-down"></fa>
                            </b-btn>
                        </b-btn-group>
                        <b-form-input v-model="skill.name" class="ml-2" placeholder="Name"></b-form-input>
                        <b-form-checkbox v-model="skill.career" class="ml-2 mt-2" name="check-button" switch>
                            Career
                        </b-form-checkbox>
                        <b-form-input v-model="skill.ranks" number class="ml-2" type="number" min="0" max="5" step="1" style="max-width: 60px; min-width: 60px;"></b-form-input>
                        <b-form-select v-model="skill.characteristic" class="ml-2" :options="characteristics"></b-form-select>
                        <b-form-select v-model="skill.type" class="ml-2" :options="skillTypes"></b-form-select>
                        <b-btn variant="danger" class="ml-2" @click="removeSkill(index)">
                            <fa icon="trash-alt"></fa>
                        </b-btn>
                    </div>
                </div>
                <h5 v-if="skills.filter((skill) => skill.type === 'social').length === 0" class="text-center">
                    No skills.
                </h5>
            </div>
            <div class="skill-group">
                <h4>Knowledge</h4>
                <div v-for="(skill, index) in skills" :key="index" class="mb-2">
                    <div v-if="skill.type === 'knowledge'" class="d-flex">
                        <b-btn-group>
                            <b-btn :disabled="index === 0" @click="moveSkillUp(index)">
                                <fa icon="chevron-up"></fa>
                            </b-btn>
                            <b-btn :disabled="index === (skills.length - 1)" @click="moveSkillDown(index)">
                                <fa icon="chevron-down"></fa>
                            </b-btn>
                        </b-btn-group>
                        <b-form-input v-model="skill.name" class="ml-2" placeholder="Name"></b-form-input>
                        <b-form-checkbox v-model="skill.career" class="ml-2 mt-2" name="check-button" switch>
                            Career
                        </b-form-checkbox>
                        <b-form-input v-model="skill.ranks" number class="ml-2" type="number" min="0" max="5" step="1" style="max-width: 60px; min-width: 60px;"></b-form-input>
                        <b-form-select v-model="skill.characteristic" class="ml-2" :options="characteristics"></b-form-select>
                        <b-form-select v-model="skill.type" class="ml-2" :options="skillTypes"></b-form-select>
                        <b-btn variant="danger" class="ml-2" @click="removeSkill(index)">
                            <fa icon="trash-alt"></fa>
                        </b-btn>
                    </div>
                </div>
                <h5 v-if="skills.filter((skill) => skill.type === 'knowledge').length === 0" class="text-center">
                    No skills.
                </h5>
            </div>

            <hr />

            <b-card
                header="New Skill"
                header-bg-variant="dark"
                header-text-variant="white"
            >
                <div class="d-flex">
                    <b-form-input v-model="newSkill.name" class="ml-2" placeholder="Name"></b-form-input>
                    <b-form-checkbox v-model="newSkill.career" class="ml-2 mt-2" name="check-button" switch>
                        Career
                    </b-form-checkbox>
                    <b-form-input v-model="newSkill.ranks" number class="ml-2" type="number" min="0" max="5" step="1" style="max-width: 60px; min-width: 60px;"></b-form-input>
                    <b-form-select v-model="newSkill.characteristic" class="ml-2" :options="characteristics"></b-form-select>
                    <b-form-select v-model="newSkill.type" class="ml-2" :options="skillTypes"></b-form-select>
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

    // Models
    import { EoteOrGenCharacter, EoteSkill } from '../../../../../common/interfaces/systems/eote';

    // Components
    import { BModal } from 'bootstrap-vue';
    import { startCase } from '../../../../../common/utils/misc';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Events
    {
        (e : 'save', skills : EoteSkill[]) : void;
    }

    const emit = defineEmits<Events>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const newSkill = ref({
        name: '',
        career: false,
        characteristic: '',
        type: '',
        ranks: 0

    });

    const mode = ref('eote');
    const skills = ref<EoteSkill[]>([]);
    const characteristics = ref([]);

    const innerModal = ref<InstanceType<typeof BModal> | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const isAddValid = computed(() =>
    {
        return isFinite(newSkill.value.ranks)
            && !!newSkill.value.name
            && !!newSkill.value.characteristic
            && !!newSkill.value.type;
    });

    const skillTypes = computed(() =>
    {
        return [ 'general', 'magic', 'combat', 'social', 'knowledge' ]
            .filter((type) =>
            {
                return type !== 'magic' || mode.value === 'genesys';
            })
            .map((type) => ({ text: startCase(type), value: type }));
    });

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function show(char : EoteOrGenCharacter) : void
    {
        skills.value = char.details.skills;

        characteristics.value = Object.keys(char.details.characteristics)
            .sort()
            .map((item) => ({ text: startCase(item), value: item }));

        innerModal.value.show();
    }

    function hide() : void
    {
        innerModal.value.hide();
    }

    function onSave() : void
    {
        emit('save', skills.value);
    }

    function onCancel() : void
    {
        skills.value = [];
        characteristics.value = [];
    }

    function addSkill () : void
    {
        // Split skills list into each section
        const skillsSplit = {
            general: skills.value.filter((skill) => skill.type === 'general'),
            magic: skills.value.filter((skill) => skill.type === 'magic'),
            combat: skills.value.filter((skill) => skill.type === 'combat'),
            social: skills.value.filter((skill) => skill.type === 'social'),
            knowledge: skills.value.filter((skill) => skill.type === 'knowledge')
        };

        // Add new skill to the right type list
        skillsSplit[newSkill.value.type].push(newSkill.value);

        // Rebuild skills list in proper order
        skills.value = [].concat(
            skillsSplit.general,
            skillsSplit.magic,
            skillsSplit.combat,
            skillsSplit.social,
            skillsSplit.knowledge
        );

        // Reset new skill
        newSkill.value = {
            name: '',
            career: false,
            characteristic: '',
            type: '',
            ranks: 0
        };
    }

    function removeSkill(index : number) : void
    {
        skills.value.splice(index, 1);
    }

    function moveSkillUp(index : number) : void
    {
        if(index > 0)
        {
            const start = index;
            const end = index - 1;
            skills.value.splice(end, 0, skills.value.splice(start, 1)[0]);
        }
    }

    function moveSkillDown(index : number) : void
    {
        if(index < this.skills.length)
        {
            const start = index;
            const end = index + 1;
            this.skills.splice(end, 0, this.skills.splice(start, 1)[0]);
        }
    }

    //------------------------------------------------------------------------------------------------------------------

    defineExpose({ show, hide });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
