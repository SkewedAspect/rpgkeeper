<template>
    <modal v-ref:modal :backdrop="'static'" :keyboard="false" :width="'900px'">
        <div class="modal-header" slot="header">
            <h4 class="modal-title">
                <i class="fa fa-trash-o"></i>
                Delete {{ title }}
            </h4>
        </div>
        <div class="modal-body text-center" slot="body">
            <h3><i class="fa fa-exclamation-triangle"></i> Are you sure you want to delete {{ text }}?</h3>
            <p class="text-danger"><b>This cannot be undone!</b></p>
        </div>
        <div class="modal-footer" slot="footer">
            <button type="button"
                    class="btn btn-danger"
                    @click="deleteItem()">
                <i class="fa fa-trash-o"></i>
                Delete {{ title }}
            </button>
            <button type="button"
                    class="btn btn-secondary"
                    @click="$refs.modal.hideModal()">
                <i class="fa fa-times"></i>
                Cancel
            </button>
        </div>
    </modal>
</template>

<script type="text/babel">
    import _ from 'lodash';
    import { modal } from 'vueboot';

    export default {
        components: {
            modal
        },
        props: {
            title: {
                type: String,
                required: true
            },
            text: {
                type: String,
                required: true
            },
            onDelete: {
                type: Function,
                required: true,
                default: ()=>{}
            }
        },
        methods: {
            show: function()
            {
                this.$refs.modal.showModal();
            },
            showModal: function()
            {
                // This is compatibility for the modal api.
                this.show();
            },
            hide: function()
            {
                this.$refs.modal.hideModal();
            },
            hideModal: function()
            {
                // This is compatibility for the modal api.
                this.hide();
            },
            deleteItem: function()
            {
                this.$refs.modal.hideModal();
                this.onDelete();
            }
        }
    }
</script>