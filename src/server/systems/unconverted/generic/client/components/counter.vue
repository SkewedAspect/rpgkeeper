<template>
    <div class="card counter">
        <div class="card-header">
            <button type="button" class="close" aria-label="Close" @click="confirmDelete()">
                <span aria-hidden="true">
                    <i class="fa fa-trash-o" />
                </span>
                <span class="sr-only">Delete</span>
            </button>
            <button type="button" class="close" aria-label="Close" @click="edit()">
                <span aria-hidden="true">
                    <i class="fa fa-edit" />
                </span>
                <span class="sr-only">Edit</span>
            </button>
            <button type="button" class="close" aria-label="Close" @click="moveUp('counters', counter)">
                <span aria-hidden="true">
                    <i class="fa fa-caret-up" />
                </span>
                <span class="sr-only">Move Up</span>
            </button>
            <button type="button" class="close" aria-label="Close" @click="moveDown('counters', counter)">
                <span aria-hidden="true">
                    <i class="fa fa-caret-down" />
                </span>
                <span class="sr-only">Move Down</span>
            </button>
            {{ counter.name }}
        </div>
        <div v-if="counter.max === undefined && counter.min === undefined" class="counter-style">
            <input v-model="counter.value" type="number" class="form-control" :step="counter.step" :max="counter.max" :min="counter.min" number debounce="1000">
        </div>
        <div v-else class="input-group counter-style">
            <input v-model="counter.value" type="number" class="form-control" :step="counter.step" :max="counter.max" :min="counter.min" number debounce="1000">
            <span class="input-group-btn">
                <!--button class="btn btn-secondary" type="button" title="Increment Value" @click="inc()">
                    <i class="fa fa-plus"></i>
                </button>
                <button class="btn btn-secondary" type="button" title="Decrement Value" @click="dec()">
                    <i class="fa fa-minus"></i>
                </button-->
                <button v-if="counter.max !== undefined" class="btn btn-secondary" type="button" title="Set to Max" @click="toMax()">
                    <i class="fa fa-step-backward fa-rotate-90" />
                </button>
                <button v-if="counter.min !== undefined" class="btn btn-secondary" type="button" title="Set to Min" @click="toMin()">
                    <i class="fa fa-step-forward fa-rotate-90" />
                </button>
            </span>
        </div>

        <!-- Edit Modal -->
        <Modal v-ref:edit-modal :backdrop="'static'" :keyboard="false">
            <template #header>
                <div class="modal-header">
                    <h4 class="modal-title">
                        <i class="fa fa-edit" />
                        Edit "{{ counter.name }}" Counter
                    </h4>
                </div>
            </template>
            <template #body>
                <div class="modal-body">
                    <form>
                        <fieldset class="form-group">
                            <label for="name">Name</label>
                            <input id="name" v-model="counterClone.name" type="text" class="form-control">
                        </fieldset>
                        <fieldset class="form-group">
                            <label for="step">Step</label>
                            <div class="input-group">
                                <input id="step" v-model="counterClone.step" type="number" class="form-control" step=".01" number>
                                <span class="input-group-btn">
                                    <button class="btn btn-secondary" type="button" title="Clear Value" @click="clear('step')">
                                        <i class="fa fa-times" />
                                        Clear
                                    </button>
                                </span>
                            </div>
                        </fieldset>
                        <fieldset class="form-group">
                            <label for="min">Min</label>
                            <div class="input-group">
                                <input id="min" v-model="counterClone.min" type="number" class="form-control" number>
                                <span class="input-group-btn">
                                    <button class="btn btn-secondary" type="button" title="Clear Value" @click="clear('min')">
                                        <i class="fa fa-times" />
                                        Clear
                                    </button>
                                </span>
                            </div>
                        </fieldset>
                        <fieldset class="form-group">
                            <label for="max">Max</label>
                            <div class="input-group">
                                <input id="max" v-model="counterClone.max" type="number" class="form-control" number>
                                <span class="input-group-btn">
                                    <button class="btn btn-secondary" type="button" title="Clear Value" @click="clear('max')">
                                        <i class="fa fa-times" />
                                        Clear
                                    </button>
                                </span>
                            </div>
                        </fieldset>
                    </form>
                </div>
            </template>
            <template #footer>
                <div class="modal-footer">
                    <button
                        type="button"
                        class="btn btn-success"
                        @click="saveEdits()"
                    >
                        <i class="fa fa-save" />
                        Save Counter
                    </button>
                    <button
                        type="button"
                        class="btn btn-secondary"
                        @click="$refs.editModal.hideModal()"
                    >
                        <i class="fa fa-times" />
                        Cancel
                    </button>
                </div>
            </template>
        </Modal>

        <!-- Delete Modal -->
        <Modal id="delModal" v-ref:del-modal>
            <template #header>
                <div class="modal-header">
                    <h4 class="modal-title">
                        <i class="fa fa-trash-o" />
                        Delete "{{ counter.name }}" Counter
                    </h4>
                </div>
            </template>
            <template #body>
                <div class="modal-body text-center">
                    <h3><i class="fa fa-exclamation-triangle" /> Are you sure you want to delete this counter?</h3>
                    <p class="text-danger">
                        <b>This cannot be undone!</b>
                    </p>
                </div>
            </template>
            <template #footer>
                <div class="modal-footer">
                    <button
                        type="button"
                        class="btn btn-danger"
                        @click="deleteCounter()"
                    >
                        <i class="fa fa-trash-o" />
                        Delete Counter
                    </button>
                    <button
                        type="button"
                        class="btn btn-secondary"
                        @click="$refs.delModal.hideModal()"
                    >
                        <i class="fa fa-times" />
                        Cancel
                    </button>
                </div>
            </template>
        </Modal>
    </div>
