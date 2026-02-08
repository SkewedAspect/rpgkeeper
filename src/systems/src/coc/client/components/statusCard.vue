<!----------------------------------------------------------------------------------------------------------------------
  -- Status Card Component (Sanity, HP, MP, Luck, Conditions)
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <RpgkCard id="coc-status-block" :class="{ readonly: readonly }" fill no-body>
        <!-- Header -->
        <template #header>
            <div class="d-flex">
                <h5 class="align-items-center d-flex text-nowrap m-0 me-2 flex-grow-0 flex-shrink-0 w-auto">
                    <Fa class="me-1" icon="heart" />
                    <span class="d-none d-md-inline">Status</span>
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
            <!-- Resource Bars -->
            <div class="status-grid mb-3">
                <div class="status-item">
                    <label class="status-label">
                        <Fa icon="brain" fixed-width />
                        Sanity
                    </label>
                    <div class="status-bar-container">
                        <BProgressBar
                            :value="details.sanity.value"
                            :max="details.sanity.max"
                            :variant="getSanityVariant()"
                            show-value
                        />
                    </div>
                    <span class="status-text">
                        {{ details.sanity.value }} / {{ details.sanity.max }}
                    </span>
                </div>

                <div class="status-item">
                    <label class="status-label">
                        <Fa icon="heart" fixed-width />
                        Hit Points
                    </label>
                    <div class="status-bar-container">
                        <BProgressBar
                            :value="details.hitPoints.value"
                            :max="details.hitPoints.max"
                            :variant="getHPVariant()"
                            show-value
                        />
                    </div>
                    <span class="status-text">
                        {{ details.hitPoints.value }} / {{ details.hitPoints.max }}
                    </span>
                </div>

                <div class="status-item">
                    <label class="status-label">
                        <Fa icon="magic" fixed-width />
                        Magic Points
                    </label>
                    <div class="status-bar-container">
                        <BProgressBar
                            :value="details.magicPoints.value"
                            :max="details.magicPoints.max"
                            variant="info"
                            show-value
                        />
                    </div>
                    <span class="status-text">
                        {{ details.magicPoints.value }} / {{ details.magicPoints.max }}
                    </span>
                </div>

                <div class="status-item">
                    <label class="status-label">
                        <Fa icon="clover" fixed-width />
                        Luck
                    </label>
                    <div class="status-bar-container">
                        <BProgressBar
                            :value="details.luck.value"
                            :max="details.luck.max"
                            variant="warning"
                            show-value
                        />
                    </div>
                    <span class="status-text">
                        {{ details.luck.value }} / {{ details.luck.max }}
                    </span>
                </div>

                <div class="status-item">
                    <label class="status-label">
                        <Fa icon="running" fixed-width />
                        Movement Rate
                    </label>
                    <div class="status-value-large">
                        {{ details.movement }}
                    </div>
                </div>
            </div>

            <!-- Status Conditions -->
            <div class="conditions-section">
                <h6 class="mb-2">
                    <Fa icon="exclamation-triangle" />
                    Conditions
                </h6>
                <div class="conditions-grid">
                    <BBadge
                        v-if="details.status.temporaryInsanity"
                        variant="warning"
                        class="condition-badge"
                    >
                        <Fa icon="dizzy" />
                        Temporary Insanity
                    </BBadge>
                    <BBadge
                        v-if="details.status.indefiniteInsanity"
                        variant="danger"
                        class="condition-badge"
                    >
                        <Fa icon="brain" />
                        Indefinite Insanity
                    </BBadge>
                    <BBadge
                        v-if="details.status.majorWound"
                        variant="danger"
                        class="condition-badge"
                    >
                        <Fa icon="bandage" />
                        Major Wound
                    </BBadge>
                    <BBadge
                        v-if="details.status.unconscious"
                        variant="dark"
                        class="condition-badge"
                    >
                        <Fa icon="bed" />
                        Unconscious
                    </BBadge>
                    <BBadge
                        v-if="details.status.dying"
                        variant="danger"
                        class="condition-badge"
                    >
                        <Fa icon="skull-crossbones" />
                        Dying
                    </BBadge>
                    <span v-if="!hasConditions" class="text-muted fst-italic">
                        No active conditions
                    </span>
                </div>
            </div>
        </div>

        <!-- Edit Modal -->
        <EditStatusModal ref="editModal" @save="onEditSave" />
    </RpgkCard>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss" scoped>
    #coc-status-block {
        .status-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
        }

        .status-item {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
        }

        .status-label {
            font-weight: 600;
            font-size: 0.9rem;
            margin: 0;
        }

        .status-bar-container {
            flex: 1;
        }

        .status-text {
            font-size: 0.85rem;
            color: var(--bs-secondary);
        }

        .status-value-large {
            font-size: 2rem;
            font-weight: bold;
            text-align: center;
            padding: 0.5rem;
            background: var(--bs-light);
            border-radius: 0.25rem;
        }

        .conditions-section {
            margin-top: 1rem;
            padding-top: 1rem;
            border-top: 1px solid var(--bs-border-color);
        }

        .conditions-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
        }

        .condition-badge {
            padding: 0.5rem 0.75rem;
            font-size: 0.875rem;
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, ref } from 'vue';
    import { storeToRefs } from 'pinia';

    // Models
    import type { Character } from '@rpgk/core';
    import type { CoCSystemDetails } from '../../models.ts';

    // Stores
    import { useCharacterStore } from '@client/lib/resource-access/stores/characters';

    // Components
    import RpgkCard from '@client/components/ui/rpgkCard.vue';
    import EditStatusModal from './modals/editStatusModal.vue';

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
    const editModal = ref<InstanceType<typeof EditStatusModal> | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const character = computed<Character<CoCSystemDetails>>(() => current.value as any);
    const readonly = computed(() => props.readonly);
    const details = computed(() => character.value.details);

    const hasConditions = computed(() =>
    {
        const status = details.value.status;
        return status.temporaryInsanity
            || status.indefiniteInsanity
            || status.majorWound
            || status.unconscious
            || status.dying;
    });

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function openEditModal() : void
    {
        editModal.value?.show(character.value);
    }

    function onEditSave(editedDetails : Partial<CoCSystemDetails>) : void
    {
        if(editedDetails.sanity)
        {
            character.value.details.sanity = editedDetails.sanity;
        }

        if(editedDetails.hitPoints)
        {
            character.value.details.hitPoints = editedDetails.hitPoints;
        }

        if(editedDetails.magicPoints)
        {
            character.value.details.magicPoints = editedDetails.magicPoints;
        }

        if(editedDetails.luck)
        {
            character.value.details.luck = editedDetails.luck;
        }

        if(editedDetails.movement !== undefined)
        {
            character.value.details.movement = editedDetails.movement;
        }

        if(editedDetails.status)
        {
            character.value.details.status = editedDetails.status;
        }

        emit('save');
    }

    function getSanityVariant() : string
    {
        const percent = (details.value.sanity.value / details.value.sanity.max) * 100;
        if(percent <= 25) { return 'danger'; }
        if(percent <= 50) { return 'warning'; }
        return 'success';
    }

    function getHPVariant() : string
    {
        const percent = (details.value.hitPoints.value / details.value.hitPoints.max) * 100;
        if(percent <= 25) { return 'danger'; }
        if(percent <= 50) { return 'warning'; }
        return 'success';
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
