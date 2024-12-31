<!----------------------------------------------------------------------------------------------------------------------
  -- expCard.vue
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <RpgkCard id="eote-experience-block" :class="{ readonly: readonly }" fill>
        <!-- Header -->
        <template #header>
            <div class="d-flex">
                <h5 class="align-items-center d-flex text-nowrap m-0 me-2 flex-grow-0 flex-shrink-0 w-auto">
                    <Fa class="me-1" icon="user-hard-hat" />
                    <span class="d-none d-md-inline">Experience</span>
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
        <div class="d-flex">
            <BCard class="flex-fill me-2" no-body>
                <div class="p-2 text-center">
                    <b>Total</b>
                    <hr class="m-1">
                    <h5 class="m-0">
                        {{ experience.total }}
                    </h5>
                </div>
            </BCard>
            <BCard class="flex-fill" no-body>
                <div class="p-2 text-center">
                    <b>Available / Spent</b>
                    <hr class="m-1">
                    <h5 class="m-0">
                        {{ experience.available }} / {{ experience.total - experience.available }}
                    </h5>
                </div>
            </BCard>
        </div>

        <!-- Edit Modal -->
        <EditModal ref="editModal" @save="onEditSave" />
    </RpgkCard>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss" scoped>
    #eote-experience-block {
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, ref } from 'vue';
    import { storeToRefs } from 'pinia';

    // Models
    import { EoteOrGenCharacter } from '../../../../common/models/systems';

    // Stores
    import { useCharacterStore } from '../../../lib/resource-access/stores/characters';

    // Components
    import RpgkCard from '../../ui/rpgkCard.vue';
    import EditModal from './modals/editExperienceModal.vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Experience
    {
        total : number;
        available : number;
    }

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
    const readonly = computed(() => props.readonly);
    const editModal = ref<InstanceType<typeof EditModal> | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const character = computed<EoteOrGenCharacter>(() => current.value as any);
    const experience = computed(() => character.value.details.experience);

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function openEditModal() : void
    {
        editModal.value.show(character.value);
    }

    function onEditSave(exp : Experience) : void
    {
        character.value.details.experience = exp;

        emit('save');
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
