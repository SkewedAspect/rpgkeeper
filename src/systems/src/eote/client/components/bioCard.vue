<!----------------------------------------------------------------------------------------------------------------------
  -- bioCard.vue
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <RpgkCard id="eote-bio-block" :class="{ readonly: readonly }" fill no-body>
        <!-- Header -->
        <template #header>
            <div class="d-flex">
                <h5 class="align-items-center d-flex m-0 me-2 flex-grow-0 flex-shrink-0 w-75">
                    <Fa class="me-1" icon="address-card" />
                    <span class="d-none d-md-block">
                        {{ char.name }}
                    </span>
                </h5>
                <div v-if="!readonly" class="ms-auto">
                    <BButton size="sm" style="margin-bottom: 1px;" @click="openEditModal()">
                        <Fa icon="edit" fixed-width />
                        <span class="d-none d-md-inline">Edit</span>
                    </BButton>
                </div>
            </div>
        </template>

        <!-- Card Body -->
        <div class="p-2">
            <div class="bio-line mb-1">
                <i>{{ char.description }}</i>
            </div>
            <div :class="{ 'd-flex': char.system === 'eote' }">
                <div class="bio-line" :class="{ 'w-50': mode === 'eote' }">
                    <b>{{ char.system === 'genesys' ? 'Archetype' : 'Species' }}:</b>
                    <SpeciesTag :id="char.details.speciesRef" class="ms-1" />
                </div>
                <div class="bio-line" :class="{ 'w-50 ms-1': char.system === 'eote' }">
                    <b>Career:</b>
                    <span class="ms-1">{{ career }}</span>
                </div>
            </div>
            <div v-if="char.system === 'eote'" class="bio-line">
                <b>Specializations:</b>
                <span class="ms-1">{{ specialization }}</span>
            </div>
            <div class="bio-line">
                <b>Abilities:</b>
                <AbilityTag
                    v-for="(ability, idx) in speciesAbilities"
                    :key="`species-${ idx }`"
                    :name="ability.name"
                    :description="ability.description"
                    :reference="String(species?.reference ?? '')"
                    class="ms-1"
                />
                <AbilityTag
                    v-for="ability in characterAbilities"
                    :key="`char-${ ability.id }`"
                    :name="ability.name"
                    :description="ability.description ?? ''"
                    :reference="String(ability.reference ?? '')"
                    class="ms-1"
                />
                <span v-if="speciesAbilities.length === 0 && characterAbilities.length === 0" class="ms-1">None</span>
            </div>
        </div>

        <!-- Edit Modal -->
        <EditModal ref="editModal" @save="onEditSave" />
    </RpgkCard>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, useTemplateRef } from 'vue';
    import { storeToRefs } from 'pinia';

    // Interfaces
    import type { Supplement } from '@rpgk/core';
    import type { EoteOrGenCharacter, SpeciesAbility } from '../../models.ts';

    // Stores
    import { useCharacterStore } from '@client/lib/resource-access/stores/characters';
    import { useSupplementStore } from '@client/lib/resource-access/stores/supplements';

    // Components
    import RpgkCard from '@client/components/ui/rpgkCard.vue';
    import EditModal from './modals/editBiographyModal.vue';
    import AbilityTag from './sub/abilityTag.vue';
    import SpeciesTag from './sub/speciesTag.vue';

    // Utils
    import { useSpeciesLookup } from '../lib/useSpeciesLookup.ts';

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

    interface Props
    {
        readonly : boolean;
    }

    defineProps<Props>();

    const emit = defineEmits<{
        save : [];
    }>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const { current } = storeToRefs(useCharacterStore());
    const supplementStore = useSupplementStore();
    const editModal = useTemplateRef('editModal');

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const char = computed<EoteOrGenCharacter>(() => current.value as EoteOrGenCharacter);

    const speciesRef = computed(() => char.value.details.speciesRef ?? null);
    const { mode, species } = useSpeciesLookup(speciesRef);

    const speciesAbilities = computed<SpeciesAbility[]>(() => species.value?.abilities ?? []);

    const allAbilitySupplements = computed(() => supplementStore.get<Supplement>(mode.value, 'ability'));

    const characterAbilities = computed(() =>
    {
        const abilityIds = char.value.details.abilities ?? [];
        return abilityIds
            .map((abilityId) => allAbilitySupplements.value.find((supp) => supp.id === abilityId))
            .filter((supp) : supp is Supplement => supp !== undefined);
    });

    const career = computed(() => char.value.details.career);
    const specialization = computed(() =>
    {
        const character = char.value;
        if(character.system === 'eote')
        {
            return character.details.specialization;
        }

        return 'Unknown';
    });

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function openEditModal() : void
    {
        editModal.value?.show(char.value);
    }

    function onEditSave(bio : BioObj) : void
    {
        const character = char.value;
        character.name = bio.name;
        character.description = bio.description;
        character.details.career = bio.career;
        character.details.speciesRef = bio.speciesRef;
        character.details.abilities = bio.abilities;

        if(character.system === 'eote')
        {
            character.details.specialization = bio.specializations;
            character.details.force.sensitive = bio.forceSensitive;
        }

        emit('save');
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
