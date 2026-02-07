<!----------------------------------------------------------------------------------------------------------------------
  -- AddEditSpeciesModal
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="add-species-modal">
        <BModal
            ref="innerModal"
            header-bg-variant="dark"
            header-text-variant="white"
            no-close-on-esc
            no-close-on-backdrop
            size="lg"
            @ok="onSave"
            @hidden="onCancel"
        >
            <!-- Modal Header -->
            <template #header="{ cancel }">
                <h5 v-b-color-mode="'dark'" class="w-100 mb-0">
                    <Fa icon="file-edit" />
                    <span v-if="isEdit">Edit</span>
                    <span v-else>Add</span>
                    {{ label }}
                    <CloseButton class="float-end" @click="cancel" />
                </h5>
            </template>

            <!-- Modal Content -->
            <BFormGroup
                label="Name"
                label-class="fw-bold"
                label-for="name-input"
            >
                <BFormInput id="name-input" v-model="name" autocomplete="off" />
            </BFormGroup>

            <BFormGroup
                label="Description"
                label-class="fw-bold"
                label-for="description-input"
            >
                <MarkdownEditor v-model:text="description" />
            </BFormGroup>

            <!-- Characteristics -->
            <BFormGroup label="Characteristics" label-class="fw-bold">
                <BFormRow>
                    <BCol v-for="char in characteristicNames" :key="char">
                        <BFormGroup :label="char" label-class="text-capitalize" label-size="sm">
                            <BFormInput
                                v-model.number="characteristics[char]"
                                type="number"
                                min="1"
                                max="5"
                                size="sm"
                            />
                        </BFormGroup>
                    </BCol>
                </BFormRow>
            </BFormGroup>

            <!-- Thresholds and XP -->
            <BFormRow>
                <BCol>
                    <BFormGroup label="Wound Threshold" label-class="fw-bold" label-for="wound-input">
                        <BFormInput
                            id="wound-input"
                            v-model.number="woundThreshold"
                            type="number"
                            min="0"
                        />
                    </BFormGroup>
                </BCol>
                <BCol>
                    <BFormGroup label="Strain Threshold" label-class="fw-bold" label-for="strain-input">
                        <BFormInput
                            id="strain-input"
                            v-model.number="strainThreshold"
                            type="number"
                            min="0"
                        />
                    </BFormGroup>
                </BCol>
                <BCol>
                    <BFormGroup label="Starting XP" label-class="fw-bold" label-for="xp-input">
                        <BFormInput
                            id="xp-input"
                            v-model.number="startingXP"
                            type="number"
                            min="0"
                        />
                    </BFormGroup>
                </BCol>
            </BFormRow>

            <!-- Abilities -->
            <BFormGroup label="Abilities" label-class="fw-bold">
                <div v-for="(ability, idx) in abilities" :key="idx" class="d-flex align-items-start gap-2 mb-2">
                    <BFormInput
                        v-model="ability.name"
                        placeholder="Ability Name"
                        size="sm"
                        class="w-25"
                    />
                    <BFormInput
                        v-model="ability.description"
                        placeholder="Description"
                        size="sm"
                        class="flex-grow-1"
                    />
                    <BButton variant="danger" size="sm" @click="removeAbility(idx)">
                        <Fa icon="times" />
                    </BButton>
                </div>
                <BButton variant="outline-success" size="sm" @click="addAbility">
                    <Fa icon="plus" />
                    Add Ability
                </BButton>
            </BFormGroup>

            <!-- Special Abilities (EotE only) -->
            <BFormGroup
                v-if="mode === 'eote'"
                label="Special Abilities"
                label-class="fw-bold"
                label-for="special-abilities-input"
            >
                <BFormTextarea
                    id="special-abilities-input"
                    v-model="specialAbilities"
                    rows="3"
                    placeholder="Free-text special abilities (e.g. starting skill ranks, setback removal, etc.)"
                />
            </BFormGroup>

            <EditReference v-model:reference="reference" />

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
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, reactive, ref, useTemplateRef } from 'vue';

    // Models
    import type { Supplement } from '@rpgk/core';
    import type { BaseCharacteristics, EoteSpecies, SpeciesAbility, SpeciesSkillModifier } from '../../../models.ts';

    // Stores
    import { useSupplementStore } from '@client/lib/resource-access/stores/supplements';

    // Components
    import MarkdownEditor from '@client/components/ui/markdownEditor.vue';
    import EditReference from '@client/components/character/editReference.vue';
    import { BModal } from 'bootstrap-vue-next';
    import CloseButton from '@client/components/ui/closeButton.vue';

    // Utils
    import { normalizeReference } from '@client/lib/utils/misc';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    const emit = defineEmits<{
        save : [species : { id : string }]
    }>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const characteristicNames = [ 'brawn', 'agility', 'intellect', 'cunning', 'willpower', 'presence' ] as const;

    const mode = ref<'eote' | 'genesys'>('eote');
    const id = ref<string | undefined>(undefined);
    const name = ref('');
    const description = ref('');
    const characteristics = reactive<BaseCharacteristics>({
        brawn: 2,
        agility: 2,
        intellect: 2,
        cunning: 2,
        willpower: 2,
        presence: 2,
    });
    const woundThreshold = ref(10);
    const strainThreshold = ref(10);
    const startingXP = ref(100);
    const abilities = ref<SpeciesAbility[]>([]);
    const specialAbilities = ref('');
    const skillModifiers = ref<SpeciesSkillModifier[]>([]);
    const reference = ref('');

    const innerModal = useTemplateRef('innerModal');
    const supplementStore = useSupplementStore();

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const label = computed(() =>
    {
        return mode.value === 'genesys' ? 'Archetype' : 'Species';
    });
    const supplementType = computed(() =>
    {
        return mode.value === 'genesys' ? 'archetype' : 'species';
    });
    const isEdit = computed(() => !!id.value);

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function resetForm() : void
    {
        id.value = undefined;
        name.value = '';
        description.value = '';
        characteristics.brawn = 2;
        characteristics.agility = 2;
        characteristics.intellect = 2;
        characteristics.cunning = 2;
        characteristics.willpower = 2;
        characteristics.presence = 2;
        woundThreshold.value = 10;
        strainThreshold.value = 10;
        startingXP.value = 100;
        abilities.value = [];
        specialAbilities.value = '';
        skillModifiers.value = [];
        reference.value = '';
    }

    function show(system : 'eote' | 'genesys', species ?: EoteSpecies) : void
    {
        mode.value = system;

        if(species)
        {
            id.value = species.id;
            name.value = species.name;
            description.value = species.description ?? '';
            characteristics.brawn = species.characteristics?.brawn ?? 2;
            characteristics.agility = species.characteristics?.agility ?? 2;
            characteristics.intellect = species.characteristics?.intellect ?? 2;
            characteristics.cunning = species.characteristics?.cunning ?? 2;
            characteristics.willpower = species.characteristics?.willpower ?? 2;
            characteristics.presence = species.characteristics?.presence ?? 2;
            woundThreshold.value = species.woundThreshold ?? 10;
            strainThreshold.value = species.strainThreshold ?? 10;
            startingXP.value = species.startingXP ?? 100;
            abilities.value = (species.abilities ?? []).map((ab) => ({ ...ab }));
            specialAbilities.value = species.specialAbilities ?? '';
            skillModifiers.value = species.skillModifiers ?? [];
            reference.value = normalizeReference(species.reference);
        }
        else
        {
            resetForm();
        }

        innerModal.value?.show();
    }

    function hide() : void
    {
        innerModal.value?.hide();
    }

    function addAbility() : void
    {
        abilities.value.push({ name: '', description: '' });
    }

    function removeAbility(idx : number) : void
    {
        abilities.value.splice(idx, 1);
    }

    async function onSave() : Promise<void>
    {
        const speciesData : Record<string, unknown> = {
            name: name.value,
            description: description.value,
            characteristics: { ...characteristics },
            woundThreshold: woundThreshold.value,
            strainThreshold: strainThreshold.value,
            startingXP: startingXP.value,
            abilities: abilities.value.filter((ab) => ab.name.trim() !== ''),
            skillModifiers: skillModifiers.value,
            talentModifiers: [],
            reference: reference.value,
            official: false,
        };

        // Only include specialAbilities for EotE
        if(mode.value === 'eote')
        {
            speciesData.specialAbilities = specialAbilities.value;
        }

        const species = isEdit.value
            ? await supplementStore.update(mode.value, supplementType.value, {
                id: id.value,
                ...speciesData,
            } as Supplement)
            : await supplementStore.add(mode.value, supplementType.value, speciesData as Supplement);

        if(species.id)
        {
            emit('save', { id: species.id });
        }
    }

    function onCancel() : void
    {
        resetForm();
    }

    //------------------------------------------------------------------------------------------------------------------

    defineExpose({ show, hide });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
