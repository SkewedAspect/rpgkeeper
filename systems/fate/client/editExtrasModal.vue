<!----------------------------------------------------------------------------------------------------------------------
  -- EditExtrasModal
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="edit-extras-modal" v-if="character">
        <b-modal ref="modal"
            header-bg-variant="dark"
            header-text-variant="white"
            size="lg"
            @ok="onSave"
            @shown="onShown">

            <!-- Modal Header -->
            <template slot="modal-title">
                <font-awesome-icon icon="file-edit"></font-awesome-icon>
                Edit Extras
            </template>

            <!-- Modal Content -->
            <b-form-group
                id="extras-input-group"
                label="Extras"
                label-for="extras-input">
                <b-card class="overflow-hidden" no-body>
                    <codemirror ref="editor" v-model="extras" :options="{ lineNumbers: true }"></codemirror>
                </b-card>
            </b-form-group>

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
    .edit-extras-modal {
        .CodeMirror {
            height: 300px;
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script>
    //------------------------------------------------------------------------------------------------------------------

    // Managers
    import charMan from '../../../client/api/managers/character';

    //------------------------------------------------------------------------------------------------------------------

    export default {
        name: 'EditExtrasModal',
        subscriptions: {
            character: charMan.selected$
        },
        methods: {
            async onSave()
            {
                this.character.details.extras = this.extras;

                // Save the character
                await charMan.save(this.character);

                // Clear the extras
                this.extras = '';
            },
            onShown()
            {
                this.extras = this.character.details.extras;
                this.cmRefresh();
            },
            cmRefresh()
            {
                this.$nextTick(() =>
                {
                    this.$refs.editor.codemirror.refresh();
                });
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
                extras: ''
            }
        }
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
