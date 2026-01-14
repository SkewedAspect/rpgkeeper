<!----------------------------------------------------------------------------------------------------------------------
  -- defensesCard.vue
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <RpgkCard id="eote-defenses-block" :class="{ readonly: readonly }" fill>
        <!-- Header -->
        <template #header>
            <div class="d-flex">
                <h5 class="align-items-center d-flex text-nowrap m-0 me-2 flex-grow-0 flex-shrink-0 w-auto">
                    <Fa class="me-1" icon="shield" />
                    <span class="d-none d-md-inline">Defenses</span>
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
        <div class="d-flex">
            <BCard class="flex-fill me-2" no-body>
                <div class="p-2 text-center">
                    <b>Soak</b>
                    <hr class="m-1">
                    <h5 class="m-0">
                        {{ defenses.soak }}
                    </h5>
                </div>
            </BCard>
            <BCard class="flex-fill" no-body>
                <div class="p-2 text-center">
                    <b>Melee / Ranged</b>
                    <hr class="m-1">
                    <h5 class="m-0">
                        {{ defenses.melee }} / {{ defenses.ranged }}
                    </h5>
                </div>
            </BCard>
        </div>

        <!-- Edit Modal -->
        <EditModal ref="editModal" @save="onEditSave" />
    </RpgkCard>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, ref } from 'vue';
    import { storeToRefs } from 'pinia';

    // Store
    import { useCharacterStore } from '@client/lib/resource-access/stores/characters';

    // Models
    import type { EoteOrGenCharacter } from '../models.ts';

    // Components
    import RpgkCard from '@client/components/ui/rpgkCard.vue';
    import EditModal from './modals/editDefensesModal.vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Defenses
    {
        soak : number;
        melee : number;
        ranged : number;
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

    const character = computed<EoteOrGenCharacter>(() => current.value as any);
    const defenses = computed(() => character.value.details.defenses);

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function openEditModal() : void
    {
        editModal.value.show(character.value);
    }

    function onEditSave(def : Defenses) : void
    {
        character.value.details.defenses = def;

        emit('save');
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
