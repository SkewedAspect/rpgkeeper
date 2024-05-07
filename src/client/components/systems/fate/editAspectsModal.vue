<!----------------------------------------------------------------------------------------------------------------------
  -- editAspectsModal
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div v-if="aspects" class="edit-aspects-modal">
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
                    <fa icon="file-edit"></fa>
                    Edit Aspects
                    <CloseButton class="float-end" @click="cancel"></CloseButton>
                </h5>
            </template>

            <!-- Modal Content -->
            <BFormRow>
                <BCol cols="12" lg="6">
                    <BFormGroup
                        id="hc-input-group"
                        label="High Concept"
                        label-class="fw-bold"
                        label-for="hc-input"
                    >
                        <BFormInput id="hc-input" v-model="highConcept.detail"></BFormInput>
                    </BFormGroup>
                </BCol>
                <BCol cols="12" lg="6">
                    <BFormGroup
                        id="tBInputGroup"
                        label="Trouble"
                        label-class="fw-bold"
                        label-for="tb-input"
                    >
                        <BFormInput id="tb-input" v-model="trouble.detail"></BFormInput>
                    </BFormGroup>
                </BCol>
            </BFormRow>

            <hr class="mt-2" />

            <h4>Extra Aspects</h4>

            <div v-for="(aspect, index) in extraAspects" :key="index" class="d-flex mb-2">
                <BFormInput v-model="aspect.detail"></BFormInput>
                <BButton variant="danger" class="ms-2" @click="removeAspect(aspect)">
                    <fa icon="trash-alt"></fa>
                </BButton>
            </div>

            <hr />

            <BCard
                header="New Aspect"
                header-bg-variant="dark"
                header-text-variant="white"
            >
                <div class="d-flex">
                    <BFormInput id="new-input" v-model="newAspect"></BFormInput>
                    <BButton variant="primary" class="ms-2 text-nowrap" :disabled="!isAddValid" @click="addAspect">
                        <fa icon="plus"></fa>
                        Add
                    </BButton>
                </div>
            </BCard>

            <!-- Modal Buttons -->
            <template #ok="{ ok }">
                <BButton variant="primary" @click="ok">
                    <fa icon="save"></fa>
                    Save
                </BButton>
            </template>
            <template #cancel="{ cancel }">
                <BButton variant="secondary" @click="cancel">
                    <fa icon="times"></fa>
                    Cancel
                </BButton>
            </template>
        </BModal>
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, ref } from 'vue';

    // Interfaces
    import { FateAspect } from '../../../../common/interfaces/systems/fate';

    // Components
    import { BModal } from 'bootstrap-vue-next';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Events
    {
        (e : 'save', aspects : FateAspect[]) : void;
    }

    const emit = defineEmits<Events>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const aspects = ref<FateAspect[]>([]);
    const newAspect = ref<string>('');

    const innerModal = ref<InstanceType<typeof BModal> | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const isAddValid = computed(() =>
    {
        return !!newAspect.value;
    });

    const highConcept = computed<FateAspect>(() =>
    {
        return aspects.value.find((item) => item.type === 'high concept') ?? { type: 'high concept', detail: '' };
    });

    const trouble = computed<FateAspect>(() =>
    {
        return aspects.value.find((item) => item.type === 'trouble') ?? { type: 'trouble', detail: '' };
    });

    const extraAspects = computed<FateAspect[]>(() =>
    {
        return aspects.value.filter((item) => item.type === 'aspect');
    });

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function show(charAspects : FateAspect[]) : void
    {
        // Clone the array of aspects
        aspects.value = charAspects.map((aspect) => ({ ...aspect }));

        // Show the modal
        innerModal.value.show();
    }

    function hide() : void
    {
        innerModal.value.hide();
    }

    function onSave() : void
    {
        emit('save', aspects.value);
        aspects.value = [];
    }

    function onCancel() : void
    {
        aspects.value = [];
    }

    function addAspect() : void
    {
        aspects.value.push({ type: 'aspect', detail: newAspect.value });
        newAspect.value = '';
    }

    function removeAspect(aspect : FateAspect) : void
    {
        const idx = aspects.value.findIndex((item) => item === aspect);
        if(idx > -1)
        {
            aspects.value.splice(idx, 1);
        }
    }

    //------------------------------------------------------------------------------------------------------------------

    defineExpose({ show, hide });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
