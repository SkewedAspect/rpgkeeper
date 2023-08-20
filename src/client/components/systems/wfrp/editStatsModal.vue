<!----------------------------------------------------------------------------------------------------------------------
  -- editStatsModal
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="edit-stats-modal">
        <b-modal
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
            <template #modal-title>
                <fa icon="file-edit"></fa>
                Edit Stats
            </template>

            <!-- Modal Content -->
            <div v-for="(stat, index) in stats" :key="index" class="d-flex mb-2">
                <b-form-input v-model="stat.value" number type="number" min="1" max="99" step="1" style="max-width: 60px; min-width: 60px;"></b-form-input>
                <b-form-input v-model="stat.description" class="ml-2" placeholder="Description"></b-form-input>
                <b-btn variant="danger" class="ml-2" @click="removeStat(stat)">
                    <fa icon="trash-alt"></fa>
                </b-btn>
            </div>

            <hr />

            <b-card
                header="New Stat"
                header-bg-variant="dark"
                header-text-variant="white"
            >
                <div class="d-flex">
                    <b-form-input v-model="newValue" number type="number" min="1" max="99" step="1" style="max-width: 60px; min-width: 60px;"></b-form-input>
                    <b-form-input id="new-desc" v-model="newDesc" class="ml-2" placeholder="Description"></b-form-input>
                    <b-btn variant="primary" class="ml-2 text-nowrap" :disabled="!isAddValid" @click="addStat">
                        <fa icon="plus"></fa>
                        Add
                    </b-btn>
                </div>
            </b-card>

            <!-- Modal Buttons -->
            <template #modal-ok>
                <fa icon="save"></fa>
                Save
            </template>
            <template #modal-cancel>
                <fa icon="times"></fa>
                Cancel
            </template>
        </b-modal>
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
    import { WFRPStat } from '../../../../common/interfaces/systems/wfrp';

    // Components
    import { BModal } from 'bootstrap-vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Events
    {
        (e : 'save', hooks : Record<string, unknown>[]) : void;
    }

    const emit = defineEmits<Events>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const stats = ref<Record<string, unknown>[]>([]);
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
        innerModal.value.show();
    }

    function hide() : void
    {
        innerModal.value.hide();
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
            value: newValue.value
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
