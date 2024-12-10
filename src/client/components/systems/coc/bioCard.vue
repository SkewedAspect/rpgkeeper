<!----------------------------------------------------------------------------------------------------------------------
  -- Biography Card Component
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <RpgkCard id="coc-bio-block" :class="{ readonly: readonly }" fill>
        <!-- Header -->
        <template #header>
            <div class="d-flex">
                <h5 class="align-items-center d-flex m-0 me-2 flex-grow-0 flex-shrink-0 w-75">
                    <Fa class="me-1" icon="address-card" />
                    <span class="d-none d-md-block">
                        {{ char.name }}
                    </span>
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
                <b>Occupation:</b>
                <span class="ms-1">{{ bio.occupation || '-' }}</span>
            </div>
            <div class="flex-fill">
                <b>Age:</b>
                <span class="ms-1">{{ bio.age }}</span>
            </div>
            <div class="flex-fill">
                <b>Pronoun:</b>
                <span class="ms-1">{{ bio.pronouns || '-' }}</span>
            </div>
        </div>
        <div class="d-flex gap-2 mt-2">
            <div class="flex-fill text-nowrap">
                <b>Birthplace:</b>
                <span class="ms-1">{{ bio.birthplace || '-' }}</span>
            </div>
            <div class="flex-fill text-nowrap">
                <b>Residence:</b>
                <span class="ms-1">{{ bio.residence || '-' }}</span>
            </div>
        </div>
        <BFormGroup
            id="desc-input-group"
            label="Description"
            label-class="fw-bold"
            class="mt-2"
        >
            <MarkdownBlock class="font-sm" :text="description" inline />
        </BFormGroup>

        <!-- Edit Modal -->
        <EditBioModal id="editModal" ref="editModal" @save="onEditSave" />
    </RpgkCard>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss">
    #coc-bio-block {
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
    import { truncate } from 'lodash';

    // Interfaces
    import { Character } from '../../../../common/models';
    import { CoCSystemDetails, CocBiography } from '../../../../common/models/systems';

    // Stores
    import { useCharactersStore } from '../../../lib/stores/characters';

    // Components
    import EditBioModal from './modals/editBioModal.vue';
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

    type Events = (e : 'save') => void;

    const emit = defineEmits<Events>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const { current } = storeToRefs(useCharactersStore());
    const editModal = ref<InstanceType<typeof EditBioModal> | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const readonly = computed(() => props.readonly);
    const char = computed<Character<CoCSystemDetails>>(() => current.value as any);

    const bio = computed(() => char.value.details.biography);

    const description = computed(() =>
    {
        return truncate(char.value.description, { length: 160 });
    });

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function openEditModal() : void
    {
        editModal.value.show(char.value);
    }

    function onEditSave(editBio : CocBiography & { name : string, description : string }) : void
    {
        char.value.name = editBio.name;
        char.value.description = editBio.description;
        char.value.details.biography = editBio;

        emit('save');
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
