<!----------------------------------------------------------------------------------------------------------------------
  -- Gear & Wealth Card
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <RpgkCard id="coc-gear-block" :class="{ readonly: readonly }" fill>
        <!-- Header -->
        <template #header>
            <div class="d-flex">
                <h5 class="align-items-center d-flex text-nowrap m-0 me-2 flex-grow-0 flex-shrink-0 w-auto">
                    <Fa class="me-1" icon="briefcase" />
                    <span class="d-none d-md-inline">Gear &amp; Wealth</span>
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
            <div class="flex-fill text-nowrap">
                <b>Cash:</b>
                <span class="ms-1">{{ character.details.wealth.cash }}</span>
            </div>
            <div class="flex-fill text-nowrap">
                <b>Assets:</b>
                <span class="ms-1">{{ character.details.wealth.assets || '-' }}</span>
            </div>
            <div class="flex-fill text-nowrap">
                <b>Spending Level:</b>
                <span class="ms-1">{{ character.details.wealth.spendingLevel || '-' }}</span>
            </div>
        </div>

        <hr class="my-2">

        <div>
            <b>Gear</b>
            <ul v-if="character.details.gear.length > 0" class="mb-0 mt-1">
                <li v-for="(item, index) in character.details.gear" :key="index">
                    {{ item }}
                </li>
            </ul>
            <p v-else class="text-muted mb-0 mt-1">
                No gear.
            </p>
        </div>

        <!-- Edit Modal -->
        <EditGearModal ref="editGearModal" @save="onEditSave" />
    </RpgkCard>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss">
    #coc-gear-block {
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

    // Models
    import type { Character } from '@rpgk/core';
    import type { CoCSystemDetails, CoCWealth } from '../../models.ts';

    // Stores
    import { useCharacterStore } from '@client/lib/resource-access/stores/characters';

    // Components
    import RpgkCard from '@client/components/ui/rpgkCard.vue';
    import EditGearModal from './modals/editGearModal.vue';

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
    const editGearModal = ref<InstanceType<typeof EditGearModal> | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const character = computed<Character<CoCSystemDetails>>(() => current.value as any);
    const readonly = computed(() => props.readonly);

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function openEditModal() : void
    {
        editGearModal.value?.show(character.value);
    }

    function onEditSave(data : { gear : string[], wealth : CoCWealth }) : void
    {
        character.value.details.gear = data.gear;
        character.value.details.wealth = data.wealth;
        emit('save');
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
