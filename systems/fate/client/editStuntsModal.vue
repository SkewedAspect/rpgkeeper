<!----------------------------------------------------------------------------------------------------------------------
  -- EditStuntsModal
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="edit-stunts-modal" v-if="character">
        <b-modal ref="modal"
            header-bg-variant="dark"
            header-text-variant="white"
            size="lg"
            @ok="onSave"
            @shown="onShown">

            <!-- Modal Header -->
            <template slot="modal-title">
                <font-awesome-icon icon="file-edit"></font-awesome-icon>
                Edit Stunts
            </template>

            <!-- Modal Content -->
            <div class="d-flex mb-2" v-for="(stunt, index) in stunts">
                <b-form-input class="title-input" v-model="stunt.title" placeholder="Stunt title"></b-form-input>
                <b-form-input class="ml-2" v-model="stunt.description" placeholder="Stunt description"></b-form-input>
                <b-btn variant="danger" class="ml-2 text-nowrap" @click="removeStunt(stunt)">
                    <font-awesome-icon icon="trash-alt"></font-awesome-icon>
                </b-btn>
            </div>
            <div class="text-center" v-if="stunts.length === 0">
                <h6>No Stunts.</h6>
            </div>

            <hr>

            <b-card header="New Stunt"
                header-bg-variant="dark"
                header-text-variant="white">
                <div class="d-flex">
                    <b-form-input class="title-input" v-model="newStuntTitle" placeholder="Stunt title"></b-form-input>
                    <b-form-input class="ml-2" v-model="newStuntDesc" placeholder="Stunt description"></b-form-input>
                    <b-btn variant="primary" class="ml-2 text-nowrap" @click="addStunt">
                        <font-awesome-icon icon="plus"></font-awesome-icon>
                        Add
                    </b-btn>
                </div>
            </b-card>

            <!-- Modal Buttons -->
            <template slot="modal-ok">
                <font-awesome-icon icon="save"></font-awesome-icon>
                Save
            </template>
            <template slot="modal-cancel">
                <font-awesome-icon icon="times"></font-awesome-icon>
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

<script>
    //------------------------------------------------------------------------------------------------------------------

    import _ from 'lodash';

    // Managers
    import charMan from '../../../client/api/managers/character';

    //------------------------------------------------------------------------------------------------------------------

    export default {
        name: 'EditStuntsModal',
        subscriptions: {
            character: charMan.selected$
        },
        methods: {
            async onSave()
            {
                this.character.details.stunts = this.stunts;

                // Save the character
                await charMan.save(this.character);

                // Clear the stunts
                this.stunts = [];
            },
            onShown()
            {
                this.stunts = _.cloneDeep(this.character.details.stunts);
            },

            addStunt()
            {
                this.stunts.push({ title: this.newStuntTitle, description: this.newStuntDesc });
                this.newStuntTitle = '';
                this.newStuntDesc = '';
            },
            removeStunt(stunt)
            {
                // We can't use lodash, since Vue doesn't track whatever magic `_.pull` does.
                // See: https://vuejs.org/v2/guide/list.html#Array-Change-Detection
                const idx = _.findIndex(this.stunts, stunt);
                if(idx > -1)
                {
                    this.stunts.splice(idx, 1);
                } // end if
            },

            show()
            {
                this.$refs.modal.show();
            },
            hide()
            {
                this.$refs.modal.hide();
            }
        },
        data()
        {
            return {
                stunts: [],
                newStuntTitle: '',
                newStuntDesc: ''
            }
        }
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
