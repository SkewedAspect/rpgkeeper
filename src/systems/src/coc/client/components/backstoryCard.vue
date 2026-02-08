<!----------------------------------------------------------------------------------------------------------------------
  -- Backstory Card Component
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <RpgkCard id="coc-backstory-block" :class="{ readonly: readonly }" fill>
        <!-- Header -->
        <template #header>
            <div class="d-flex">
                <h5 class="align-items-center d-flex m-0 me-2 flex-grow-0 flex-shrink-0 w-75">
                    <Fa class="me-1" icon="book-open" />
                    <span class="d-none d-md-block">
                        Backstory
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
        <div class="d-flex gap-2">
            <div class="flex-fill">
                <b>Ideology:</b>
                <span class="ms-1">{{ backstory.ideology || '-' }}</span>
            </div>
            <div class="flex-fill">
                <b>Significant People:</b>
                <span class="ms-1">{{ backstory.significantPeople || '-' }}</span>
            </div>
        </div>
        <div class="d-flex gap-2 mt-2">
            <div class="flex-fill">
                <b>Meaningful Locations:</b>
                <span class="ms-1">{{ backstory.meaningfulLocations || '-' }}</span>
            </div>
            <div class="flex-fill">
                <b>Treasured Possession:</b>
                <span class="ms-1">{{ backstory.treasuredPossession || '-' }}</span>
            </div>
        </div>
        <div class="d-flex gap-2 mt-2">
            <div class="flex-fill">
                <b>Traits:</b>
                <span class="ms-1">{{ backstory.traits || '-' }}</span>
            </div>
            <div class="flex-fill">
                <b>Injuries:</b>
                <span class="ms-1">{{ backstory.injuries || '-' }}</span>
            </div>
        </div>
        <div class="d-flex gap-2 mt-2">
            <div class="flex-fill">
                <b>Phobias:</b>
                <span class="ms-1">{{ backstory.phobias || '-' }}</span>
            </div>
            <div class="flex-fill">
                <b>Arcane Tomes:</b>
                <span class="ms-1">{{ backstory.arcaneTomes || '-' }}</span>
            </div>
        </div>
        <div class="d-flex gap-2 mt-2">
            <div class="flex-fill">
                <b>Encounters:</b>
                <span class="ms-1">{{ backstory.encounters || '-' }}</span>
            </div>
        </div>
        <BFormGroup
            id="backstory-desc-input-group"
            label="Description"
            label-class="fw-bold"
            class="mt-2"
        >
            <MarkdownBlock class="font-sm" :text="backstory.description || '-'" inline />
        </BFormGroup>

        <!-- Edit Modal -->
        <EditBackstoryModal id="editModal" ref="editModal" @save="onEditSave" />
    </RpgkCard>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss">
    #coc-backstory-block {
        &.card:not(.readonly) {
            .card-header {
                padding-top: 0.5rem !important;
                padding-bottom: 0.5rem !important;
            }
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, ref } from 'vue';
    import { storeToRefs } from 'pinia';

    // Interfaces
    import type { Character } from '@rpgk/core';
    import type { CoCSystemDetails, CoCBackstory } from '../../models.ts';

    // Stores
    import { useCharacterStore } from '@client/lib/resource-access/stores/characters';

    // Components
    import EditBackstoryModal from './modals/editBackstoryModal.vue';
    import MarkdownBlock from '@client/components/ui/markdownBlock.vue';
    import RpgkCard from '@client/components/ui/rpgkCard.vue';

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
    const editModal = ref<InstanceType<typeof EditBackstoryModal> | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const readonly = computed(() => props.readonly);
    const char = computed<Character<CoCSystemDetails>>(() => current.value as any);

    const backstory = computed(() => char.value.details.backstory);

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function openEditModal() : void
    {
        editModal.value?.show(char.value);
    }

    function onEditSave(editBackstory : CoCBackstory) : void
    {
        char.value.details.backstory = editBackstory;

        emit('save');
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
