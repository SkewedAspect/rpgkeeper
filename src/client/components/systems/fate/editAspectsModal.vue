<!----------------------------------------------------------------------------------------------------------------------
  -- editAspectsModal
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div v-if="aspects" class="edit-aspects-modal">
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
                Edit Aspects
            </template>

            <!-- Modal Content -->
            <b-form-row>
                <b-col cols="12" lg="6">
                    <b-form-group
                        id="hc-input-group"
                        label="High Concept"
                        label-class="font-weight-bold"
                        label-for="hc-input"
                    >
                        <b-form-input id="hc-input" v-model="highConcept.detail"></b-form-input>
                    </b-form-group>
                </b-col>
                <b-col cols="12" lg="6">
                    <b-form-group
                        id="tb-input-group"
                        label="Trouble"
                        label-class="font-weight-bold"
                        label-for="tb-input"
                    >
                        <b-form-input id="tb-input" v-model="trouble.detail"></b-form-input>
                    </b-form-group>
                </b-col>
            </b-form-row>

            <hr class="mt-2" />

            <h4>Extra Aspects</h4>

            <div v-for="(aspect, index) in extraAspects" :key="index" class="d-flex mb-2">
                <b-form-input v-model="aspect.detail"></b-form-input>
                <b-btn variant="danger" class="ml-2" @click="removeAspect(aspect)">
                    <fa icon="trash-alt"></fa>
                </b-btn>
            </div>

            <hr />

            <b-card
                header="New Aspect"
                header-bg-variant="dark"
                header-text-variant="white"
            >
                <div class="d-flex">
                    <b-form-input id="new-input" v-model="newAspect"></b-form-input>
                    <b-btn variant="primary" class="ml-2 text-nowrap" :disabled="!isAddValid" @click="addAspect">
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

<script lang="ts" setup>
    import { computed, ref } from 'vue';

    // Interfaces
    import { FateAspect } from '../../../../common/interfaces/systems/fate';

    // Components
    import { BModal } from 'bootstrap-vue';

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
