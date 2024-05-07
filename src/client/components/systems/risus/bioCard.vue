<!----------------------------------------------------------------------------------------------------------------------
  -- bioCard.vue
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <RpgkCard id="risus-bio-block" :class="{ readonly: readonly }" fill>
        <!-- Header -->
        <template #header>
            <div class="d-flex">
                <h5 class="align-items-center d-flex text-nowrap m-0 me-2 flex-grow-0 flex-shrink-0 w-auto">
                    <fa class="me-1" icon="address-card"></fa>
                    <span class="d-none d-md-inline">Bio</span>
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
            <MarkdownBlock class="font-sm" :text="description" inline></MarkdownBlock>
        </BFormGroup>
        <BFormRow>
            <BCol>
                <BFormGroup
                    id="adv-input-group"
                    label="Advancement Points"
                    label-class="fw-bold"
                >
                    <!-- FIXME: The 'number' modifier is broken with <BFormInput> -->
                    <BFormInput
                        v-model="char.details.advancementPoints"
                        class="form-control"
                        type="number"
                        min="0"
                        max="9999"
                        step="1"
                        :disabled="readonly"
                        number
                        @change="onChange"
                    ></BFormInput>
                </BFormGroup>
            </BCol>
            <BCol>
                <BFormGroup
                    id="ffd-input-group"
                    label="Fire and Forget Dice"
                    label-class="fw-bold"
                >
                    <BFormInput
                        v-model="char.details.ffDice"
                        type="number"
                        min="0"
                        max="9999"
                        step="1"
                        :disabled="readonly"
                        number
                        @change="onChange"
                    ></BFormInput>
                </BFormGroup>
            </BCol>
        </BFormRow>
        <BFormGroup
            id="lucky-input-group"
            label="Lucky Shots"
            label-class="fw-bold"
            class="mb-0"
        >
            <DicePool
                v-model:current="char.details.luckyShots.current"
                v-model:max="char.details.luckyShots.max"
                name="Lucky Shots"
                :disabled="readonly"
                @save="onChange"
            ></DicePool>
        </BFormGroup>

        <!-- Edit Modal -->
        <EditBioModal ref="editModal" @save="onEditSave"></EditBioModal>
    </RpgkCard>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss">
    #risus-bio-block {
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
    import { Character } from '../../../../common/interfaces/common';
    import { RisusSystemDetails } from '../../../../common/interfaces/systems/risus';

    // Stores
    import { useCharactersStore } from '../../../lib/stores/characters';

    // Components
    import EditBioModal from './editBioModal.vue';
    import DicePool from '../../character/dicePool.vue';
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
    const editModal = ref<InstanceType<typeof EditBioModal> | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const readonly = computed(() => props.readonly);

    const char = computed<Character<RisusSystemDetails>>(() => current.value as any);

    const description = computed(() =>
    {
        return truncate(char.value.description, { length: 160 });
    });

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function onChange()
    {
        if(!props.readonly)
        {
            emit('save');
        }
    }

    function openEditModal() : void
    {
        editModal.value.show(char.value);
    }

    function onEditSave(bio : { name : string, description : string }) : void
    {
        char.value.name = bio.name;
        char.value.description = bio.description;

        emit('save');
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
