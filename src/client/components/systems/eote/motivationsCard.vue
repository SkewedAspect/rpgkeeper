<!----------------------------------------------------------------------------------------------------------------------
  -- Motivations
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <RpgkCard id="eote-motivations-block" :class="{ readonly }" fill>
        <!-- Header -->
        <template #header>
            <div class="d-flex">
                <h5 class="align-items-center d-flex text-nowrap m-0 me-2 flex-grow-0 flex-shrink-0 w-auto">
                    <Fa class="me-1" icon="angel" />
                    <span class="d-none d-md-inline">Motivations</span>
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
        <!-- A table for layout? In this economy? YOU BET YOUR ASS. -->
        <table style="border-collapse: collapse">
            <tbody>
                <tr>
                    <td>
                        <b class="me-1">Strength:</b>
                    </td>
                    <td>
                        <MotivationCard v-if="motivations.strength" :id="motivations.strength" />
                        <i v-else>None</i>
                    </td>
                    <td>
                        <b class="me-1">Flaw:</b>
                    </td>
                    <td>
                        <MotivationCard v-if="motivations.flaw" :id="motivations.flaw" />
                        <i v-else>None</i>
                    </td>
                </tr>
                <tr>
                    <td>
                        <b class="me-1">Desire:</b>
                    </td>
                    <td>
                        <MotivationCard v-if="motivations.desire" :id="motivations.desire" />
                        <i v-else>None</i>
                    </td>
                    <td>
                        <b class="me-1">Fear:</b>
                    </td>
                    <td>
                        <MotivationCard v-if="motivations.fear" :id="motivations.fear" />
                        <i v-else>None</i>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- Edit Modal -->
        <EditModal ref="editModal" @save="onEditSave" />
    </RpgkCard>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, ref } from 'vue';
    import { storeToRefs } from 'pinia';

    // Models
    import { GenesysCharacter } from '../../../../common/models/systems';

    // Stores
    import { useCharacterStore } from '../../../lib/resource-access/stores/characters';

    // Components
    import MotivationCard from './components/motivationBlock.vue';
    import RpgkCard from '../../ui/rpgkCard.vue';
    import EditModal from './modals/editMotivationsModal.vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Motivations
    {
        strength : number | null;
        flaw : number | null;
        desire : number | null;
        fear : number | null;
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
    const readonly = computed(() => props.readonly);
    const editModal = ref<InstanceType<typeof EditModal> | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const character = computed<GenesysCharacter>(() => current.value as any);
    const motivations = computed(() => character.value.details.motivations);

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function openEditModal() : void
    {
        editModal.value.show(character.value);
    }

    function onEditSave(motivs : Motivations) : void
    {
        character.value.details.motivations = motivs;

        emit('save');
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
