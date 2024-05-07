<!----------------------------------------------------------------------------------------------------------------------
  -- Identity Card
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <RpgkCard id="fate-identity-block" :class="{ readonly: readonly }" fill>
        <!-- Header -->
        <template #header>
            <div class="d-flex">
                <h5 class="align-items-center d-flex text-nowrap m-0 mr-2 flex-grow-0 flex-shrink-0 w-auto">
                    <fa class="mr-1" icon="address-card"></fa>
                    <span class="d-none d-md-inline">Identity</span>
                </h5>
                <div v-if="!readonly" class="ml-auto">
                    <BButton size="sm" style="margin-bottom: 1px;" @click="openEditModal()">
                        <fa icon="edit" fixed-width></fa>
                        <span class="d-none d-md-inline">Edit</span>
                    </BButton>
                </div>
            </div>
        </template>

        <!-- Card Body -->
        <b-form-group
            id="name-input-group"
            label="Name"
            label-class="font-weight-bold"
        >
            <h5>{{ char.name }}</h5>
        </b-form-group>
        <b-form-group
            id="desc-input-group"
            label="Description"
            label-class="font-weight-bold"
        >
            <MarkdownBlock class="font-sm" :text="char.description" inline></MarkdownBlock>
        </b-form-group>
        <b-form-group
            id="fp-input-group"
            class="mt-4 mb-0"
            label="Fate Points"
            label-class="font-weight-bold"
        >
            <FatePoints
                v-model:current="char.details.fatePoints.current"
                :refresh="char.details.fatePoints.refresh"
                :readonly="readonly"
                @update:current="onFateSave"
            ></FatePoints>
        </b-form-group>

        <!-- Edit Modal -->
        <EditIdentityModal ref="editModal" @save="onEditSave"></EditIdentityModal>
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
    import { Character } from '../../../../common/interfaces/common';
    import { FateSystemDetails } from '../../../../common/interfaces/systems/fate';

    // Stores
    import { useCharactersStore } from '../../../lib/stores/characters';

    // Components
    import EditIdentityModal from './editIdentityModal.vue';
    import FatePoints from './fatePoints.vue';
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
