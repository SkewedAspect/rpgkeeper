<!----------------------------------------------------------------------------------------------------------------------
  -- editStatsModal
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="edit-stats-modal">
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
                    Edit Stats
                    <CloseButton class="float-end" @click="cancel" />
                </h5>
            </template>

            <!-- Modal Content -->
            <div v-for="(stat, index) in stats" :key="index" class="d-flex mb-2">
                <BFormInput
                    v-model.number="stat.value"
                    type="number"
                    min="1"
                    max="99"
                    step="1"
                    style="max-width: 60px; min-width: 60px;"
                />
                <BFormInput v-model="stat.description" class="ms-2" placeholder="Description" />
                <BButton variant="danger" class="ms-2" @click="removeStat(stat)">
                    <Fa icon="trash-alt" />
                </BButton>
            </div>

            <hr>

            <BCard
                header="New Stat"
                header-bg-variant="dark"
                header-text-variant="white"
            >
                <div class="d-flex">
                    <BFormInput
                        v-model.number="newValue"
                        type="number"
                        min="1"
                        max="99"
                        step="1"
                        style="max-width: 60px; min-width: 60px;"
                    />
                    <BFormInput id="new-desc" v-model="newDesc" class="ms-2" placeholder="Description" />
                    <BButton variant="primary" class="ms-2 text-nowrap" :disabled="!isAddValid" @click="addStat">
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
    .edit-stats-modal {
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, ref } from 'vue';

    // Interfaces
    import type { WFRPStat } from '../../models.ts';

    // Components
    import { BModal } from 'bootstrap-vue-next';
    import CloseButton from '@client/components/ui/closeButton.vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    type Events = (e : 'save', stats : WFRPStat[]) => void;

    const emit = defineEmits<Events>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const stats = ref<WFRPStat[]>([]);
    const newValue = ref<number>(1);
    const newDesc = ref<string>('');

    const innerModal = ref<InstanceType<typeof BModal> | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const isAddValid = computed(() =>
    {
        return Number.isFinite(newValue.value) && !!newDesc.value;
    });

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function show(charStats : WFRPStat[]) : void
    {
        // Clone the array of stats
        stats.value = charStats.map((stat) => ({ ...stat }));

        // Show the modal
        innerModal.value?.show();
    }

    function hide() : void
    {
        innerModal.value?.hide();
    }

    function onSave() : void
    {
        emit('save', stats.value);
        stats.value = [];
    }

    function onCancel() : void
    {
        stats.value = [];
    }

    function addStat() : void
    {
        stats.value.push({
            description: newDesc.value,
            value: newValue.value,
        });

        newDesc.value = '';
        newValue.value = 1;
    }

    function removeStat(stat : WFRPStat) : void
    {
        const idx = stats.value.findIndex((item) => item === stat);
        if(idx > -1)
        {
            stats.value.splice(idx, 1);
        }
    }

    //------------------------------------------------------------------------------------------------------------------

    defineExpose({ show, hide });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
