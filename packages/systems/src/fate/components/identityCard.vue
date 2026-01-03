<!----------------------------------------------------------------------------------------------------------------------
  -- Identity Card
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <RpgkCard id="fate-identity-block" :class="{ readonly: readonly }" fill>
        <!-- Header -->
        <template #header>
            <div class="d-flex">
                <h5 class="align-items-center d-flex text-nowrap m-0 me-2 flex-grow-0 flex-shrink-0 w-auto">
                    <Fa class="me-1" icon="address-card" />
                    <span class="d-none d-md-inline">Identity</span>
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
        <BFormGroup
            id="name-input-group"
            label="Name"
            label-class="fw-bold"
        >
            <h5>{{ char.name }}</h5>
        </BFormGroup>
        <BFormGroup
            id="desc-input-group"
            label="Description"
            label-class="fw-bold"
        >
            <MarkdownBlock class="font-sm" :text="char.description" inline />
        </BFormGroup>
        <BFormGroup
            id="fp-input-group"
            class="mt-4 mb-0"
            label="Fate Points"
            label-class="fw-bold"
        >
            <FatePoints
                v-model:current="char.details.fatePoints.current"
                :refresh="char.details.fatePoints.refresh"
                :readonly="readonly"
                @update:current="onFateSave"
            />
        </BFormGroup>

        <!-- Edit Modal -->
        <EditIdentityModal ref="editModal" @save="onEditSave" />
    </RpgkCard>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss">
    #fate-identity-block {
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
    import type { Character } from '@rpgk/core';
    import type { FateSystemDetails } from '@rpgk/core/models/systems';

    // Stores
    import { useCharacterStore } from '@client/lib/resource-access/stores/characters';

    // Components
    import EditIdentityModal from './editIdentityModal.vue';
    import FatePoints from './fatePoints.vue';
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
    const editModal = ref<InstanceType<typeof EditIdentityModal> | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const char = computed<Character<FateSystemDetails>>(() => current.value as any);

    const readonly = computed(() => props.readonly);

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function openEditModal() : void
    {
        editModal.value.show(char.value);
    }

    function onFateSave() : void
    {
        emit('save');
    }

    function onEditSave(ident : { name : string, description : string, refresh : number }) : void
    {
        char.value.name = ident.name;
        char.value.description = ident.description;
        char.value.details.fatePoints.refresh = ident.refresh;

        emit('save');
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
