<template>
    <div class="card counter">
        <div class="card-header">
            <button type="button" class="close" aria-label="Close" @click="edit()">
                <span aria-hidden="true">
                    <i class="fa fa-edit"></i>
                </span>
                <span class="sr-only">Close</span>
            </button>
            {{ counter.name }}
        </div>
        <div class="input-group counter-style">
            <input type="number" class="form-control" v-model="counter.value" :step="counter.step" :max="counter.max" :min="counter.min" number debounce="1000">
            <span class="input-group-btn">
                <button class="btn btn-secondary" type="button" title="Increment Value" @click="inc()">
                    <i class="fa fa-plus"></i>
                </button>
                <button class="btn btn-secondary" type="button" title="Decrement Value" @click="dec()">
                    <i class="fa fa-minus"></i>
                </button>
                <button v-if="counter.max !== undefined" class="btn btn-secondary" type="button" title="Set to Max" @click="toMax()">
                    <i class="fa fa-step-backward fa-rotate-90"></i>
                </button>
                <button v-if="counter.min !== undefined" class="btn btn-secondary" type="button" title="Set to Min" @click="toMin()">
                    <i class="fa fa-step-forward fa-rotate-90"></i>
                </button>
            </span>
        </div>

        <!-- Edit Modal -->
        <modal v-ref:edit-modal  :backdrop="'static'" :keyboard="false">
            <div class="modal-header" slot="header">
                <h4 class="modal-title">
                    <i class="fa fa-edit"></i>
                    Edit "{{ counter.name }}" Counter
                </h4>
            </div>
            <div class="modal-body" slot="body">
                <form>
                    <fieldset>
                        <label for="name">Name</label>
                        <input id="name" type="text" class="form-control" v-model="counterClone.name">
                    </fieldset>
                    <fieldset>
                        <label for="step">Step</label>
                        <div class="input-group">
                            <input id="step" type="number" class="form-control" step=".01" v-model="counterClone.step" number>
                            <span class="input-group-btn">
                                <button class="btn btn-secondary" type="button" title="Clear Value" @click="clear('step')">
                                    <i class="fa fa-times"></i>
                                    Clear
                                </button>
                            </span>
                        </div>
                    </fieldset>
                    <fieldset>
                        <label for="min">Min</label>
                        <div class="input-group">
                            <input id="min" type="number" class="form-control" v-model="counterClone.min" number>
                            <span class="input-group-btn">
                                <button class="btn btn-secondary" type="button" title="Clear Value" @click="clear('min')">
                                    <i class="fa fa-times"></i>
                                    Clear
                                </button>
                            </span>
                        </div>
                    </fieldset>
                    <fieldset>
                        <label for="max">Max</label>
                        <div class="input-group">
                            <input id="max" type="number" class="form-control" v-model="counterClone.max" number>
                            <span class="input-group-btn">
                                <button class="btn btn-secondary" type="button" title="Clear Value" @click="clear('max')">
                                    <i class="fa fa-times"></i>
                                    Clear
                                </button>
                            </span>
                        </div>
                    </fieldset>
                </form>
            </div>
            <div class="modal-footer" slot="footer">
                <button type="button"
                        class="btn btn-success"
                        @click="saveEdits()">Save Counter</button>
                <button type="button"
                        class="btn btn-secondary"
                        @click="$refs.editModal.hideModal()">Cancel</button>
            </div>
        </modal>
    </div>
</template>

<style lang="sass">
    .card.counter {
        margin-bottom: 10px !important;

        .card-header {
            padding: .5rem .75rem;
            font-size: .85rem;
            font-weight: 500;

            button.close {
                line-height: .75;

                & > span {
                    font-size: 1rem;
                }
            }
        }

        .input-group.counter-style {
            input {
                border-top: none;
                border-bottom: none;
                border-left: none;
                border-top-left-radius: 0;
            }

            button {
                border-top: none;
                border-bottom: none;

                &:last-child {
                    border-right: none;
                    border-top-right-radius: 0;
                    margin-right: -1px;
                 }
            }
        }
    }
</style>

<script type="text/babel">
    import _ from 'lodash';
    import { modal } from 'vueboot';

    export default {
        components: {
            modal: modal
        },
        props: {
            counter: {
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
                counterClone: _.clone(this.counter)
            };
        },
        methods: {
            inc: function()
            {
                var step = _.isNumber(this.counter.step) ? this.counter.step : 1;
                var max = _.isNumber(this.counter.max) ? this.counter.max : Infinity;

                // Floats suck ass, and adding .1 to 2.2 might equal 2.3000000000001. I hate floats.
                this.counter.value = parseFloat(Math.min(this.counter.value + step, max).toFixed(10));
            },
            dec: function()
            {
                var step = _.isNumber(this.counter.step) ? this.counter.step : 1;
                var min = _.isNumber(this.counter.min) ? this.counter.min : -Infinity;

                // Floats suck ass, and suptracting .1 from 2.2 might equal 2.09999999999999. I hate floats.
                this.counter.value = parseFloat(Math.max(this.counter.value - step, min).toFixed(10));
            },
            toMax: function()
            {
                this.counter.value = this.counter.max;
            },
            toMin: function()
            {
                this.counter.value = this.counter.min;
            },
            clear: function(prop)
            {
                this.counterClone[prop] = undefined;
            },
            edit: function()
            {
                this.counterClone = _.clone(this.counter);
                this.$refs.editModal.showModal();
            },
            saveEdits: function()
            {
                console.log('clone:', this.counterClone);
                _.assign(this.counter, this.counterClone);
                this.$refs.editModal.hideModal();

                this.save();
            }
        },
        watch: {
            'counter.value': function()
            {
                // Enforce our bounds; input[type="number"] doesn't when the user manually inputs a number.
                var max = _.isNumber(this.counter.max) ? this.counter.max : Infinity;
                var min = _.isNumber(this.counter.min) ? this.counter.min : -Infinity;
                this.counter.value = Math.min(this.counter.value, max);
                this.counter.value = Math.max(this.counter.value, min);

                // Save this
                this.save();
            }
        }
    }
</script>