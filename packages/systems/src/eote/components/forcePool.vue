<!----------------------------------------------------------------------------------------------------------------------
  -- Force Pool
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <RpgkCard id="eote-force-pool-block" :class="{ readonly: readonly }" fill>
        <!-- Header -->
        <template #header>
            <div class="d-flex">
                <h5 class="align-items-center d-flex text-nowrap m-0 me-2 flex-grow-0 flex-shrink-0 w-auto">
                    <Fa class="me-1" icon="jedi" />
                    <span class="d-none d-md-inline">Force</span>
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
        <div v-if="forcePool.sensitive" class="d-flex">
            <div class="flex-fill me-2">
                <label class="d-block text-center mt-2"><b>Committed</b></label>
                <BFormSpinbutton
                    v-model="forcePool.committed"
                    min="0"
                    :max="forcePool.rating"
                    step="1"
                    class="mt-2"
                />
            </div>
            <BCard class="flex-fill" no-body>
                <div class="p-2 text-center">
                    <b>Rating</b>
                    <hr class="m-1">
                    <h5 class="m-0">
                        {{ forcePool.rating - forcePool.committed }} / <small class="text-muted">
                            {{ forcePool.rating }}
                        </small>
                    </h5>
                </div>
            </BCard>
        </div>
        <div v-else class="d-flex text-center">
            <div class="flex-fill">
                <i>Not force sensitive.</i>
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

    // Models
    import type { EoteCharacter } from '../models.ts';

    // Stores
    import { useCharacterStore } from '@client/lib/resource-access/stores/characters';

    // Components
    import RpgkCard from '@client/components/ui/rpgkCard.vue';
    import EditModal from './modals/editForcePoolModal.vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface ForcePool
    {
        sensitive : boolean;
        committed : number;
        rating : number;
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

    const character = computed<EoteCharacter>(() => current.value as any);
    const forcePool = computed(() => character.value.details.force);

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function openEditModal() : void
    {
        editModal.value.show(character.value.details.force);
    }

    function onEditSave(fp : ForcePool) : void
    {
        character.value.details.force.sensitive = fp.sensitive;
        character.value.details.force.committed = fp.committed;
        character.value.details.force.rating = fp.rating;

        emit('save');
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
