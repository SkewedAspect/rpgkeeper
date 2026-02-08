<!----------------------------------------------------------------------------------------------------------------------
  -- Edit Gear & Wealth Modal
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <BModal
        id="edit-gear-wealth-modal"
        ref="modal"
        size="lg"
        header-bg-variant="dark"
        header-text-variant="white"
        no-close-on-backdrop
        no-close-on-esc
        @ok="onSave"
        @cancel="onCancel"
    >
        <template #header>
            <h5 class="mb-0">
                <Fa icon="suitcase" />
                Edit Gear & Wealth
            </h5>
        </template>

        <div v-if="localData">
            <!-- Wealth Section -->
            <h6 class="mb-3">
                <Fa icon="coins" />
                Wealth
            </h6>

            <BFormGroup label="Cash" label-for="cash">
                <BFormInput
                    id="cash"
                    v-model.number="localData.wealth.cash"
                    type="number"
                    min="0"
                />
            </BFormGroup>

            <BFormGroup label="Spending Level" label-for="spending-level">
                <BFormInput
                    id="spending-level"
                    v-model="localData.wealth.spendingLevel"
                    placeholder="e.g., Wealthy, Average, Poor"
                />
            </BFormGroup>

            <BFormGroup label="Assets" label-for="assets">
                <BFormTextarea
                    id="assets"
                    v-model="localData.wealth.assets"
                    rows="3"
                    placeholder="Describe your assets (property, investments, etc.)"
                />
            </BFormGroup>

            <hr class="my-4">

            <!-- Gear Section -->
            <h6 class="mb-3">
                <Fa icon="backpack" />
                Equipment
            </h6>

            <div class="gear-list-editor">
                <div v-for="(item, index) in localData.gear" :key="index" class="gear-item mb-2">
                    <BInputGroup>
                        <BFormInput
                            v-model="localData.gear[index]"
                            placeholder="Item name"
                        />
                        <template #append>
                            <BButton variant="danger" @click="removeGearItem(index)">
                                <Fa icon="trash" />
                            </BButton>
                        </template>
                    </BInputGroup>
                </div>
                <BButton variant="success" size="sm" @click="addGearItem">
                    <Fa icon="plus" />
                    Add Item
                </BButton>
            </div>
        </div>
    </BModal>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { ref } from 'vue';
    import type { BModal } from 'bootstrap-vue-next';

    // Models
    import type { Character } from '@rpgk/core';
    import type { CoCSystemDetails, CoCWealth } from '../../../models.ts';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface EditData
    {
        wealth : CoCWealth;
        gear : string[];
    }

    interface Events
    {
        (e : 'save', data : EditData) : void;
    }

    const emit = defineEmits<Events>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const modal = ref<InstanceType<typeof BModal> | null>(null);
    const localData = ref<EditData | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function show(char : Character<CoCSystemDetails>) : void
    {
        // Deep copy to avoid mutating the original until save
        localData.value = {
            wealth: JSON.parse(JSON.stringify(char.details.wealth)),
            gear: JSON.parse(JSON.stringify(char.details.gear)),
        };
        modal.value?.show();
    }

    function onSave() : void
    {
        if(localData.value)
        {
            // Filter out empty gear items
            localData.value.gear = localData.value.gear.filter((item) => item.trim() !== '');
            emit('save', localData.value);
        }
    }

    function onCancel() : void
    {
        localData.value = null;
    }

    function addGearItem() : void
    {
        if(localData.value)
        {
            localData.value.gear.push('');
        }
    }

    function removeGearItem(index : number) : void
    {
        if(localData.value)
        {
            localData.value.gear.splice(index, 1);
        }
    }

    //------------------------------------------------------------------------------------------------------------------

    defineExpose({ show });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
