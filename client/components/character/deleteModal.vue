<!----------------------------------------------------------------------------------------------------------------------
  -- deleteModal.vue
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="delete-char-modal" v-if="char">
        <b-modal v-model="showModal"
            header-bg-variant="dark"
            header-text-variant="white"
            size="md"
            ok-variant="danger"
            @ok="onDelete"
            @hidden="onHidden">

            <!-- Modal Header -->
            <template slot="modal-title">
                <font-awesome-icon icon="trash-alt"></font-awesome-icon>
                Delete Character
            </template>

            <h3>
                <font-awesome-icon icon="exclamation-triangle"></font-awesome-icon>
                Are you sure you want to delete "{{ char.name }}"?
            </h3>
            <p class="text-muted">
                You will permanently lose this character. This cannot be undone.
            </p>

            <!-- Modal Buttons -->
            <template slot="modal-ok">
                <font-awesome-icon icon="trash-alt"></font-awesome-icon>
                Delete
            </template>
            <template slot="modal-cancel">
                <font-awesome-icon icon="times"></font-awesome-icon>
                Cancel
            </template>
        </b-modal>
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss" scoped>
    .delete-char-modal {
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script>
    //------------------------------------------------------------------------------------------------------------------

    // Managers
    import charMan from '../../api/managers/character';

    //------------------------------------------------------------------------------------------------------------------

    export default {
        name: 'DeleteCharModal',
        props: {
            value: {
                type: Object
            }
        },
        computed: {
            showModal: {
                get(){ return !!this.value; },
                set(){ /* We ignore setting */ }
            },
            char(){ return this.value; }
        },
        methods: {
            onHidden()
            {
                this.$emit('hidden');
            },
            async onDelete()
            {
                await charMan.delete(this.char);
            },
            async pickImageDropBox(prop)
            {
                this.char[prop] = await dropboxUtil.chooseDropboxImage();
            }
        },
        data()
        {
            return {
                // Data goes here
            };
        }
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
