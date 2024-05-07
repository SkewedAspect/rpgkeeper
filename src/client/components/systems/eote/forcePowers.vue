<!----------------------------------------------------------------------------------------------------------------------
  -- forcePowers.vue
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <RpgkCard id="eote-force-powers-block" :class="{ readonly: readonly }" fill>
        <!-- Header -->
        <template #header>
            <div class="d-flex">
                <h5 class="align-items-center d-flex text-nowrap m-0 me-2 flex-grow-0 flex-shrink-0 w-auto">
                    <fa class="me-1" icon="journal-whills"></fa>
                    <span class="d-none d-md-inline">ForcePowers</span>
                </h5>
                <div v-if="!readonly" class="ml-auto">
                    <BButton size="sm" style="margin-bottom: 1px;" @click="openEditModal()">
                        <fa icon="edit" fixed-width></fa>
                        <span class="d-none d-md-inline">Edit</span>
                    </BButton>
                </div>
            </div>
        </template>

        <!-- Card Body -->
        <div>
            <BFormRow>
                <BCol v-for="forcePower in forcePowers" :key="forcePower.id" cols="12">
                    <ForcePowerCard class="mb-2" :power="forcePower" :readonly="readonly"></ForcePowerCard>
                </BCol>
            </BFormRow>

            <h5 v-if="forcePowers.length === 0" class="m-0 text-center">
                No Force Powers
            </h5>
        </div>

        <!-- Modals -->
        <EditForcePowersModal ref="editForcePowersModal" @save="onEditSave"></EditForcePowersModal>
    </RpgkCard>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, ref } from 'vue';
    import { storeToRefs } from 'pinia';
    import { sortBy } from 'lodash';

    // Models
    import { EoteCharacter, EoteForcePowerInst } from '../../../../common/interfaces/systems/eote';

    // Stores
    import { useCharactersStore } from '../../../lib/stores/characters';

    // Managers
    import eoteMan from '../../../lib/managers/systems/eote';

    // Components
    import RpgkCard from '../../ui/rpgkCard.vue';
    import ForcePowerCard from './components/forcePowerCard.vue';
    import EditForcePowersModal from './modals/editForcePowersModal.vue';

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
    const editForcePowersModal = ref<InstanceType<typeof EditForcePowersModal> | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const char = computed<EoteCharacter>(() => current.value as any);
    const mode = computed(() => eoteMan.mode);
    const readonly = computed(() => props.readonly);

    const forcePowers = computed(() =>
    {
        return sortBy(
            char.value.details.force.powers ?? [],
            (powerInst) =>
            {
                const powerBase = eoteMan.forcePowers.find((item) => item.id === powerInst.id);
                return powerBase?.name ?? 'Unknown';
            }
        );
    });

    //------------------------------------------------------------------------------------------------------------------
    // Method
    //------------------------------------------------------------------------------------------------------------------

    function openEditModal()
    {
        editForcePowersModal.value.show(char.value);
    }

    function onEditSave(powers : EoteForcePowerInst[]) : void
    {
        char.value.details.force.powers = powers;

        emit('save');
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
