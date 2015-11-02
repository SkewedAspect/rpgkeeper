<template>
    <div class="input-group roll-component">
        <span class="input-group-addon" data-trigger="hover" data-container="body" data-toggle="popover" data-placement="top" data-content="{{ renderedText }}">
            <button v-if="currentValue || currentValue === 0" type="button" class="close" @click.prevent.stop="clear()">
                <span aria-hidden="true">
                    &times;
                </span>
                <span class="sr-only">Clear</span>
            </button>
            {{ currentValue }}
        </span>
        <span class="input-group-btn">
                <button class="btn btn-secondary" type="button" title="Click to roll" @click="executeRoll()" style="width: calc(100% - 50px)">
                    {{ roll.name }}
                </button>
                <button class="btn btn-secondary" type="button" title="Click to edit" @click="editRoll()">
                    <i class="fa fa-edit"></i>
                </button>
        </span>
    </div>

    <!-- Edit Modal -->
    <modal v-ref:edit-modal :backdrop="'static'" :keyboard="false">
        <div class="modal-header" slot="header">
            <h4 class="modal-title">
                <i class="fa fa-edit"></i>
                Edit "{{ roll.name }}" Roll
            </h4>
        </div>
        <div class="modal-body" slot="body">
            <form>
                <fieldset class="form-group">
                    <label for="name">Name</label>
                    <input id="name" type="text" class="form-control" v-model="rollClone.name">
                </fieldset>
                <fieldset class="form-group">
                    <label for="expr">Expression</label>
                    <input id="expr" type="text" class="form-control" v-model="rollClone.expression">
                </fieldset>
            </form>
        </div>
        <div class="modal-footer" slot="footer">
            <button type="button"
                    class="btn btn-success"
                    @click="saveEdits()">
                <i class="fa fa-save"></i>
                Save Counter
            </button>
            <button type="button"
                    class="btn btn-secondary"
                    @click="$refs.editModal.hideModal()">
                <i class="fa fa-times"></i>
                Cancel
            </button>
        </div>
    </modal>
</template>

<style lang="sass">
    .roll-component {
        margin-bottom: 10px;

        .input-group-addon {
            position: relative;
            min-width: 65px;
            text-align: right;
            padding-left: 0;
            padding-right: 25px;
            cursor: pointer;

            button.close {
                float: none;
                position: absolute;
                top: 4px;
                right: 8px;
            }
        }

        .input-group-btn {
            width: 100%;
        }
    }
</style>

<script type="text/babel">
    import _ from 'lodash';
    import diceSvc from '../../../components/dice/diceService';

    import { modal } from 'vueboot';

    export default {
        components: {
            modal: modal
        },
        props: {
            roll: {
                type: Object,
                required: true
            },
            save: {
                type: Function,
                required: true
            }
        },
        data: function()
        {
            return {
                rollClone: null,
                currentResults: null
            };
        },
        computed: {
            renderedText: function()
            {
                if(this.currentResults)
                {
                    return this.currentResults.render();
                } // end if

                return "";
            },
            currentValue: function()
            {
                return (this.currentResults || {}).value;
            }
        },
        methods: {
            editRoll: function()
            {
                this.rollClone = _.clone(this.roll);
                this.$refs.editModal.showModal();
            },
            executeRoll: function()
            {
                this.currentResults = diceSvc.roll(this.roll.expression, {});
            },
            clear: function()
            {
                this.currentResults = null;
            },
            saveEdits: function()
            {
                _.assign(this.roll, this.rollClone);
                this.$refs.editModal.hideModal();

                this.save();
            }
        },
        ready: function()
        {
            $(function () {
                $('[data-toggle="popover"]').popover()
            });
        }
    }
</script>