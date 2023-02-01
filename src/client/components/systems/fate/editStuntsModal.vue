<!----------------------------------------------------------------------------------------------------------------------
  -- EditStuntsModal
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="edit-stunts-modal">
        <b-modal
            ref="innerModal"
            header-bg-variant="dark"
            header-text-variant="white"
            no-close-on-esc
            no-close-on-backdrop
            size="lg"
            @ok="onSave"
            @cancel="onCancel"
        >
            <!-- Modal Header -->
            <template #modal-title>
                <fa icon="file-edit"></fa>
                Edit Stunts
            </template>

            <!-- Modal Content -->
            <div v-for="(stunt, index) in stunts" :key="index" class="d-flex mb-2">
                <b-form-input v-model="stunt.title" class="title-input" placeholder="Stunt title"></b-form-input>
                <b-form-input v-model="stunt.description" class="ml-2" placeholder="Stunt description"></b-form-input>
                <b-btn variant="danger" class="ml-2 text-nowrap" @click="removeStunt(stunt)">
                    <fa icon="trash-alt"></fa>
                </b-btn>
            </div>
            <div v-if="stunts.length === 0" class="text-center">
                <h6>No Stunts.</h6>
            </div>

            <hr />

            <b-card
                header="New Stunt"
                header-bg-variant="dark"
                header-text-variant="white"
            >
                <div class="d-flex">
                    <b-form-input v-model="newStuntTitle" class="title-input" placeholder="Stunt title"></b-form-input>
                    <b-form-input v-model="newStuntDesc" class="ml-2" placeholder="Stunt description"></b-form-input>
                    <b-btn variant="primary" class="ml-2 text-nowrap" :disabled="!isAddValid" @click="addStunt">
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
    .edit-stunts-modal {
        .title-input {
            max-width: 225px;
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, ref } from 'vue';

    // Interfaces
    import { FateStunt } from '../../../../common/interfaces/systems/fate';

    // Components
    import { BModal } from 'bootstrap-vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Events
    {
        (e : 'save', stunts : FateStunt[]) : void;
    }

    const emit = defineEmits<Events>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const stunts = ref<FateStunt[]>([]);
    const newStuntTitle = ref<string>('');
    const newStuntDesc = ref<string>('');

    const innerModal = ref<InstanceType<typeof BModal> | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const isAddValid = computed(() =>
    {
        return !!newStuntTitle.value && !!newStuntDesc.value;
    });

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function show(charStunts : FateStunt[]) : void
    {
        // Clone the array of aspects
        stunts.value = charStunts.map((stunt) => ({ ...stunt }));

        // Show the modal
        innerModal.value.show();
    }

    function hide() : void
    {
        innerModal.value.hide();
    }

    function onSave() : void
    {
        emit('save', stunts.value);
        stunts.value = [];
    }

    function onCancel() : void
    {
        stunts.value = [];
    }

    function addStunt() : void
    {
        stunts.value.push({ title: newStuntTitle.value, description: newStuntDesc.value });
        newStuntTitle.value = '';
        newStuntDesc.value = '';
    }

    function removeStunt(stunt : FateStunt) : void
    {
        const idx = stunts.value.findIndex((item) => item === stunt);
        if(idx > -1)
        {
            stunts.value.splice(idx, 1);
        }
    }

    //------------------------------------------------------------------------------------------------------------------

    defineExpose({ show, hide });
    //
    // //------------------------------------------------------------------------------------------------------------------
    //
    // export default defineComponent({
    //     name: 'EditStuntsModal',
    //     subscriptions()
    //     {
    //         return {
    //             character: charMan.selected$
    //         };
    //     },
    //     data()
    //     {
    //         return {
    //             stunts: [],
    //             newStuntTitle: '',
    //             newStuntDesc: ''
    //         };
    //     },
    //     methods: {
    //         async onSave()
    //         {
    //             this.character.details.stunts = this.stunts;
    //
    //             // Save the character
    //             await charMan.save(this.character);
    //
    //             // Clear the stunts
    //             this.stunts = [];
    //         },
    //         onShown()
    //         {
    //             this.stunts = _.cloneDeep(this.character.details.stunts);
    //         },
    //
    //         addStunt()
    //         {
    //             this.stunts.push({ title: this.newStuntTitle, description: this.newStuntDesc });
    //             this.newStuntTitle = '';
    //             this.newStuntDesc = '';
    //         },
    //         removeStunt(stunt)
    //         {
    //             // We can't use lodash, since Vue doesn't track whatever magic `_.pull` does.
    //             // See: https://vuejs.org/v2/guide/list.html#Array-Change-Detection
    //             const idx = _.findIndex(this.stunts, stunt);
    //             if(idx > -1)
    //             {
    //                 this.stunts.splice(idx, 1);
    //             }
    //         },
    //
    //         show()
    //         {
    //             this.$refs.modal.show();
    //         },
    //         hide()
    //         {
    //             this.$refs.modal.hide();
    //         }
    //     }
    //
    // });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
