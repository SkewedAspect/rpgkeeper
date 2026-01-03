<!----------------------------------------------------------------------------------------------------------------------
  -- Characteristics Card
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <RpgkCard id="coc-chars-block" :class="{ readonly: readonly }" fill no-body>
        <!-- Header -->
        <template #header>
            <div class="d-flex">
                <h5 class="align-items-center d-flex text-nowrap m-0 me-2 flex-grow-0 flex-shrink-0 w-auto">
                    <Fa class="me-1" icon="fist-raised" />
                    <span class="d-none d-md-inline">Characteristics</span>
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
        <div class="d-flex flex-wrap justify-content-evenly gap-2 m-2">
            <BCard
                v-for="char in characteristics"
                :key="char"
                class="char-table"
                style="min-width: 50px; width: 30%"
                no-body
            >
                <table class="table table-bordered table-sm mb-0">
                    <tbody>
                        <tr>
                            <td rowspan="2" class="align-middle bg-secondary-subtle" style="width: 66px">
                                <h5 class="mb-0 text-center">
                                    {{ formatCharName(char) }}
                                </h5>
                            </td>
                            <td rowspan="2" class="text-center align-middle">
                                <h3 class="mb-0 text-center">
                                    {{ getCharacteristic(char) }}
                                </h3>
                            </td>
                            <td>
                                <div class="text-muted text-center">
                                    {{ getHalfCharacteristic(char) }}
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div class="text-muted text-center">
                                    {{ getFifthCharacteristic(char) }}
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </BCard>
        </div>

        <!-- Edit Modal -->
        <EditModal ref="editModal" @save="onEditSave" />
    </RpgkCard>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss" scoped>
    #coc-chars-block {
        .char-table {
            overflow: hidden;

            table {
                tr:first-of-type {
                    border-top: none;

                    td:first-of-type {
                        border-left: none;
                    }
                    td:last-of-type {
                        border-right: none;
                    }
                }

                tr:last-of-type {
                    border-bottom: none;

                    td:last-of-type {
                        border-right: none;
                    }
                }
            }
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, ref } from 'vue';
    import { storeToRefs } from 'pinia';

    // Models
    import type { Character } from '@rpgk/core';
    import {
        type CoCCharacteristics,
        type CoCSystemDetails,
        validCoCCharacteristicNames,
    } from '@rpgk/core/models/systems';

    // Stores
    import { useCharacterStore } from '@client/lib/resource-access/stores/characters';

    // Components
    import RpgkCard from '@client/components/ui/rpgkCard.vue';
    import EditModal from './modals/editCharacteristicsModal.vue';

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

    const characteristics = validCoCCharacteristicNames;

    const { current } = storeToRefs(useCharacterStore());
    const editModal = ref<InstanceType<typeof EditModal> | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const character = computed<Character<CoCSystemDetails>>(() => current.value as any);
    const readonly = computed(() => props.readonly);

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function openEditModal() : void
    {
        editModal.value.show(character.value);
    }

    function onEditSave(chars : CoCCharacteristics) : void
    {
        character.value.details.characteristics = {
            ...character.value.details.characteristics,
            ...chars,
        };

        emit('save');
    }

    function formatCharName(text) : string
    {
        return text.slice(0, 3).toUpperCase();
    }

    function getCharacteristic(char) : number
    {
        return character.value.details.characteristics[char];
    }

    function getHalfCharacteristic(char) : number
    {
        return Math.floor(character.value.details.characteristics[char] / 2);
    }

    function getFifthCharacteristic(char) : number
    {
        return Math.floor(character.value.details.characteristics[char] / 5);
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
