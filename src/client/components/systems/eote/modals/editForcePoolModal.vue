<!----------------------------------------------------------------------------------------------------------------------
  -- EditForcePoolModal
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="edit-forcePool-modal">
        <b-modal
            ref="innerModal"
            header-bg-variant="dark"
            header-text-variant="white"
            no-close-on-esc
            no-close-on-backdrop
            size="lg"
            @ok="onSave"
        >
            <!-- Modal Header -->
            <template #modal-title>
                <fa icon="file-edit"></fa>
                Edit Force
            </template>

            <!-- Modal Content -->
            <div class="text-muted mb-2">
                Characters who are not force sensitive, cannot have a Force rating. If the character is force
                sensitive, then they will often start at a rating of 1, but may purchase talents to increase their
                force rating. If a character has committed force die to a power, their rating does not change for
                the purposes of buying new powers, but their effective rating (the number of dice rolled) is reduced.
            </div>
            <hr />
            <div class="d-flex">
                <b-form-group
                    class="flex-fill ml-2"
                    label="Force Sensitive"
                    label-class="font-weight-bold"
                    label-for="species-input"
                >
                    <b-form-checkbox v-model="forcePool.sensitive" class="mt-3" name="force-sensitive" switch>
                        Force Sensitive
                    </b-form-checkbox>
                </b-form-group>
                <b-form-group
                    class="flex-fill ml-2"
                    label="Force Rating"
                    label-class="font-weight-bold"
                    label-for="rating-input"
                >
                    <div class="d-flex">
                        <BInputGroup>
                            <BFormInput
                                id="rating-input"
                                v-model="forcePool.rating"
                                number
                                type="number"
                                min="0"
                                max="10"
                                step="1"
                                :disabled="!forcePool.sensitive"
                            ></BFormInput>
                            <BInputGroupAppend>
                                <BButton :disabled="!forcePool.sensitive" @click="forcePool.rating = 0">
                                    <fa icon="times"></fa>
                                </BButton>
                            </BInputGroupAppend>
                        </BInputGroup>
                    </div>
                </b-form-group>
            </div>

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
    import { ref } from 'vue';

    // Components
    import { BModal } from 'bootstrap-vue-next';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface ForcePool
    {
        sensitive : boolean;
        committed : number;
        rating : number;
    }

    interface Events
    {
        (e : 'save', forcePool : ForcePool) : void;
    }

    const emit = defineEmits<Events>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const forcePool = ref({
        sensitive: false,
        committed: 0,
        rating: 0
    });

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const innerModal = ref<InstanceType<typeof BModal> | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function show(fp : ForcePool) : void
    {
        forcePool.value.sensitive = fp.sensitive;
        forcePool.value.committed = fp.committed;
        forcePool.value.rating = fp.rating;

        innerModal.value.show();
    }

    function hide() : void
    {
        innerModal.value.hide();
    }

    function onSave() : void
    {
        emit('save', forcePool.value);
    }

    function onCancel() : void
    {
        forcePool.value.sensitive = false;
        forcePool.value.committed = 0;
        forcePool.value.rating = 0;
    }

    //------------------------------------------------------------------------------------------------------------------

    defineExpose({ show, hide });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
