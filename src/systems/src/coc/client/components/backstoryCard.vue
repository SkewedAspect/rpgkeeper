<!----------------------------------------------------------------------------------------------------------------------
  -- Backstory Card Component
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <RpgkCard id="coc-backstory-block" :class="{ readonly: readonly }" fill>
        <!-- Header -->
        <template #header>
            <div class="d-flex">
                <h5 class="align-items-center d-flex text-nowrap m-0 me-2 flex-grow-0 flex-shrink-0 w-auto">
                    <Fa class="me-1" icon="book-open" />
                    <span class="d-none d-md-inline">Backstory & Investigation</span>
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
        <div class="backstory-content">
            <BFormGroup
                v-if="backstory.description"
                label="Personal Description"
                label-class="fw-bold"
                class="mb-3"
            >
                <MarkdownBlock class="font-sm" :text="backstory.description" />
            </BFormGroup>

            <BFormGroup
                v-if="backstory.ideology"
                label="Ideology / Beliefs"
                label-class="fw-bold"
                class="mb-3"
            >
                <MarkdownBlock class="font-sm" :text="backstory.ideology" />
            </BFormGroup>

            <BFormGroup
                v-if="backstory.significantPeople"
                label="Significant People"
                label-class="fw-bold"
                class="mb-3"
            >
                <MarkdownBlock class="font-sm" :text="backstory.significantPeople" />
            </BFormGroup>

            <BFormGroup
                v-if="backstory.meaningfulLocations"
                label="Meaningful Locations"
                label-class="fw-bold"
                class="mb-3"
            >
                <MarkdownBlock class="font-sm" :text="backstory.meaningfulLocations" />
            </BFormGroup>

            <BFormGroup
                v-if="backstory.treasuredPossession"
                label="Treasured Possessions"
                label-class="fw-bold"
                class="mb-3"
            >
                <MarkdownBlock class="font-sm" :text="backstory.treasuredPossession" />
            </BFormGroup>

            <BFormGroup
                v-if="backstory.traits"
                label="Traits"
                label-class="fw-bold"
                class="mb-3"
            >
                <MarkdownBlock class="font-sm" :text="backstory.traits" />
            </BFormGroup>

            <hr v-if="hasInvestigationNotes" class="my-3">

            <h6 v-if="hasInvestigationNotes" class="text-muted mb-3">
                <Fa icon="search" />
                Investigation Notes
            </h6>

            <BFormGroup
                v-if="backstory.injuries"
                label="Scars & Injuries"
                label-class="fw-bold"
                class="mb-3"
            >
                <MarkdownBlock class="font-sm" :text="backstory.injuries" />
            </BFormGroup>

            <BFormGroup
                v-if="backstory.phobias"
                label="Phobias & Manias"
                label-class="fw-bold"
                class="mb-3"
            >
                <MarkdownBlock class="font-sm" :text="backstory.phobias" />
            </BFormGroup>

            <BFormGroup
                v-if="backstory.arcaneTomes"
                label="Arcane Tomes & Spells"
                label-class="fw-bold"
                class="mb-3"
            >
                <MarkdownBlock class="font-sm" :text="backstory.arcaneTomes" />
            </BFormGroup>

            <BFormGroup
                v-if="backstory.encounters"
                label="Encounters with Strange Entities"
                label-class="fw-bold"
                class="mb-3"
            >
                <MarkdownBlock class="font-sm" :text="backstory.encounters" />
            </BFormGroup>

            <p v-if="!hasAnyBackstory" class="text-muted fst-italic">
                No backstory information recorded yet.
            </p>
        </div>

        <!-- Edit Modal -->
        <EditBackstoryModal ref="editModal" @save="onEditSave" />
    </RpgkCard>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss" scoped>
    #coc-backstory-block {
        .backstory-content {
            max-height: 600px;
            overflow-y: auto;
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, ref } from 'vue';
    import { storeToRefs } from 'pinia';

    // Models
    import type { Character } from '@rpgk/core';
    import type { CoCBackstory, CoCSystemDetails } from '../../models.ts';

    // Stores
    import { useCharacterStore } from '@client/lib/resource-access/stores/characters';

    // Components
    import RpgkCard from '@client/components/ui/rpgkCard.vue';
    import MarkdownBlock from '@client/components/ui/markdownBlock.vue';
    import EditBackstoryModal from './modals/editBackstoryModal.vue';

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

    const character = computed<Character<CoCSystemDetails>>(() => current.value as any);
    const readonly = computed(() => props.readonly);
    const backstory = computed(() => character.value.details.backstory);

    const hasInvestigationNotes = computed(() =>
    {
        return !!backstory.value.injuries
            || !!backstory.value.phobias
            || !!backstory.value.arcaneTomes
            || !!backstory.value.encounters;
    });

    const hasAnyBackstory = computed(() =>
    {
        return !!backstory.value.description
            || !!backstory.value.ideology
            || !!backstory.value.significantPeople
            || !!backstory.value.meaningfulLocations
            || !!backstory.value.treasuredPossession
            || !!backstory.value.traits
            || hasInvestigationNotes.value;
    });

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function openEditModal() : void
    {
        editModal.value?.show(character.value);
    }

    function onEditSave(editedBackstory : CoCBackstory) : void
    {
        character.value.details.backstory = editedBackstory;
        emit('save');
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
