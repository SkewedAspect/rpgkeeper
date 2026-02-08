<!----------------------------------------------------------------------------------------------------------------------
  -- editGearModal
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="edit-gear-modal">
        <BModal
            ref="innerModal"
            header-bg-variant="dark"
            header-text-variant="white"
            size="lg"
            no-close-on-esc
            no-close-on-backdrop
            @ok="onSave"
            @cancel="onCancel"
        >
            <!-- Modal Header -->
            <template #header="{ cancel }">
                <h5 v-b-color-mode="'dark'" class="w-100 mb-0">
                    <Fa icon="file-edit" />
                    Edit Gear &amp; Wealth
                    <CloseButton class="float-end" @click="cancel" />
                </h5>
            </template>

            <!-- Wealth Section -->
            <h6 class="fw-bold">Wealth</h6>
            <div class="d-flex gap-2 mb-3">
                <BFormGroup label="Cash" label-class="fw-bold" class="flex-fill">
                    <BFormInput v-model.number="wealth.cash" type="number" step="1" min="0" />
                </BFormGroup>
                <BFormGroup label="Assets" label-class="fw-bold" class="flex-fill">
                    <BFormInput v-model="wealth.assets" />
                </BFormGroup>
                <BFormGroup label="Spending Level" label-class="fw-bold" class="flex-fill">
                    <BFormInput v-model="wealth.spendingLevel" />
                </BFormGroup>
            </div>

            <hr>

            <!-- Gear Section -->
            <h6 class="fw-bold">Gear</h6>
            <div v-for="(item, index) in gear" :key="index" class="d-flex mb-2">
                <BFormInput v-model="gear[index]" />
                <BButton variant="danger" class="ms-2" @click="removeGear(index)">
                    <Fa icon="trash-alt" />
                </BButton>
            </div>

            <hr>

            <BCard
                header="New Gear"
                header-bg-variant="dark"
                header-text-variant="white"
            >
                <div class="d-flex">
                    <BFormInput id="new-gear-input" v-model="newGear" />
                    <BButton variant="primary" class="ms-2 text-nowrap" @click="addGear">
                        <Fa icon="plus" />
                        Add
                    </BButton>
                </div>
            </BCard>

            <!-- Modal Buttons -->
            <template #ok="{ ok }">
                <BButton variant="primary" @click="ok">
                    <Fa icon="save" />
                    Save
                </BButton>
            </template>
            <template #cancel="{ cancel }">
                <BButton variant="secondary" @click="cancel">
                    <Fa icon="times" />
                    Cancel
                </BButton>
            </template>
        </BModal>
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss">
    .edit-gear-modal {
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { ref } from 'vue';

    // Models
    import type { Character } from '@rpgk/core';
    import type { CoCSystemDetails, CoCWealth } from '../../../models.ts';

    // Components
    import { BModal } from 'bootstrap-vue-next';
    import CloseButton from '@client/components/ui/closeButton.vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    type Events = (e : 'save', data : { gear : string[], wealth : CoCWealth }) => void;

    const emit = defineEmits<Events>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const gear = ref<string[]>([]);
    const wealth = ref<CoCWealth>({ cash: 0, assets: '', spendingLevel: '' });
    const newGear = ref<string>('');

    const innerModal = ref<InstanceType<typeof BModal> | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function show(char : Character<CoCSystemDetails>) : void
    {
        // Clone the gear array and wealth object
        gear.value = [ ...char.details.gear ];
        wealth.value = { ...char.details.wealth };

        // Show the modal
        innerModal.value?.show();
    }

    function hide() : void
    {
        innerModal.value?.hide();
    }

    function onSave() : void
    {
        emit('save', { gear: gear.value, wealth: wealth.value });
        gear.value = [];
        wealth.value = { cash: 0, assets: '', spendingLevel: '' };
    }

    function onCancel() : void
    {
        gear.value = [];
        wealth.value = { cash: 0, assets: '', spendingLevel: '' };
    }

    function addGear() : void
    {
        if(!newGear.value.trim())
        {
            return;
        }

        gear.value.push(newGear.value.trim());
        newGear.value = '';
    }

    function removeGear(index : number) : void
    {
        if(index > -1)
        {
            gear.value.splice(index, 1);
        }
    }

    //------------------------------------------------------------------------------------------------------------------

    defineExpose({ show, hide });

    //------------------------------------------------------------------------------------------------------------------
</script>

<!--------------------------------------------------------------------------------------------------------------------->
