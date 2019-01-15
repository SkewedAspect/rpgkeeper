<!----------------------------------------------------------------------------------------------------------------------
  -- Delete Page Modal
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="delete-page-modal" v-if="page">
        <b-modal v-model="showModal"
            header-bg-variant="dark"
            header-text-variant="white"
            size="md"
            ok-variant="danger"
            @ok="onDelete"
            @hidden="onHidden">

            <!-- Modal Header -->
            <template slot="modal-title">
                <font-awesome-icon icon="file-minus"></font-awesome-icon>
                Delete Page
            </template>

            <!-- Modal Content -->
            <h3>
                <font-awesome-icon icon="exclamation-triangle"></font-awesome-icon>
                Are you sure you want to delete "{{ page.title }}"?
            </h3>
            <p class="text-muted">
                This page will be removed permanently. This cannot be undone.
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

<script>
    //------------------------------------------------------------------------------------------------------------------

    // Managers
    import notesMan from '../../api/managers/notes';

    //------------------------------------------------------------------------------------------------------------------

    export default {
        name: 'DeletePageModal',
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
            page(){ return this.value; }
        },
        methods: {
            onHidden()
            {
                this.$emit('hidden');
            },
            async onDelete()
            {
                await notesMan.deletePage(notesMan.selected, this.page);
            }
        }
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
