<!----------------------------------------------------------------------------------------------------------------------
  -- FATE Extras
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <RpgkCard id="fate-extras" :class="{ readonly: readonly }" fill>
        <template #header>
            <div class="d-flex">
                <h5 class="align-items-center d-flex text-nowrap m-0 me-2 flex-grow-0 flex-shrink-0 w-auto">
                    <Fa class="me-1" icon="magic" />
                    <span class="d-none d-md-inline">Extras</span>
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
        <MarkdownBlock v-if="extras" :text="extras" />
        <div v-else>
            <h6 class="text-center">
                No Extras
            </h6>
        </div>

        <!-- Modals -->
        <EditExtrasModal ref="editModal" @save="onEditSave" />
    </RpgkCard>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, ref } from 'vue';

    // Components
    import RpgkCard from '@client/components/ui/rpgkCard.vue';
    import MarkdownBlock from '@client/components/ui/markdownBlock.vue';
    import EditExtrasModal from './editExtrasModal.vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Props
    {
        extras : string;
        readonly : boolean;
    }

    const props = defineProps<Props>();

    interface Events
    {
        (e : 'update:extras', extra : string);
        (e : 'save') : void;
    }

    const emit = defineEmits<Events>();

    //------------------------------------------------------------------------------------------------------------------
    // Ref
    //------------------------------------------------------------------------------------------------------------------

    const editModal = ref<InstanceType<typeof EditExtrasModal> | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const readonly = computed(() => props.readonly);

    const extras = computed<string>({
        get() { return props.extras; },
        set(val) { emit('update:extras', val); },
    });

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function openEditModal() : void
    {
        editModal.value?.show(extras.value);
    }

    function onEditSave(newExtras : string) : void
    {
        extras.value = newExtras;

        emit('save');
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
