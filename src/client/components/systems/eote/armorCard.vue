<!----------------------------------------------------------------------------------------------------------------------
  -- armorCard.vue
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <RpgkCard id="eote-armor-block" :class="{ readonly: readonly }" fill no-body>
        <!-- Header -->
        <template #header>
            <div class="d-flex">
                <h5 class="align-items-center d-flex text-nowrap m-0 mr-2 flex-grow-0 flex-shrink-0 w-auto">
                    <fa class="mr-1" icon="helmet-battle"></fa>
                    Armor
                    <span v-if="armor.name" class="ml-1"> - {{ armor.name }}</span>
                </h5>
                <div v-if="!readonly" class="ml-auto">
                    <b-btn size="sm" style="margin-bottom: 1px;" @click="openEditModal()">
                        <fa icon="edit" fixed-width></fa>
                        <span class="d-none d-md-inline">Edit</span>
                    </b-btn>
                </div>
            </div>
        </template>

        <!-- Card Body -->
        <b-table-simple
            v-if="armor.name"
            class="font-sm mb-0"
            small
        >
            <b-thead>
                <b-tr>
                    <b-th class="text-center">
                        Defense
                    </b-th>
                    <b-th class="text-center">
                        Soak
                    </b-th>
                    <b-th class="text-center">
                        Hardpoints
                    </b-th>
                    <b-th class="text-center">
                        Encumb.
                    </b-th>
                    <b-th class="text-center">
                        Rarity
                    </b-th>
                    <b-th>
                        Upgrades
                    </b-th>
                </b-tr>
            </b-thead>
            <b-tbody>
                <b-tr>
                    <b-td class="text-center">
                        {{ armor.defense }}
                    </b-td>
                    <b-td class="text-center">
                        {{ armor.soak }}
                    </b-td>
                    <b-td class="text-center">
                        {{ armor.hardpoints }}
                    </b-td>
                    <b-td class="text-center">
                        {{ armor.encumbrance }}
                    </b-td>
                    <b-td class="text-center">
                        {{ armor.rarity }}
                    </b-td>
                    <b-td class="text-nowrap w-25">
                        <QualityTag
                            v-for="quality in armor.qualities"
                            :id="quality.id"
                            :key="quality.id"
                            :ranks="quality.ranks"
                        ></QualityTag>
                        <h5 v-if="armor.qualities === 0" class="mt-2 text-center">
                            No Upgrades.
                        </h5>
                    </b-td>
                </b-tr>
            </b-tbody>
        </b-table-simple>
        <h5 v-else class="mt-2 text-center">
            No armor
        </h5>

        <!-- Edit Modal -->
        <EditArmorModal ref="editArmorModal" @save="onEditSave"></EditArmorModal>
    </RpgkCard>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss">
    #eote-armor-block {
        .table tr td {
            vertical-align: middle !important;
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, ref } from 'vue';
    import { storeToRefs } from 'pinia';

    // Stores
    import { useCharactersStore } from '../../../lib/stores/characters';

    // Models
    import { EoteArmorRef, EoteCharacter } from '../../../../common/interfaces/systems/eote';

    // Managers
    import eoteMan from '../../../lib/managers/systems/eote';

    // Components
    import RpgkCard from '../../ui/rpgkCard.vue';
    import QualityTag from './components/qualityTag.vue';
    import EditArmorModal from './modals/editArmorModal.vue';

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

    const editArmorModal = ref<InstanceType<typeof EditArmorModal> | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const char = computed<EoteCharacter>(() => current.value as any);
    const mode = computed(() => eoteMan.mode);
    const readonly = computed(() => props.readonly);

    const armor = computed(() => char.value.details.armor);

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function openEditModal()
    {
        editArmorModal.value.show(char.value);
    }

    function onEditSave(newArmor : EoteArmorRef) : void
    {
        char.value.details.armor = newArmor;

        emit('save');
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
