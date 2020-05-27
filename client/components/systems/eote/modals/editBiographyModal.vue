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
            <b-form-row>
                <b-col>
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
                </b-col>
                <b-col v-if="mode === 'eote'" cols="auto">
                    <b-form-group
                        label="Force Sensitive"
                        label-class="font-weight-bold"
                        label-for="species-input"
                        label-sr-only
                    >
                        <b-form-checkbox v-model="forceSensitive" style="margin-top: 2.4rem" name="force-sensitive" switch>
                            Force Sensitive
                        </b-form-checkbox>
                    </b-form-group>
                </b-col>
            </b-form-row>

            <b-form-row>
                <b-col xs="12">
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
                </b-col>
                <b-col v-if="mode === 'eote'" xs="12">
                    <b-form-group
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
                </b-col>
            </b-form-row>

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
    import charMan from '../../../../api/managers/character';
    import eoteMan from '../../../../api/managers/eote';

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
                specialization: '',
                forceSensitive: false
            };
        },
        methods: {
            async onSave()
            {
                // Ensure character has the right structure
                if(!this.character.details.force)
                {
                    this.character.details.force = { rating: 0, committed: 0, powers: [] };
                } // end if

                this.character.details.career = this.career;
                this.character.details.species = this.species;
                this.character.details.specialization = this.specialization;
                this.character.details.force.sensitive = this.forceSensitive;

                // Save the character
                await charMan.save(this.character);
            },
            onShown()
            {
                // Ensure character has the right structure
                if(!this.character.details.force)
                {
                    this.character.details.force = { rating: 0, committed: 0, powers: [] };
                } // end if

                // Reset the edit fields
                this.career = this.character.details.career;
                this.species = this.character.details.species;
                this.specialization = this.character.details.specialization;
                this.forceSensitive = !!this.character.details.force.sensitive;
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
