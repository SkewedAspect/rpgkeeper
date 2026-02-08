<!----------------------------------------------------------------------------------------------------------------------
  -- Stats Card Component
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <RpgkCard id="coc-stats-block" :class="{ readonly: readonly }" fill>
        <!-- Header -->
        <template #header>
            <div class="d-flex">
                <h5 class="align-items-center d-flex text-nowrap m-0 me-2 flex-grow-0 flex-shrink-0 w-auto">
                    <Fa class="me-1" icon="heartbeat" />
                    <span class="d-none d-md-inline">Stats</span>
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
        <div class="d-flex flex-wrap gap-2">
            <div class="flex-fill">
                <b>Hit Points:</b>
                <span class="ms-1">{{ details.hitPoints.value }} / {{ details.hitPoints.max }}</span>
            </div>
            <div class="flex-fill">
                <b>Magic Points:</b>
                <span class="ms-1">{{ details.magicPoints.value }} / {{ details.magicPoints.max }}</span>
            </div>
        </div>
        <div class="d-flex flex-wrap gap-2 mt-2">
            <div class="flex-fill">
                <b>Sanity:</b>
                <span class="ms-1">{{ details.sanity.value }} / {{ details.sanity.max }}</span>
            </div>
            <div class="flex-fill">
                <b>Luck:</b>
                <span class="ms-1">
                    {{ details.luck.value }} / {{ details.luck.max }}
                    <span v-if="details.luck.starting !== undefined" class="text-muted">
                        ({{ details.luck.starting }})
                    </span>
                </span>
            </div>
        </div>
        <div class="d-flex flex-wrap gap-2 mt-2">
            <div class="flex-fill">
                <b>Movement:</b>
                <span class="ms-1">{{ details.movement }}</span>
            </div>
        </div>

        <!-- Status -->
        <div class="mt-3">
            <b>Status:</b>
            <div class="d-flex flex-wrap gap-3 mt-1">
                <BFormCheckbox
                    v-for="key in statusKeys"
                    :key="key"
                    v-model="details.status[key]"
                    :disabled="readonly"
                    size="sm"
                    @change="onStatusChange()"
                >
                    {{ startCase(key) }}
                </BFormCheckbox>
            </div>
        </div>

        <!-- Edit Modal -->
        <EditStatsModal ref="editModal" @save="onEditSave" />
    </RpgkCard>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss" scoped>
    #coc-stats-block {
        //
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

    // Utils
    import { startCase } from '@client/lib/utils/misc';

    // Components
    import RpgkCard from '@client/components/ui/rpgkCard.vue';
    import EditStatsModal from './modals/editStatsModal.vue';

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

    const statusKeys = [
        'temporaryInsanity',
        'indefiniteInsanity',
        'majorWound',
        'unconscious',
        'dying',
    ] as const;

    const { current } = storeToRefs(useCharacterStore());
    const editModal = ref<InstanceType<typeof EditStatsModal> | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const readonly = computed(() => props.readonly);
    const char = computed<Character<CoCSystemDetails>>(() => current.value as any);
    const details = computed(() => char.value.details);

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function openEditModal() : void
    {
        editModal.value?.show(char.value);
    }

    function onEditSave() : void
    {
        emit('save');
    }

    function onStatusChange() : void
    {
        if(!readonly.value)
        {
            emit('save');
        }
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
