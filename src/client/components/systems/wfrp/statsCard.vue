<!----------------------------------------------------------------------------------------------------------------------
  -- Wfrp Stats
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <RpgkCard id="wfrp-stats-block" :class="{ readonly: readonly }" fill no-body>
        <!-- Header -->
        <template #header>
            <div class="d-flex">
                <h5 class="align-items-center d-flex text-nowrap m-0 me-2 flex-grow-0 flex-shrink-0 w-auto">
                    <fa class="me-1" icon="flame"></fa>
                    <span class="d-none d-md-inline">Stats</span>
                </h5>
                <div v-if="!readonly" class="ms-auto">
                    <BButton size="sm" style="margin-bottom: 1px;" @click="openEditModal()">
                        <fa icon="edit" fixed-width></fa>
                        <span class="d-none d-md-inline">Edit</span>
                    </BButton>
                </div>
            </div>
        </template>

        <!-- Card Body -->
        <BListGroup v-if="stats && stats.length > 0" flush>
            <BListGroupItem v-for="stat in stats" :key="stat.description" class="d-flex">
                <div class="d-inline-block flex-fill">
                    <div>
                        <b>{{ stat.description }}</b> ({{ stat.value }})
                    </div>
                </div>
            </BListGroupItem>
        </BListGroup>
        <div v-else class="card-body">
            <h4 class="text-center text-muted m-0">
                No Stats.
            </h4>
        </div>

        <!-- Edit Modal -->
        <EditStatsModal ref="editModal" @save="onEditSave"></EditStatsModal>
    </RpgkCard>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss">
    #wfrp-stats-block {
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
    import { Character } from '../../../../common/interfaces/common';
    import { WFRPStat, WFRPSystemDetails } from '../../../../common/interfaces/systems/wfrp';

    // Stores
    import { useCharactersStore } from '../../../lib/stores/characters';

    // Components
    import RpgkCard from '../../ui/rpgkCard.vue';
    import EditStatsModal from './editStatsModal.vue';

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
    const editModal = ref<InstanceType<typeof EditStatsModal> | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const readonly = computed(() => props.readonly);

    const char = computed<Character<WFRPSystemDetails>>(() => current.value as any);

    const stats = computed(() =>
    {
        return char.value.details.stats;
    });

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function openEditModal() : void
    {
        editModal.value.show(stats.value);
    }

    function onEditSave(newSkills : WFRPStat[]) : void
    {
        char.value.details.stats = newSkills;

        emit('save');
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
