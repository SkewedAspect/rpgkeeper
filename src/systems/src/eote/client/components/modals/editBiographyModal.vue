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
                <BFormRow class="align-items-end mt-2">
                    <BCol>
                        <BFormGroup
                            :label="speciesLabel"
                            label-class="fw-bold"
                        >
                            <div class="d-flex gap-2">
                                <BInputGroup>
                                    <BFormInput
                                        :value="speciesName"
                                        readonly
                                        :placeholder="`No ${ speciesLabel.toLowerCase() } selected`"
                                    />
                                    <template #append>
                                        <BButton
                                            variant="secondary"
                                            :title="`Browse ${ speciesLabel }...`"
                                            @click="openSpeciesBrowser"
                                        >
                                            <Fa icon="search" />
                                            Browse
                                        </BButton>
                                    </template>
                                </BInputGroup>
                                <BButton
                                    variant="success"
                                    class="text-nowrap"
                                    :title="`New ${ speciesLabel }...`"
                                    @click="openSpeciesNew"
                                >
                                    <Fa icon="plus" />
                                    New
                                </BButton>
                            </div>
                        </BFormGroup>
                    </BCol>
                    <BCol>
                        <BFormGroup
                            label="Career"
                            label-class="fw-bold"
                            label-for="career-input"
                        >
                            <BInputGroup>
                                <BFormInput id="career-input" v-model="career" />
                                <template #append>
                                    <BButton variant="secondary" @click="career = ''">
                                        <Fa icon="times" />
                                    </BButton>
                                </template>
                            </BInputGroup>
                        </BFormGroup>
                    </BCol>
                    <BCol v-if="mode === 'eote'" cols="auto">
                        <BFormGroup
                            label="Force Sensitive"
                            label-class="fw-bold"
                            label-for="force-sensitive-input"
                            label-sr-only
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

                <BFormRow v-if="mode === 'eote'" class="mt-2">
                    <BCol>
                        <BFormGroup
                            label="Specializations"
                            label-class="fw-bold"
                            label-for="special-input"
                        >
                            <BInputGroup>
                                <BFormInput id="special-input" v-model="specialization" />
                                <template #append>
                                    <BButton variant="secondary" @click="specialization = ''">
                                        <Fa icon="times" />
                                    </BButton>
                                </template>
                            </BInputGroup>
                        </BFormGroup>
                    </BCol>
                </BFormRow>

                <!-- Abilities -->
                <div class="mt-3">
                    <AbilityEdit
                        :abilities="abilities"
                        :species-abilities="speciesAbilities"
                        :species-reference="speciesData?.reference"
                        @update:abilities="abilities = $event"
                    />
                </div>
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
        <AddEditSpeciesModal ref="addEditSpeciesModal" @save="onSpeciesCreated" />
        <SupplementBrowserModal
            ref="speciesBrowseModal"
            :title="`Browse ${ speciesLabel }`"
            :supplements="speciesOptions"
            :selected-ids="speciesRef ? [ speciesRef ] : []"
            @select="onSpeciesSelect"
            @add-new="openSpeciesNew"
        />
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, ref } from 'vue';

    // Models
    import type { EoteOrGenCharacter, EoteSpecies, SpeciesAbility } from '../../../models.ts';

    // Stores
    import { useSupplementStore } from '@client/lib/resource-access/stores/supplements';

    // Components
    import SupplementBrowserModal from '@client/components/character/supplementBrowserModal.vue';
    import AddEditSpeciesModal from './addEditSpeciesModal.vue';
    import AbilityEdit from '../sub/abilityEdit.vue';
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
        speciesRef : string | null;
        abilities : string[];
        specializations : string;
        forceSensitive : boolean;
    }

    const emit = defineEmits<{
        save : [bio : BioObj];
    }>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const mode = ref<'eote' | 'genesys'>('eote');
    const name = ref('');
    const description = ref('');
    const career = ref('');
    const speciesRef = ref<string | null>(null);
    const abilities = ref<string[]>([]);
    const specialization = ref('');
    const forceSensitive = ref(false);

    const innerModal = ref<InstanceType<typeof BModal> | null>(null);
    const addEditSpeciesModal = ref<InstanceType<typeof AddEditSpeciesModal> | null>(null);
    const speciesBrowseModal = ref<{ show : () => void; hide : () => void } | null>(null);

    const supplementStore = useSupplementStore();

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const speciesLabel = computed(() =>
    {
        return mode.value === 'genesys' ? 'Archetype' : 'Species';
    });
    const speciesType = computed(() =>
    {
        return mode.value === 'genesys' ? 'archetype' : 'species';
    });

    const speciesOptions = computed(() => supplementStore.get<EoteSpecies>(mode.value, speciesType.value));

    const speciesData = computed(() =>
    {
        if(!speciesRef.value) { return null; }
        return speciesOptions.value.find((sp) => sp.id === speciesRef.value) ?? null;
    });

    const speciesAbilities = computed<SpeciesAbility[]>(() => speciesData.value?.abilities ?? []);

    const speciesName = computed(() =>
    {
        if(!speciesRef.value)
        {
            return '';
        }

        const found = speciesOptions.value.find((sp) => sp.id === speciesRef.value);
        return found?.name ?? 'Unknown';
    });

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function show(char : EoteOrGenCharacter) : void
    {
        mode.value = char.system;

        name.value = char.name;
        description.value = char.description ?? '';
        career.value = char.details.career;
        speciesRef.value = char.details.speciesRef;
        abilities.value = [ ...(char.details.abilities ?? []) ];

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
            speciesRef: speciesRef.value,
            abilities: abilities.value,
            specializations: specialization.value,
            forceSensitive: forceSensitive.value,
        });
    }

    function onCancel() : void
    {
        name.value = '';
        description.value = '';
        career.value = '';
        speciesRef.value = null;
        abilities.value = [];
        specialization.value = '';
        forceSensitive.value = false;
    }

    // Species selection
    function openSpeciesBrowser() : void
    {
        speciesBrowseModal.value?.show();
    }

    function openSpeciesNew() : void
    {
        addEditSpeciesModal.value?.show(mode.value);
    }

    function onSpeciesSelect(species : EoteSpecies) : void
    {
        speciesRef.value = species.id ?? null;
    }

    function onSpeciesCreated(species : { id : string }) : void
    {
        speciesRef.value = species.id;
    }

    //------------------------------------------------------------------------------------------------------------------

    defineExpose({ show, hide });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
