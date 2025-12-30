<!----------------------------------------------------------------------------------------------------------------------
  -- Risus Hooks
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <RpgkCard id="risus-hooks-block" :class="{ readonly: readonly }" fill no-body>
        <!-- Header -->
        <template #header>
            <div class="d-flex">
                <h5 class="align-items-center d-flex text-nowrap m-0 me-2 flex-grow-0 flex-shrink-0 w-auto">
                    <Fa class="me-1" icon="fist-raised" />
                    <span class="d-none d-md-inline">Hooks</span>
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
        <BListGroup v-if="hooks && hooks.length > 0" flush>
            <BListGroupItem v-for="hook in hooks" :key="hook.description" class="d-flex">
                <Fa class="me-2" icon="bolt" style="margin-top: 5px;" />
                <MarkdownBlock :text="hook.description" inline />
            </BListGroupItem>
        </BListGroup>
        <div v-else class="card-body">
            <h4 class="text-center text-muted m-0">
                No Hooks.
            </h4>
        </div>

        <!-- Edit Modal -->
        <EditHooksModal ref="editModal" @save="onEditSave" />
    </RpgkCard>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss">
    #risus-hooks-block {
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
    //------------------------------------------------------------------------------------------------------------------

    import { computed, ref } from 'vue';
    import { storeToRefs } from 'pinia';

    // Interfaces
    import { Character } from '@rpgk/core';
    import { RisusHook, RisusSystemDetails } from '@rpgk/core/models/systems';

    // Stores
    import { useCharacterStore } from '@client/lib/resource-access/stores/characters';

    // Components
    import EditHooksModal from './editHooksModal.vue';
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
    const editModal = ref<InstanceType<typeof EditHooksModal> | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const readonly = computed(() => props.readonly);

    const char = computed<Character<RisusSystemDetails>>(() => current.value as any);

    const hooks = computed(() =>
    {
        return char.value.details.hooks;
    });

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function openEditModal() : void
    {
        editModal.value.show(hooks.value);
    }

    function onEditSave(newHooks : RisusHook[]) : void
    {
        char.value.details.hooks = newHooks;

        emit('save');
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
