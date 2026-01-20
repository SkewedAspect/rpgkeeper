<!----------------------------------------------------------------------------------------------------------------------
  -- Characteristics Card
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <RpgkCard id="eote-chars-block" :class="{ readonly: readonly }" fill no-body>
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
        <div class="d-flex flex-wrap align-content-stretch justify-content-start mt-auto mb-auto ms-2 me-2 pt-1 pb-1">
            <BCard
                v-for="char in characteristics"
                :key="char"
                class="flex-fill ms-1 me-1 mt-1 mb-1 text-nowrap"
                style="min-width: 50px; width: 30%"
                no-body
            >
                <h3 class="mt-2 mb-2 text-center">
                    {{ getCharacteristic(char) }}
                </h3>
                <template #footer>
                    <div class="text-center overflow-hidden">
                        {{ formatCharName(char) }}
                    </div>
                </template>
            </BCard>
        </div>

        <!-- Edit Modal -->
        <EditModal ref="editModal" @save="onEditSave" />
    </RpgkCard>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss" scoped>
    #eote-chars-block {
        h3 {
            font-size: 1.50rem;
        }
        .card-footer {
            padding: 0.3rem 1rem;
            font-size: 0.90rem;
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, ref } from 'vue';
    import { storeToRefs } from 'pinia';

    // Models
    import type { EoteCharacteristics, EoteOrGenCharacter } from '../../models.ts';

    // Stores
    import { useCharacterStore } from '@client/lib/resource-access/stores/characters';

    // Utils
    import { startCase } from '@client/lib/utils/misc';

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

    type CharacteristicKey = keyof EoteCharacteristics;
    const characteristics = ref<CharacteristicKey[]>([
        'brawn',
        'agility',
        'intellect',
        'cunning',
        'willpower',
        'presence',
    ]);

    const { current } = storeToRefs(useCharacterStore());
    const editModal = ref<InstanceType<typeof EditModal> | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const character = computed<EoteOrGenCharacter>(() => current.value as any);
    const readonly = computed(() => props.readonly);

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function openEditModal() : void
    {
        editModal.value?.show(character.value);
    }

    function onEditSave(chars : EoteCharacteristics) : void
    {
        character.value.details.characteristics = {
            ...character.value.details.characteristics,
            ...chars,
        };

        emit('save');
    }

    function formatCharName(text : string) : string
    {
        return startCase(text);
    }

    function getCharacteristic(char : CharacteristicKey) : number
    {
        return character.value.details.characteristics[char];
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
