<!--------------------------------------------------------------------------------------------------------------------->
<!-- Hook Item                                                                                                       -->
<!--------------------------------------------------------------------------------------------------------------------->

<template>
    <md-list-item id="hook-item">
        <div class="md-list-text-container">
            <span><b>{{ hook.description }}</b></span>
        </div>

        <md-button v-if="!disabled" class="md-icon-button md-list-action"
                   @click.prevent.stop="edit()">
            <md-icon>edit</md-icon>
        </md-button>
        <md-button v-if="!disabled" class="md-icon-button md-list-action md-warn"
                   @click.prevent.stop="confirmDelete()">
            <md-icon class="md-warn">delete</md-icon>
        </md-button>

        <!-- Dialogs -->

        <md-dialog-confirm
            :md-title="`Delete Hook`"
            :md-content="`Are your sure you want to delete this hook: '${ hook.description }'?`"
            md-ok-text="Delete"
            md-cancel-text="Cancel"
            @close="onConfirmDeleteClosed"
            ref="deleteHook">
        </md-dialog-confirm>

        <md-dialog ref="editHook">
            <md-dialog-title>Edit Hook</md-dialog-title>

            <md-dialog-content>
                <md-input-container>
                    <label>Description</label>
                    <md-input v-model="editHook.description"></md-input>
                </md-input-container>
            </md-dialog-content>

            <md-dialog-actions>
                <md-button class="md-primary" @click="cancelEdit()">Cancel</md-button>
                <md-button class="md-primary" @click="saveEdit()">Ok</md-button>
            </md-dialog-actions>
        </md-dialog>
    </md-list-item>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style rel="stylesheet/scss" lang="sass">
    #hook-item {
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script>
    //------------------------------------------------------------------------------------------------------------------

    import _ from 'lodash';

    //------------------------------------------------------------------------------------------------------------------

    export default {
        props: {
            hook: {
                type: Object,
                required: true
            },
            disabled: {
                type: Boolean,
                default: false
            }
        },
        data()
        {
            return {
                editHook: {
                    description: undefined
                }
            };
        },
        methods: {
            edit()
            {
                _.merge(this.editHook, this.hook);
                this.$refs.editHook.open();
            },
            clearEdit()
            {
                setTimeout(() =>
                {
                    this.editHook.description = undefined;
                }, 500);
            },
            cancelEdit()
            {
                this.clearEdit();
                this.$refs.editHook.close();
            },
            saveEdit()
            {
                _.merge(this.hook, this.editHook);
                this.clearEdit();
                this.$refs.editHook.close();
            },
            confirmDelete()
            {
                this.$refs.deleteHook.open();
            },
            onConfirmDeleteClosed(result)
            {
                if(result == 'ok')
                {
                    this.$emit('deleted');
                } // end if
            }
        }
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->