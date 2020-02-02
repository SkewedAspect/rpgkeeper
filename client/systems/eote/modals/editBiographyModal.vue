<!----------------------------------------------------------------------------------------------------------------------
  -- EditBiographyModal
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div v-if="character" class="edit-biography-modal">
        <b-modal
            ref="modal"
            header-bg-variant="dark"
            header-text-variant="white"
            no-close-on-esc
            no-close-on-backdrop
            size="lg"
            @ok="onSave"
            @shown="onShown"
        >
            <!-- Modal Header -->
            <template slot="modal-title">
                <fa icon="file-edit"></fa>
                Edit Biography
            </template>

            <!-- Modal Content -->
            <b-form-group
                label="Species"
                label-class="font-weight-bold"
                label-for="species-input"
            >
                <div class="d-flex">
                    <b-input-group>
                        <b-form-input id="species-input" v-model="species"></b-form-input>
                        <b-input-group-append>
                            <b-button @click="species = ''">
                                <fa icon="times"></fa>
                            </b-button>
                        </b-input-group-append>
                    </b-input-group>
                </div>
            </b-form-group>

            <b-form-group
                label="Career"
                label-class="font-weight-bold"
                label-for="career-input"
            >
                <div class="d-flex">
                    <b-input-group>
                        <b-form-input id="career-input" v-model="career"></b-form-input>
                        <b-input-group-append>
                            <b-button @click="career = ''">
                                <fa icon="times"></fa>
                            </b-button>
                        </b-input-group-append>
                    </b-input-group>
                </div>
            </b-form-group>

            <b-form-group
                v-if="mode === 'eote'"
                label="Specializations"
                label-class="font-weight-bold"
                label-for="special-input"
            >
                <div class="d-flex">
                    <b-input-group>
                        <b-form-input id="special-input" v-model="specialization"></b-form-input>
                        <b-input-group-append>
                            <b-button @click="specialization = ''">
                                <fa icon="times"></fa>
                            </b-button>
                        </b-input-group-append>
                    </b-input-group>
                </div>
            </b-form-group>

            <!-- Modal Buttons -->
            <template slot="modal-ok">
                <fa icon="save"></fa>
                Save
            </template>
            <template slot="modal-cancel">
                <fa icon="times"></fa>
                Cancel
            </template>
        </b-modal>
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss">
    .edit-biography-modal {
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script>
    //------------------------------------------------------------------------------------------------------------------

    // Managers
    import charMan from '../../../api/managers/character';
    import eoteMan from '../../../api/managers/eote';

    //------------------------------------------------------------------------------------------------------------------

    export default {
        name: 'EditBiographyModal',
        subscriptions: {
            character: charMan.selected$,
            mode: eoteMan.mode$
        },
        data()
        {
            return {
                career: '',
                species: '',
                specialization: ''
            };
        },
        methods: {
            async onSave()
            {
                this.character.details.career = this.career;
                this.character.details.species = this.species;
                this.character.details.specialization = this.specialization;

                // Save the character
                await charMan.save(this.character);
            },
            onShown()
            {
                // Reset the edit fields
                this.career = this.character.details.career;
                this.species = this.character.details.species;
                this.specialization = this.character.details.specialization;
            },

            show()
            {
                this.$refs.modal.show();
            },
            hide()
            {
                this.$refs.modal.hide();
            }
        }
    };
</script>

<!--------------------------------------------------------------------------------------------------------------------->
