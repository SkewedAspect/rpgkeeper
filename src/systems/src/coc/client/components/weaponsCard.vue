<!----------------------------------------------------------------------------------------------------------------------
  -- Weapons Card
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <RpgkCard id="coc-weapons-block" :class="{ readonly: readonly }" fill no-body>
        <!-- Header -->
        <template #header>
            <div class="d-flex">
                <h5 class="align-items-center d-flex text-nowrap m-0 me-2 flex-grow-0 flex-shrink-0 w-auto">
                    <Fa class="me-1" icon="crosshairs" />
                    <span class="d-none d-md-inline">Weapons</span>
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
        <div v-if="character.details.weapons.length === 0" class="text-center text-muted p-3">
            No Weapons.
        </div>
        <div v-else class="weapons-table-wrapper">
            <table class="table table-sm table-striped mb-0">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th class="text-center">Damage</th>
                        <th class="text-center">Range</th>
                        <th class="text-center">Attacks</th>
                        <th class="text-center">Ammo</th>
                        <th class="text-center">Malfunction</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="weapon in character.details.weapons" :key="weapon.name">
                        <td>{{ weapon.name }}</td>
                        <td class="text-center">{{ weapon.damage }}</td>
                        <td class="text-center">{{ weapon.range }}</td>
                        <td class="text-center">{{ weapon.attacks }}</td>
                        <td class="text-center">{{ weapon.ammo ?? '—' }}</td>
                        <td class="text-center">{{ weapon.malfunction ?? '—' }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Edit Modal -->
        <EditWeaponsModal ref="editWeaponsModal" @save="onEditSave" />
    </RpgkCard>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss" scoped>
    #coc-weapons-block {
        .weapons-table-wrapper {
            max-height: 400px;
            overflow-y: auto;
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, ref } from 'vue';
    import { storeToRefs } from 'pinia';

    // Models
    import type { Character } from '@rpgk/core';
    import type { CoCSystemDetails, CoCWeapon } from '../../models.ts';

    // Stores
    import { useCharacterStore } from '@client/lib/resource-access/stores/characters';

    // Components
    import RpgkCard from '@client/components/ui/rpgkCard.vue';
    import EditWeaponsModal from './modals/editWeaponsModal.vue';

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
    const editWeaponsModal = ref<InstanceType<typeof EditWeaponsModal> | null>(null);

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
        editWeaponsModal.value?.show(character.value);
    }

    function onEditSave(weapons : CoCWeapon[]) : void
    {
        character.value.details.weapons = weapons;
        emit('save');
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
