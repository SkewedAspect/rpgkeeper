<!----------------------------------------------------------------------------------------------------------------------
  -- EditBiographyModal
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="edit-biography-modal">
        <BModal
            ref="innerModal"
            header-bg-variant="dark"
            header-text-variant="white"
            no-close-on-esc
            no-close-on-backdrop
            size="xl"
            @ok="onSave"
            @hidden="onCancel"
        >
            <!-- Modal Header -->
            <template #header="{ cancel }">
                <h5 v-b-color-mode="'dark'" class="w-100 mb-0">
                    <Fa icon="file-edit" />
                    Edit Biography
                    <CloseButton class="float-end" @click="cancel" />
                </h5>
            </template>

            <!-- Modal Content -->
            <div :class="`${ mode }-system`">
                <BFormRow>
                    <BCol>
                        <BFormGroup
                            label="Name"
                            label-class="fw-bold"
                            label-for="name-input"
                        >
                            <BFormInput id="name-input" v-model="name" />
                        </BFormGroup>
                    </BCol>
                    <BCol>
                        <BFormGroup
                            label="Description"
                            label-class="fw-bold"
                            label-for="description-input"
                        >
                            <BFormInput id="description-input" v-model="description" />
                        </BFormGroup>
                    </BCol>
                </BFormRow>
                <BFormRow>
                    <BCol>
                        <BFormGroup
                            label="Species"
                            label-class="fw-bold"
                            label-for="species-input"
                        >
                            <div class="d-flex">
                                <BInputGroup>
                                    <BFormInput id="species-input" v-model="species" />
                                    <template #append>
                                        <BButton @click="species = ''">
                                            <Fa icon="times" />
                                        </BButton>
                                    </template>
                                </BInputGroup>
                            </div>
                        </BFormGroup>
                    </BCol>
                    <BCol v-if="mode === 'eote'" cols="auto">
                        <BFormGroup
                            label="Force Sensitive"
                            label-class="fw-bold"
                            label-for="species-input"
                            label-sr-only
                            style="margin-top: 2.4rem"
                        >
                            <BFormCheckbox
                                v-model="forceSensitive"
                                name="force-sensitive"
                                switch
                            >
                                Force Sensitive
                            </BFormCheckbox>
                        </BFormGroup>
                    </BCol>
                </BFormRow>

                <BFormRow>
                    <BCol xs="12">
                        <BFormGroup
                            label="Career"
                            label-class="fw-bold"
                            label-for="career-input"
                        >
                            <div class="d-flex">
                                <BInputGroup>
                                    <BFormInput id="career-input" v-model="career" />
                                    <template #append>
                                        <BButton @click="career = ''">
                                            <Fa icon="times" />
                                        </BButton>
                                    </template>
                                </BInputGroup>
                            </div>
                        </BFormGroup>
                    </BCol>
                    <BCol v-if="mode === 'eote'" xs="12">
                        <BFormGroup
                            label="Specializations"
                            label-class="fw-bold"
                            label-for="special-input"
                        >
                            <div class="d-flex">
                                <BInputGroup>
                                    <BFormInput id="special-input" v-model="specialization" />
                                    <template #append>
                                        <BButton @click="specialization = ''">
                                            <Fa icon="times" />
                                        </BButton>
                                    </template>
                                </BInputGroup>
                            </div>
                        </BFormGroup>
                    </BCol>
                </BFormRow>

                <SupplementSelect
                    ref="suppSelect"
                    label="Abilities"
                    label-class="fw-bold"
                    :available="abilities"
                    :selected="selectedAbilitiesArray"
                    @add="onAbilityAdd"
                    @remove="onAbilityRemove"
                    @new="onAbilityNew"
                    @edit="onAbilityEdit"
                    @delete="onAbilityDelete"
                />
            </div>

            <!-- Modal Buttons -->
            <template #ok="{ ok }">
                <BButton variant="primary" @click="ok">
                    <Fa icon="save" />
                    Save
                </BButton>
            </template>
            <template #cancel="{ cancel }">
                <BButton variant="secondary" @click="cancel">
                    <Fa icon="times" />
                    Cancel
                </BButton>
            </template>
        </BModal>

        <!-- Modals -->
        <AddEditAbilityModal ref="addEditModal" @add="onAbilityAdd" />
        <DeleteModal
            ref="delModal"
            :name="delAbility.name"
            type="ability"
            @hidden="onDelAbilityHidden"
            @delete="onDelAbilityDelete"
        />
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, ref } from 'vue';

    // Models
    import type { EoteAbility, EoteOrGenCharacter } from '../../../models.ts';

    // Stores
    import { useSupplementStore } from '@client/lib/resource-access/stores/supplements';

    // Components
    import SupplementSelect from '@client/components/character/supplementSelect.vue';
    import AddEditAbilityModal from './addEditAbilityModal.vue';
    import DeleteModal from '@client/components/ui/deleteModal.vue';
    import { BModal } from 'bootstrap-vue-next';
    import CloseButton from '@client/components/ui/closeButton.vue';

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

    type Events = (e : 'save', bio : BioObj) => void;

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
    const selectedAbilities = ref(new Set<string>());

    const delAbility = ref<{ id : string | undefined; name : string }>({
        id: undefined,
        name: '',
    });

    const innerModal = ref<InstanceType<typeof BModal> | null>(null);
    const addEditModal = ref<InstanceType<typeof AddEditAbilityModal> | null>(null);
    const delModal = ref<InstanceType<typeof DeleteModal> | null>(null);
    const suppSelect = ref<InstanceType<typeof SupplementSelect> | null>(null);

    const supplementStore = useSupplementStore();

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const abilities = computed(() => supplementStore.get(mode.value, 'ability'));
    const selectedAbilitiesArray = computed(() => Array.from(selectedAbilities.value));

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function show(char : EoteOrGenCharacter) : void
    {
        mode.value = char.system;

        name.value = char.name;
        description.value = char.description ?? '';
        career.value = char.details.career;
        species.value = char.details.species;
        selectedAbilities.value = new Set(char.details.abilities);

        if(char.system === 'eote')
        {
            specialization.value = char.details.specialization ?? '';
            forceSensitive.value = char.details.force.sensitive;
        }

        innerModal.value?.show();
    }

    function hide() : void
    {
        innerModal.value?.hide();
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
            abilities: Array.from(selectedAbilities.value),
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

    function onAbilityAdd(ability : EoteAbility) : void
    {
        if(ability.id)
        {
            selectedAbilities.value.add(ability.id);
        }
    }

    function onAbilityRemove(ability : EoteAbility) : void
    {
        if(ability.id)
        {
            selectedAbilities.value.delete(ability.id);
        }
    }

    function onAbilityNew() : void
    {
        addEditModal.value?.show(undefined);
    }

    function onAbilityEdit(ability : EoteAbility) : void
    {
        addEditModal.value?.show(ability);
    }

    function onAbilityDelete(ability : EoteAbility) : void
    {
        delAbility.value.id = ability.id;
        delAbility.value.name = ability.name;

        delModal.value?.show();
    }

    function onDelAbilityHidden() : void
    {
        delAbility.value.id = undefined;
        delAbility.value.name = '';
    }

    async function onDelAbilityDelete() : Promise<void>
    {
        suppSelect.value?.clearSelection();
        if(delAbility.value.id)
        {
            selectedAbilities.value.delete(delAbility.value.id);
            await supplementStore.remove(mode.value, 'ability', delAbility.value.id);
        }

        onSave();
    }

    //------------------------------------------------------------------------------------------------------------------

    defineExpose({ show, hide });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
