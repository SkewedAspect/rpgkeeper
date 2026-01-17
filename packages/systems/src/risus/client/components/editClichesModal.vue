<!----------------------------------------------------------------------------------------------------------------------
  -- editClichesModal
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="edit-cliches-modal">
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
                    Edit Cliches
                    <CloseButton class="float-end" @click="cancel" />
                </h5>
            </template>

            <!-- Modal Content -->
            <div v-for="(cliche, index) in cliches" :key="index" class="d-flex mb-2">
                <BFormInput
                    v-model.number="cliche.value"
                    type="number"
                    min="1"
                    max="99"
                    step="1"
                    style="max-width: 60px; min-width: 60px;"
                />
                <BFormInput v-model="cliche.description" class="ms-2" placeholder="Description" />
                <BFormInput v-model="cliche.tools" class="ms-2" placeholder="Tools of the Trade" />
                <BButton variant="danger" class="ms-2" @click="removeCliche(cliche)">
                    <Fa icon="trash-alt" />
                </BButton>
            </div>

            <hr>

            <BCard
                header="New Cliche"
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
                    <BFormInput id="new-tools" v-model="newTools" class="ms-2" placeholder="Tools of the Trade" />
                    <BButton variant="primary" class="ms-2 text-nowrap" :disabled="!isAddValid" @click="addCliche">
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
    .edit-cliches-modal {
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, ref } from 'vue';

    // Interfaces
    import type { RisusCliche } from '../../models.ts';

    // Components
    import { BModal } from 'bootstrap-vue-next';
    import CloseButton from '@client/components/ui/closeButton.vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    type Events = (e : 'save', hooks : RisusCliche[]) => void;

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
            current: newValue.value,
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
