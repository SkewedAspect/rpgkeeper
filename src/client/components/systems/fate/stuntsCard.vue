<!----------------------------------------------------------------------------------------------------------------------
  -- FATE Stunts
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <RpgkCard id="fate-stunts" :class="{ readonly: readonly }" fill>
        <template #header>
            <div class="d-flex">
                <h5 class="align-items-center d-flex text-nowrap m-0 me-2 flex-grow-0 flex-shrink-0 w-auto">
                    <Fa class="me-1" icon="hand-holding-magic" />
                    <span class="d-none d-md-inline">Stunts</span>
                </h5>
                <div v-if="!readonly" class="ms-auto">
                    <BButton size="sm" style="margin-bottom: 1px;" @click="openEditModal()">
                        <Fa icon="edit" fixed-width />
                        <span class="d-none d-md-inline">Edit</span>
                    </BButton>
                </div>
            </div>
        </template>

        <!-- Content -->
        <div class="stunts-content">
            <div v-for="(stunt, index) in stunts" :key="index">
                <div><b>{{ stunt.title }}</b></div>
                <MarkdownBlock :text="stunt.description" />
            </div>
            <div v-if="stunts.length === 0">
                <h6 class="text-center">
                    No stunts.
                </h6>
            </div>
        </div>

        <!-- Modals -->
        <EditStuntsModal ref="editModal" @save="onEditSave" />
    </RpgkCard>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, ref } from 'vue';
    import { orderBy } from 'lodash';

    // Interfaces
    import { FateStunt } from '@rpgk/core/models/systems';

    // Components
    import RpgkCard from '../../ui/rpgkCard.vue';
    import MarkdownBlock from '../../ui/markdownBlock.vue';
    import EditStuntsModal from './editStuntsModal.vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Props
    {
        stunts : FateStunt[];
        readonly : boolean;
    }

    const props = defineProps<Props>();

    interface Events
    {
        (e : 'update:stunts', stunts : FateStunt[]);
        (e : 'save') : void;
    }

    const emit = defineEmits<Events>();

    //------------------------------------------------------------------------------------------------------------------
    // Ref
    //------------------------------------------------------------------------------------------------------------------

    const editModal = ref<InstanceType<typeof EditStuntsModal> | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const readonly = computed(() => props.readonly);

    const stunts = computed<FateStunt[]>({
        get() { return orderBy(props.stunts, [ 'title' ], [ 'asc' ]); },
        set(val) { emit('update:stunts', val); },
    });

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function openEditModal() : void
    {
        editModal.value.show(stunts.value);
    }

    function onEditSave(newStunts : FateStunt[]) : void
    {
        stunts.value = newStunts;

        emit('save');
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
