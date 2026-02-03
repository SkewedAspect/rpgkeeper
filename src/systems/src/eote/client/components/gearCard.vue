<!----------------------------------------------------------------------------------------------------------------------
  -- Gear Card
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <RpgkCard id="eote-gear-block" :class="{ readonly: readonly }" fill no-body>
        <!-- Header -->
        <template #header>
            <div class="d-flex">
                <h5 class="align-items-center d-flex text-nowrap m-0 me-2 flex-grow-0 flex-shrink-0 w-auto">
                    <Fa class="me-1" icon="backpack" />
                    <span class="d-none d-md-inline">Gear</span>
                </h5>
                <div v-if="!readonly" class="ms-auto">
                    <BButton size="sm" style="margin-bottom: 1px;" @click="openAddEditModal()">
                        <Fa icon="plus" fixed-width />
                        <span class="d-none d-md-inline">Add</span>
                    </BButton>
                </div>
            </div>
        </template>

        <!-- Card Body -->
        <BTable
            v-if="gear.length > 0"
            class="font-sm mb-0"
            :items="gear"
            :fields="fields"
            small
            hover
            @row-clicked="onRowClicked"
        >
            <!-- Buttons Slot -->
            <template #cell(buttons)="data">
                <BButton v-if="!readonly" size="sm" @click="openAddEditModal(data.item)">
                    <Fa icon="edit" />
                </BButton>
                <BButton v-if="!readonly" class="ms-1" variant="danger" size="sm" @click="openDeleteModal(data.item)">
                    <Fa icon="trash-alt" />
                </BButton>
            </template>
        </BTable>

        <!-- Empty -->
        <h5 v-else class="mt-2 text-center">
            No gear
        </h5>

        <!-- Modals -->
        <AddEditGearModal ref="addEditModal" @add="onAdd" @edit="onEdit" />
        <ConfirmModal ref="confirmModal" @confirm="onConfirmDelete" />
    </RpgkCard>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss">
    #eote-gear-block {
        .table tr td {
            cursor: pointer;
            vertical-align: middle !important;
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, ref } from 'vue';
    import { storeToRefs } from 'pinia';

    // Models
    import type { EoteGearRef, EoteOrGenCharacter } from '../../models.ts';

    // Stores
    import { useCharacterStore } from '@client/lib/resource-access/stores/characters';

    // Components
    import RpgkCard from '@client/components/ui/rpgkCard.vue';
    import AddEditGearModal from './modals/addEditGearModal.vue';
    import ConfirmModal from './modals/confirmModal.vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Props
    {
        readonly : boolean;
    }

    defineProps<Props>();

    const emit = defineEmits<{
        save : [];
    }>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const { current } = storeToRefs(useCharacterStore());
    const characterStore = useCharacterStore();

    const addEditModal = ref<InstanceType<typeof AddEditGearModal>>();
    const confirmModal = ref<InstanceType<typeof ConfirmModal>>();
    const gearToDelete = ref<EoteGearRef | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const character = computed<EoteOrGenCharacter>(() => current.value as any);
    const gear = computed(() => character.value.details.gear);

    const fields = [
        { key: 'name', label: 'Name', sortable: true },
        { key: 'encumbrance', label: 'Encumb.', sortable: true, class: 'text-center' },
        { key: 'rarity', label: 'Rarity', sortable: true, class: 'text-center' },
        { key: 'buttons', label: '' },
    ];

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function openAddEditModal(item ?: EoteGearRef) : void
    {
        addEditModal.value?.show(item);
    }

    function openDeleteModal(item : EoteGearRef) : void
    {
        gearToDelete.value = item;
        confirmModal.value?.show({
            title: 'Remove Gear',
            message: `Are you sure you want to remove "${ item.name }"?`,
            confirmText: 'Remove',
            dangerButton: true,
        });
    }

    function onRowClicked(item : EoteGearRef) : void
    {
        openAddEditModal(item);
    }

    function onAdd(newGear : EoteGearRef) : void
    {
        character.value.details.gear.push(newGear);
        characterStore.save();
        emit('save');
    }

    function onEdit(index : number, updatedGear : EoteGearRef) : void
    {
        character.value.details.gear.splice(index, 1, updatedGear);
        characterStore.save();
        emit('save');
    }

    function onConfirmDelete() : void
    {
        if(gearToDelete.value)
        {
            const index = character.value.details.gear.findIndex((item) => item === gearToDelete.value);
            if(index !== -1)
            {
                character.value.details.gear.splice(index, 1);
                characterStore.save();
                emit('save');
            }
            gearToDelete.value = null;
        }
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
