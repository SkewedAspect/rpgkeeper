<!----------------------------------------------------------------------------------------------------------------------
  -- Talents Card
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <RpgkCard id="eote-talents-block" :class="{ readonly }" fill>
        <!-- Header -->
        <template #header>
            <div class="d-flex">
                <h5 class="align-items-center d-flex text-nowrap m-0 mr-2 flex-grow-0 flex-shrink-0 w-auto">
                    <fa class="mr-1" icon="fist-raised"></fa>
                    <span class="d-none d-md-inline">Talents</span>
                </h5>
                <div v-if="!readonly" class="ml-auto">
                    <b-btn size="sm" style="margin-bottom: 1px;" @click="openEditModal()">
                        <fa icon="edit" fixed-width></fa>
                        <span class="d-none d-md-inline">Edit</span>
                    </b-btn>
                </div>
            </div>
        </template>

        <!-- Card Body -->
        <component :is="subTalent" :readonly="readonly"></component>

        <!-- Modals -->
        <EditTalentsModal ref="editTalentsModal" @save="onEditSave"></EditTalentsModal>
    </RpgkCard>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, ref } from 'vue';
    import { storeToRefs } from 'pinia';

    // Models
    import { EoteOrGenCharacter, EoteTalentInst } from '../../../../common/interfaces/systems/eote';

    // Stores
    import { useCharactersStore } from '../../../lib/stores/characters';

    // Managers
    import eoteMan from '../../../lib/managers/systems/eote';

    // Components
    import RpgkCard from '../../ui/rpgkCard.vue';
    import EotETalents from './sub/eoteTalents.vue';
    import GenesysTalents from './sub/genesysTalents.vue';
    import EditTalentsModal from './modals/editTalentsModal.vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Props
    {
        readonly : boolean;
    }

    const props = defineProps<Props>();

    interface Events
    {
        (e : 'save') : void;
    }

    const emit = defineEmits<Events>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const { current } = storeToRefs(useCharactersStore());
    const editTalentsModal = ref<InstanceType<typeof EditTalentsModal> | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const char = computed<EoteOrGenCharacter>(() => current.value as any);
    const mode = computed(() => eoteMan.mode);
    const readonly = computed(() => props.readonly);

    const subTalent = computed(() => { return mode.value === 'eote' ? EotETalents : GenesysTalents; });

    //------------------------------------------------------------------------------------------------------------------
    // Method
    //------------------------------------------------------------------------------------------------------------------

    function openEditModal()
    {
        editTalentsModal.value.show(char.value);
    }

    function onEditSave(talents : EoteTalentInst[]) : void
    {
        char.value.details.talents = talents;

        emit('save');
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
