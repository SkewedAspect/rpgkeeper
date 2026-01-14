<!----------------------------------------------------------------------------------------------------------------------
  -- bioCard.vue
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <RpgkCard id="risus-bio-block" :class="{ readonly: readonly }" fill>
        <!-- Header -->
        <template #header>
            <div class="d-flex">
                <h5 class="align-items-center d-flex text-nowrap m-0 me-2 flex-grow-0 flex-shrink-0 w-auto">
                    <Fa class="me-1" icon="address-card" />
                    <span class="d-none d-md-inline">Bio</span>
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
            <MarkdownBlock class="font-sm" :text="description" inline />
        </BFormGroup>
        <BFormRow>
            <BCol>
                <BFormGroup
                    id="adv-input-group"
                    label="Advancement Points"
                    label-class="fw-bold"
                >
                    <BFormInput
                        v-model.number="char.details.advancementPoints"
                        class="form-control"
                        type="number"
                        min="0"
                        max="9999"
                        step="1"
                        :disabled="readonly"
                        @change="onChange"
                    />
                </BFormGroup>
            </BCol>
            <BCol>
                <BFormGroup
                    id="ffd-input-group"
                    label="Fire and Forget Dice"
                    label-class="fw-bold"
                >
                    <BFormInput
                        v-model.number="char.details.ffDice"
                        type="number"
                        min="0"
                        max="9999"
                        step="1"
                        :disabled="readonly"
                        @change="onChange"
                    />
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
            />
        </BFormGroup>

        <!-- Edit Modal -->
        <EditBioModal ref="editModal" @save="onEditSave" />
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
    import type { Character } from '@rpgk/core';
    import type { RisusSystemDetails } from '../models.ts';

    // Stores
    import { useCharacterStore } from '@client/lib/resource-access/stores/characters';

    // Components
    import EditBioModal from './editBioModal.vue';
    import DicePool from '@client/components/character/dicePool.vue';
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

    function onChange() : void
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
