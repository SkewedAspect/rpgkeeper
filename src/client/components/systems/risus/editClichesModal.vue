<!----------------------------------------------------------------------------------------------------------------------
  -- editClichesModal
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="edit-cliches-modal">
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
                Edit Cliches
            </template>

            <!-- Modal Content -->
            <div v-for="(cliche, index) in cliches" :key="index" class="d-flex mb-2">
                <b-form-input v-model="cliche.value" number type="number" min="1" max="99" step="1" style="max-width: 60px; min-width: 60px;"></b-form-input>
                <b-form-input v-model="cliche.description" class="ml-2" placeholder="Description"></b-form-input>
                <b-form-input v-model="cliche.tools" class="ml-2" placeholder="Tools of the Trade"></b-form-input>
                <b-btn variant="danger" class="ml-2" @click="removeCliche(cliche)">
                    <fa icon="trash-alt"></fa>
                </b-btn>
            </div>

            <hr />

            <b-card
                header="New Cliche"
                header-bg-variant="dark"
                header-text-variant="white"
            >
                <div class="d-flex">
                    <b-form-input v-model="newValue" number type="number" min="1" max="99" step="1" style="max-width: 60px; min-width: 60px;"></b-form-input>
                    <b-form-input id="new-desc" v-model="newDesc" class="ml-2" placeholder="Description"></b-form-input>
                    <b-form-input id="new-tools" v-model="newTools" class="ml-2" placeholder="Tools of the Trade"></b-form-input>
                    <b-btn variant="primary" class="ml-2 text-nowrap" :disabled="!isAddValid" @click="addCliche">
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
    .edit-cliches-modal {
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    //------------------------------------------------------------------------------------------------------------------

    import { computed, ref } from 'vue';

    // Interfaces
    import { RisusCliche } from '../../../../common/interfaces/systems/risus';

    // Components
    import { BModal } from 'bootstrap-vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Events
    {
        (e : 'save', hooks : RisusCliche[]) : void;
    }

    const emit = defineEmits<Events>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const cliches = ref<RisusCliche[]>([]);
    const newValue = ref<number>(1);
    const newDesc = ref<string>('');
    const newTools = ref<string>('');

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

    function show(charHooks : RisusCliche[]) : void
    {
        // Clone the array of cliches
        cliches.value = charHooks.map((cliche) => ({ ...cliche }));

        // Show the modal
        innerModal.value.show();
    }

    function hide() : void
    {
        innerModal.value.hide();
    }

    function onSave() : void
    {
        emit('save', cliches.value);
        cliches.value = [];
    }

    function onCancel() : void
    {
        cliches.value = [];
    }

    function addCliche() : void
    {
        cliches.value.push({
            description: newDesc.value,
            tools: newTools.value,
            value: newValue.value,
            current: newValue.value
        });

        newDesc.value = '';
        newTools.value = '';
        newValue.value = 1;
    }

    function removeCliche(cliche : RisusCliche) : void
    {
        const idx = cliches.value.findIndex((item) => item === cliche);
        if(idx > -1)
        {
            cliches.value.splice(idx, 1);
        }
    }

    //------------------------------------------------------------------------------------------------------------------

    defineExpose({ show, hide });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
