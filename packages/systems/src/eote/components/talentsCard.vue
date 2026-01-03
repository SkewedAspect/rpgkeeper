<!----------------------------------------------------------------------------------------------------------------------
  -- Talents Card
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <RpgkCard id="eote-talents-block" :class="{ readonly }" fill>
        <!-- Header -->
        <template #header>
            <div class="d-flex">
                <h5 class="align-items-center d-flex text-nowrap m-0 me-2 flex-grow-0 flex-shrink-0 w-auto">
                    <Fa class="me-1" icon="fist-raised" />
                    <span class="d-none d-md-inline">Talents</span>
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
        <component :is="subTalent" :readonly="readonly" />

        <!-- Modals -->
        <EditTalentsModal ref="editTalentsModal" @save="onEditSave" />
    </RpgkCard>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, ref } from 'vue';
    import { storeToRefs } from 'pinia';

    // Models
    import type { EoteOrGenCharacter, EoteTalentInst } from '@rpgk/core/models/systems';

    // Stores
    import { useCharacterStore } from '@client/lib/resource-access/stores/characters';

    // Managers
    import eoteMan from '@client/lib/managers/systems/eote';

    // Components
    import RpgkCard from '@client/components/ui/rpgkCard.vue';
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

    type Events = (e : 'save') => void;

    const emit = defineEmits<Events>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const { current } = storeToRefs(useCharacterStore());
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

    function openEditModal() : void
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
