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
                    <b>Species<span v-if="char.system === 'genesys'">/Archetype</span>:</b>
                    <span class="ms-1">{{ species }}</span>
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
                <AbilityTag v-for="id in abilities" :id="id" :key="id" class="ms-1" />
                <span v-if="abilities.length === 0" class="ms-1">None</span>
            </div>
        </div>

        <!-- Edit Modal -->
        <EditModal ref="editModal" @save="onEditSave" />
    </RpgkCard>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, ref } from 'vue';
    import { storeToRefs } from 'pinia';

    // Interfaces
    import { EoteOrGenCharacter } from '../../../../common/models/systems';

    // Stores
    import { useCharacterStore } from '../../../lib/resource-access/stores/characters';

    // Components
    import RpgkCard from '../../ui/rpgkCard.vue';
    import EditModal from './modals/editBiographyModal.vue';
    import AbilityTag from './components/abilityTag.vue';
    import eoteMan from '../../../lib/managers/systems/eote';

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
        abilities : number[];
    }

    interface Props
    {
        readonly : boolean;
    }

    const props = defineProps<Props>();

    type Events = (e : 'save') => void;

    const emit = defineEmits<Events>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const { current } = storeToRefs(useCharacterStore());
    const editModal = ref<InstanceType<typeof EditModal> | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const char = computed<EoteOrGenCharacter>(() => current.value as any);
    const mode = computed(() => eoteMan.mode);

    const abilities = computed(() => char.value.details.abilities);
    const species = computed(() => char.value.details.species);
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

    const readonly = computed(() => props.readonly);

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function openEditModal() : void
    {
        editModal.value.show(char.value);
    }

    function onEditSave(bio : BioObj) : void
    {
        const character = char.value;
        character.name = bio.name;
        character.description = bio.description;
        character.details.career = bio.career;
        character.details.species = bio.species;

        if(character.system === 'eote')
        {
            character.details.specialization = bio.specializations;
            character.details.force.sensitive = bio.forceSensitive;
        }

        character.details.abilities = bio.abilities;

        emit('save');
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