</template>

<style lang="scss">
    .card.counter {
        margin-bottom: 10px !important;

        .card-header {
            padding: .5rem .75rem;
            font-size: .85rem;
            font-weight: 500;

            button.close {
                line-height: .75;
                margin-left: 10px;

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

        .counter-style {
            input {
                border: none;
                border-top-left-radius: 0;
                border-top-right-radius: 0;
            }
        }
    }
</style>

<script type="text/babel">
    import _ from 'lodash';
    import { modal } from 'vueboot';

    export default {
        components: {
            modal,
        },
        props: {
            counter: {
                required: true,
            },
            moveUp: {
                type: Function,
                required: true,
            },
            moveDown: {
                type: Function,
                required: true,
            },
            save: {
                type: Function,
                required: true,
            },
            onDelete: {
                type: Function,
                required: true,
            },
        },
        data()
        {
            return {
                counterClone: _.clone(this.counter),
            };
        },
        watch: {
            'counter.value'()
            {
                // Enforce our bounds; input[type="number"] doesn't when the user manually inputs a number.
                var max = _.isNumber(this.counter.max) ? this.counter.max : Infinity;
                var min = _.isNumber(this.counter.min) ? this.counter.min : -Infinity;
                this.counter.value = Math.min(this.counter.value, max);
                this.counter.value = Math.max(this.counter.value, min);

                // Save this
                this.save();
            },
        },
        methods: {
            inc()
            {
                var step = _.isNumber(this.counter.step) ? this.counter.step : 1;
                var max = _.isNumber(this.counter.max) ? this.counter.max : Infinity;

                // Floats suck ass, and adding .1 to 2.2 might equal 2.3000000000001. I hate floats.
                this.counter.value = parseFloat(Math.min(this.counter.value + step, max).toFixed(10));
            },
            dec()
            {
                var step = _.isNumber(this.counter.step) ? this.counter.step : 1;
                var min = _.isNumber(this.counter.min) ? this.counter.min : -Infinity;

                // Floats suck ass, and suptracting .1 from 2.2 might equal 2.09999999999999. I hate floats.
                this.counter.value = parseFloat(Math.max(this.counter.value - step, min).toFixed(10));
            },
            toMax()
            {
                this.counter.value = this.counter.max;
            },
            toMin()
            {
                this.counter.value = this.counter.min;
            },
            clear(prop)
            {
                this.counterClone[prop] = undefined;
            },
            edit()
            {
                this.counterClone = _.clone(this.counter);
                this.$refs.editModal.showModal();
            },
            confirmDelete()
            {
                this.$refs.delModal.showModal();
            },
            deleteCounter()
            {
                this.onDelete(this.counter);
                this.$refs.delModal.hideModal();
            },
            saveEdits()
            {
                _.assign(this.counter, this.counterClone);
                this.$refs.editModal.hideModal();

                this.save();
            },

        },
    };
</script>
