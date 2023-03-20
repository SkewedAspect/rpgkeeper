<!----------------------------------------------------------------------------------------------------------------------
  -- EditBiographyModal
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="edit-biography-modal">
        <b-modal
            ref="innerModal"
            header-bg-variant="dark"
            header-text-variant="white"
            no-close-on-esc
            no-close-on-backdrop
            size="xl"
            @ok="onSave"
        >
            <!-- Modal Header -->
            <template #modal-title>
                <fa icon="file-edit"></fa>
                Edit Biography
            </template>

            <!-- Modal Content -->
            <div :class="`${ mode }-system`">
                <b-form-row>
                    <b-col>
                        <b-form-group
                            label="Name"
                            label-class="font-weight-bold"
                            label-for="name-input"
                        >
                            <b-form-input id="name-input" v-model="name"></b-form-input>
                        </b-form-group>
                    </b-col>
                    <b-col>
                        <b-form-group
                            label="Description"
                            label-class="font-weight-bold"
                            label-for="description-input"
                        >
                            <b-form-input id="description-input" v-model="description"></b-form-input>
                        </b-form-group>
                    </b-col>
                </b-form-row>
                <b-form-row>
                    <b-col>
                        <b-form-group
                            label="Species"
                            label-class="font-weight-bold"
                            label-for="species-input"
                        >
                            <div class="d-flex">
                                <b-input-group>
                                    <b-form-input id="species-input" v-model="species"></b-form-input>
                                    <b-input-group-append>
                                        <b-button @click="species = ''">
                                            <fa icon="times"></fa>
                                        </b-button>
                                    </b-input-group-append>
                                </b-input-group>
                            </div>
                        </b-form-group>
                    </b-col>
                    <b-col v-if="mode === 'eote'" cols="auto">
                        <b-form-group
                            label="Force Sensitive"
                            label-class="font-weight-bold"
                            label-for="species-input"
                            label-sr-only
                        >
                            <b-form-checkbox
                                v-model="forceSensitive"
                                style="margin-top: 2.4rem"
                                name="force-sensitive"
                                switch
                            >
                                Force Sensitive
                            </b-form-checkbox>
                        </b-form-group>
                    </b-col>
                </b-form-row>

                <b-form-row>
                    <b-col xs="12">
                        <b-form-group
                            label="Career"
                            label-class="font-weight-bold"
                            label-for="career-input"
                        >
                            <div class="d-flex">
                                <b-input-group>
                                    <b-form-input id="career-input" v-model="career"></b-form-input>
                                    <b-input-group-append>
                                        <b-button @click="career = ''">
                                            <fa icon="times"></fa>
                                        </b-button>
                                    </b-input-group-append>
                                </b-input-group>
                            </div>
                        </b-form-group>
                    </b-col>
                    <b-col v-if="mode === 'eote'" xs="12">
                        <b-form-group
                            label="Specializations"
                            label-class="font-weight-bold"
                            label-for="special-input"
                        >
                            <div class="d-flex">
                                <b-input-group>
                                    <b-form-input id="special-input" v-model="specialization"></b-form-input>
                                    <b-input-group-append>
                                        <b-button @click="specialization = ''">
                                            <fa icon="times"></fa>
                                        </b-button>
                                    </b-input-group-append>
                                </b-input-group>
                            </div>
                        </b-form-group>
                    </b-col>
                </b-form-row>

                <SupplementSelect
                    ref="suppSelect"
                    label="Abilities"
                    label-class="font-weight-bold"
                    :available="abilities"
                    :selected="selectedAbilitiesArray"
                    @add="onAbilityAdd"
                    @remove="onAbilityRemove"
                    @new="onAbilityNew"
                    @edit="onAbilityEdit"
                    @delete="onAbilityDelete"
                >
                </SupplementSelect>
            </div>

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

        <!-- Modals -->
        <AddEditAbilityModal ref="addEditModal" @add="onAbilityAdd"></AddEditAbilityModal>
        <DeleteModal
            ref="delModal"
            :name="delAbility.name"
            type="ability"
            @hidden="onDelAbilityHidden"
            @delete="onDelAbilityDelete"
        ></DeleteModal>
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, ref } from 'vue';

    // Models
    import { EoteOrGenCharacter } from '../../../../../common/interfaces/systems/eote';

    // Managers
    import eoteMan from '../../../../lib/managers/systems/eote';

    // Components
    import SupplementSelect from '../../../character/supplementSelect.vue';
    import AddEditAbilityModal from './addEditAbilityModal.vue';
    import DeleteModal from '../../../ui/deleteModal.vue';
    import { BModal } from 'bootstrap-vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface BioObj
    {
        name : string;
        description : string;
        career : string;
        species : string;
        specializations : string;
        forceSensitive : boolean;
        abilities : string[];
    }

    interface Events
    {
        (e : 'save', bio : BioObj) : void;
    }

    const emit = defineEmits<Events>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const mode = ref('eote');
    const name = ref('');
    const description = ref('');
    const career = ref('');
    const species = ref('');
    const specialization = ref('');
    const forceSensitive = ref(false);
    const selectedAbilities = ref(new Set());

    const delAbility = ref({
        id: '',
        name: ''
    });

    const innerModal = ref<InstanceType<typeof BModal> | null>(null);
    const addEditModal = ref<InstanceType<typeof AddEditAbilityModal> | null>(null);
    const delModal = ref<InstanceType<typeof DeleteModal> | null>(null);
    const suppSelect = ref<InstanceType<typeof SupplementSelect> | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const abilities = computed(() => eoteMan.abilities);
    const selectedAbilitiesArray = computed(() => Array.from(selectedAbilities.value));

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function show(char : EoteOrGenCharacter) : void
    {
        mode.value = char.system;

        name.value = char.name;
        description.value = char.description;
        career.value = char.details.career;
        species.value = char.details.species;
        selectedAbilities.value = new Set(char.details.abilities);

        if(char.system === 'eote')
        {
            specialization.value = char.details.specialization;
            forceSensitive.value = char.details.force.sensitive;
        }

        innerModal.value.show();
    }

    function hide() : void
    {
        innerModal.value.hide();
    }

    function onSave() : void
    {
        emit('save', {
            name: name.value,
            description: description.value,
            career: career.value,
            species: species.value,
            specializations: specialization.value,
            forceSensitive: forceSensitive.value,
            abilities: Array.from(selectedAbilities.value)
        });
    }

    function onCancel() : void
    {
        name.value = '';
        description.value = '';
        career.value = '';
        species.value = '';
        selectedAbilities.value = new Set();
        specialization.value = '';
        forceSensitive.value = false;
    }

    function onAbilityAdd(ability)
    {
        selectedAbilities.value.add(ability.id);
    }

    function onAbilityRemove(ability)
    {
        selectedAbilities.value.delete(ability.id);
    }

    function onAbilityNew()
    {
        addEditModal.value.show(undefined);
    }

    function onAbilityEdit(ability)
    {
        addEditModal.value.show(ability);
    }

    function onAbilityDelete(ability)
    {
        delAbility.value.id = ability.id;
        delAbility.value.name = ability.name;

        delModal.value.show();
    }

    function onDelAbilityHidden()
    {
        delAbility.value.id = '';
        delAbility.value.name = '';
    }

    async function onDelAbilityDelete()
    {
        suppSelect.value.clearSelection();
        selectedAbilities.value.delete(delAbility.value.id);

        await eoteMan.delSup('abilities', delAbility.value);

        onSave();
    }

    //------------------------------------------------------------------------------------------------------------------

    defineExpose({ show, hide });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
