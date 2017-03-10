<!--------------------------------------------------------------------------------------------------------------------->
<!-- cliche.vue                                                                                                         -->
<!--------------------------------------------------------------------------------------------------------------------->

<template>
    <md-list-item id="cliche-item" class="md-button">
        <div class="md-list-text-container">
            <span><b>{{ cliche.description }}</b> ({{ cliche.value }})</span>
            <span>Tools/Abilities: {{ cliche.tools }}</span>
        </div>
        <md-button v-if="!disabled" class="md-icon-button md-list-action"
                   @click.native.prevent.stop="edit()">
            <md-icon>edit</md-icon>
        </md-button>
        <md-button v-if="!disabled" class="md-icon-button md-list-action md-warn"
                   @click.native.prevent.stop="confirmDelete()">
            <md-icon class="md-warn">delete</md-icon>
        </md-button>

        <!-- Dialogs -->

        <md-dialog-confirm
            :md-title="`Delete '${ cliche.description }' Cliche`"
            md-content="Are your sure you want to delete this cliche?"
            md-ok-text="Delete"
            md-cancel-text="Cancel"
            @close="onConfirmDeleteClosed"
            ref="deleteCliche">
        </md-dialog-confirm>

        <md-dialog ref="editCliche">
            <md-dialog-title>Edit '{{ cliche.description }}' Cliche</md-dialog-title>

            <md-dialog-content>
                <md-input-container>
                    <label>Description</label>
                    <md-input v-model="editCliche.description"></md-input>
                </md-input-container>
                <md-input-container>
                    <label>Value</label>
                    <md-input type="number" v-model="editCliche.value"></md-input>
                </md-input-container>
                <md-input-container>
                    <label>Textarea</label>
                    <md-textarea v-model="editCliche.tools"></md-textarea>
                </md-input-container>
            </md-dialog-content>

            <md-dialog-actions>
                <md-button class="md-primary" @click.native="cancelEdit()">Cancel</md-button>
                <md-button class="md-primary" @click.native="saveEdit()">Ok</md-button>
            </md-dialog-actions>
        </md-dialog>
    </md-list-item>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style rel="stylesheet/scss" lang="sass">
    #cliche-item {
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script>
    //------------------------------------------------------------------------------------------------------------------

    import _ from 'lodash';

    //------------------------------------------------------------------------------------------------------------------

    export default {
        props: {
            cliche: {
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
                editCliche: {
                    value: undefined,
                    description: undefined,
                    tools: undefined
                }
            };
        },
        methods: {
            edit()
            {
                _.merge(this.editCliche, this.cliche);
                this.$refs.editCliche.open();
            },
            clearEdit()
            {
                setTimeout(() =>
                {
                    this.editCliche.index = undefined;
                    this.editCliche.value = undefined;
                    this.editCliche.description = undefined;
                    this.editCliche.tools = undefined;
                }, 500);
            },
            cancelEdit()
            {
                this.clearEdit();
                this.$refs.editCliche.close();
            },
            saveEdit()
            {
                _.merge(this.cliche, this.editCliche);
                this.clearEdit();
                this.$refs.editCliche.close();
            },
            confirmDelete()
            {
                this.$refs.deleteCliche.open();
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