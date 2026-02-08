<!----------------------------------------------------------------------------------------------------------------------
  -- Gear & Wealth Card Component
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <RpgkCard id="coc-gear-wealth-block" :class="{ readonly: readonly }" fill>
        <!-- Header -->
        <template #header>
            <div class="d-flex">
                <h5 class="align-items-center d-flex text-nowrap m-0 me-2 flex-grow-0 flex-shrink-0 w-auto">
                    <Fa class="me-1" icon="suitcase" />
                    <span class="d-none d-md-inline">Gear & Wealth</span>
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
        <div>
            <!-- Wealth Section -->
            <div class="wealth-section mb-3">
                <h6 class="mb-2">
                    <Fa icon="coins" />
                    Wealth
                </h6>
                <div class="wealth-grid">
                    <div class="wealth-item">
                        <label class="fw-bold">Cash:</label>
                        <span>${{ wealth.cash.toLocaleString() }}</span>
                    </div>
                    <div class="wealth-item">
                        <label class="fw-bold">Spending Level:</label>
                        <span>{{ wealth.spendingLevel || '-' }}</span>
                    </div>
                </div>
                <BFormGroup
                    v-if="wealth.assets"
                    label="Assets"
                    label-class="fw-bold"
                    class="mt-2 mb-0"
                >
                    <MarkdownBlock class="font-sm" :text="wealth.assets" inline />
                </BFormGroup>
            </div>

            <hr>

            <!-- Gear Section -->
            <div class="gear-section">
                <h6 class="mb-2">
                    <Fa icon="backpack" />
                    Equipment
                </h6>
                <ul v-if="gear.length > 0" class="gear-list">
                    <li v-for="(item, index) in gear" :key="index">
                        {{ item }}
                    </li>
                </ul>
                <p v-else class="text-muted fst-italic mb-0">
                    No equipment recorded.
                </p>
            </div>
        </div>

        <!-- Edit Modal -->
        <EditGearWealthModal ref="editModal" @save="onEditSave" />
    </RpgkCard>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss" scoped>
    #coc-gear-wealth-block {
        .wealth-section {
            .wealth-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1rem;
                margin-bottom: 0.5rem;
            }

            .wealth-item {
                display: flex;
                gap: 0.5rem;
                align-items: baseline;

                label {
                    margin: 0;
                }
            }
        }

        .gear-section {
            .gear-list {
                columns: 2;
                column-gap: 2rem;
                padding-left: 1.5rem;
                margin: 0;

                @media (max-width: 768px) {
                    columns: 1;
                }
            }
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, ref } from 'vue';
    import { storeToRefs } from 'pinia';

    // Models
    import type { Character } from '@rpgk/core';
    import type { CoCSystemDetails, CoCWealth } from '../../models.ts';

    // Stores
    import { useCharacterStore } from '@client/lib/resource-access/stores/characters';

    // Components
    import RpgkCard from '@client/components/ui/rpgkCard.vue';
    import MarkdownBlock from '@client/components/ui/markdownBlock.vue';
    import EditGearWealthModal from './modals/editGearWealthModal.vue';

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
    const editModal = ref<InstanceType<typeof EditGearWealthModal> | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const character = computed<Character<CoCSystemDetails>>(() => current.value as any);
    const readonly = computed(() => props.readonly);
    const wealth = computed(() => character.value.details.wealth);
    const gear = computed(() => character.value.details.gear);

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function openEditModal() : void
    {
        editModal.value?.show(character.value);
    }

    function onEditSave(editedData : { wealth : CoCWealth; gear : string[] }) : void
    {
        character.value.details.wealth = editedData.wealth;
        character.value.details.gear = editedData.gear;
        emit('save');
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
