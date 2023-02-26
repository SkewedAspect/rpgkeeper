<!----------------------------------------------------------------------------------------------------------------------
  -- Risus Hooks
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <RpgkCard id="risus-hooks-block" :class="{ readonly: readonly }" fill no-body>
        <!-- Header -->
        <template #header>
            <div class="d-flex">
                <h5 class="align-items-center d-flex text-nowrap m-0 mr-2 flex-grow-0 flex-shrink-0 w-auto">
                    <fa class="mr-1" icon="fist-raised"></fa>
                    <span class="d-none d-md-inline">Hooks</span>
                </h5>
                <div v-if="!readonly" class="ml-auto">
                    <b-btn size="sm" style="margin-bottom: 1px;" @click="openEditModal()">
                        <fa icon="edit" fixed-width></fa>
                        <span class="d-none d-md-inline">Edit</span>
                    </b-btn>
                </div>
            </div>
        </template>

        <!-- Card Body -->
        <b-list-group v-if="hooks && hooks.length > 0" flush>
            <b-list-group-item v-for="hook in hooks" :key="hook.description" class="d-flex">
                <fa class="mr-2" icon="bolt" style="margin-top: 5px;"></fa>
                <MarkdownBlock :text="hook.description" inline></MarkdownBlock>
            </b-list-group-item>
        </b-list-group>
        <div v-else class="card-body">
            <h4 class="text-center text-muted m-0">
                No Hooks.
            </h4>
        </div>

        <!-- Edit Modal -->
        <EditHooksModal ref="editModal" @save="onEditSave"></EditHooksModal>
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
    import { Character } from '../../../../common/interfaces/common';
    import { RisusHook, RisusSystemDetails } from '../../../../common/interfaces/systems/risus';

    // Stores
    import { useCharactersStore } from '../../../lib/stores/characters';

    // Components
    import EditHooksModal from './editHooksModal.vue';
    import MarkdownBlock from '../../ui/markdownBlock.vue';
    import RpgkCard from '../../ui/rpgkCard.vue';

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
