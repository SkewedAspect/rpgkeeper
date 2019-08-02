<!----------------------------------------------------------------------------------------------------------------------
  -- Delete Character Modal
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
                <fa icon="trash-alt"></fa>
                Delete Character
            </template>

            <h3>
                <fa icon="exclamation-triangle"></fa>
                Are you sure you want to delete "{{ char.name }}"?
            </h3>
            <p class="text-muted">
                You will permanently lose this character. This cannot be undone.
            </p>

            <!-- Modal Buttons -->
            <template slot="modal-ok">
                <fa icon="trash-alt"></fa>
                Delete
            </template>
            <template slot="modal-cancel">
                <fa icon="times"></fa>
                Cancel
            </template>
        </b-modal>
    </div>
</template>

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
            }
        }
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
