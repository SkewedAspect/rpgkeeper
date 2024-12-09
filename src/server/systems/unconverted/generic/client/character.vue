<template>
    <div id="generic-char" class="container">
        <div v-if="!char">
            <h4 class="text-center">
                Loading...
            </h4>
        </div>
        <div v-else>
            <header>
                <div class="pull-right">
                    <div class="btn-toolbar">
                        <button class="btn btn-primary" @click="open('addCounter')">
                            <i class="fa fa-plus" />
                            Counter
                        </button>
                        <button class="btn btn-primary" @click="open('addRoll')">
                            <i class="fa fa-plus" />
                            Roll
                        </button>
                        <button class="btn btn-primary" @click="open('addStatblock')">
                            <i class="fa fa-plus" />
                            Statblock
                        </button>
                    </div>
                </div>
                <h1>{{ char.name }} <small class="text-muted">{{ char.description }}</small></h1>
            </header>
            <div class="upper-sheet">
                <div class="main">
                    <div class="portrait">
                        <img class="img-thumbnail" :src="char.portrait || 'http://placehold.it/800x1200'" height="445px" width="300px" style="max-width: inherit">
                    </div>
                    <div class="counters">
                        <div v-if="!char.counters || char.counters.length == 0" class="text-center card-block">
                            <h6>No counters, yet.</h6>
                        </div>
                        <div v-else>
                            <Counter v-for="counter in char.counters" :counter="counter" :save="save" :on-delete="deleteCounter" :move-up="moveUp" :move-down="moveDown" />
                        </div>
                    </div>
                </div>
                <!--div class="sidebar"-->
                <div id="rolls" class="sidebar card">
                    <div class="card-header">
                        <i class="fa fa-random" />
                        Rolls
                    </div>
                    <div class="card-block">
                        <div class="input-group">
                            <span class="input-group-addon roll-display" data-trigger="hover" data-container="body" data-toggle="popover" data-placement="top" data-content="{{ rollRendered }}">
                                <button v-if="rollValue || rollValue === 0" type="button" class="close" @click.prevent.stop="clearRoll()">
                                    <span aria-hidden="true">
                                        &times;
                                    </span>
                                    <span class="sr-only">Clear</span>
                                </button>
                                {{ rollValue }}
                            </span>
                            <input v-model="rollExpression" type="text" class="form-control" placeholder="ex: 1d20 +1">
                            <span class="input-group-btn">
                                <button class="btn btn-secondary" type="button" title="Click to roll" @click="executeRoll()">
                                    <i class="fa fa-random" />
                                    Roll
                                </button>
                            </span>
                        </div>
                        <hr>
                        <div v-if="!char.rolls || char.rolls.length == 0" class="text-center">
                            <h6>No rolls, yet.</h6>
                        </div>
                        <div v-else>
                            <Roll v-for="roll in char.rolls" :roll="roll" :rolls="char.rolls" :context="char.rollContext" :save="save" />
                        </div>
                    </div>
                </div>
                <!--/div-->
            </div>

            <!-- Stats -->
            <div id="stats" class="card">
                <div v-if="!char.stats || char.stats.length === 0" class="card-block">
                    <h6 class="text-center" style="margin: 0">
                        No Stats, yet.
                    </h6>
                </div>
                <div v-else class="stats-list">
                    <Statblock v-for="statblock in char.stats" v-model:statblock="statblock" :context="char.rollContext" :move-up="moveUp" :move-down="moveDown" :save="save" :on-delete="deleteStatblock" />
                </div>
            </div>

            <!-- Notes -->
            <Notes :notes="char.notes" :save="save" />
        </div>

        <!-- Add Roll Modal -->
        <Modal v-ref:add-roll :backdrop="'static'" :keyboard="false">
            <template #header>
                <div class="modal-header">
                    <h4 class="modal-title">
                        <i class="fa fa-plus" />
                        New Roll
                    </h4>
                </div>
            </template>
            <template #body>
                <div class="modal-body">
                    <form>
                        <fieldset class="form-group">
                            <label for="roll-name">Name</label>
                            <input id="roll-name" v-model="newRoll.name" type="text" class="form-control">
                        </fieldset>
                        <fieldset class="form-group">
                            <label for="expr">Expression</label>
                            <textarea id="expr" v-model="newRoll.expression" rows="5" class="form-control monospace" />
                        </fieldset>
                    </form>
                </div>
            </template>
            <template #footer>
                <div class="modal-footer">
                    <button
                        type="button"
                        class="btn btn-success"
                        @click="addRoll()"
                    >
                        <i class="fa fa-save" />
                        Add Roll
                    </button>
                    <button
                        type="button"
                        class="btn btn-secondary"
                        @click="$refs.addRoll.hideModal()"
                    >
                        <i class="fa fa-times" />
                        Cancel
                    </button>
                </div>
            </template>
        </Modal>

        <!-- Add Counter Modal -->
        <Modal v-ref:add-counter :backdrop="'static'" :keyboard="false">
            <template #header>
                <div class="modal-header">
                    <h4 class="modal-title">
                        <i class="fa fa-plus" />
                        Add Counter
                    </h4>
                </div>
            </template>
            <template #body>
                <div class="modal-body">
                    <form>
                        <fieldset class="form-group">
                            <label for="counter-name">Name</label>
                            <input id="counter-name" v-model="newCounter.name" type="text" class="form-control">
                        </fieldset>
                        <fieldset class="form-group">
                            <label for="value">Value</label>
                            <input id="value" v-model="newCounter.value" type="number" class="form-control" number>
                        </fieldset>
                        <fieldset class="form-group">
                            <label for="step">Step</label>
                            <input id="step" v-model="newCounter.step" type="number" class="form-control" step=".01" number>
                        </fieldset>
                        <fieldset class="form-group">
                            <label for="min">Min</label>
                            <input id="min" v-model="newCounter.min" type="number" class="form-control" number>
                        </fieldset>
                        <fieldset class="form-group">
                            <label for="max">Max</label>
                            <input id="max" v-model="newCounter.max" type="number" class="form-control" number>
                        </fieldset>
                    </form>
                </div>
            </template>
            <template #footer>
                <div class="modal-footer">
                    <button
                        type="button"
                        class="btn btn-success"
                        @click="addCounter()"
                    >
                        <i class="fa fa-save" />
                        Save Counter
                    </button>
                    <button
                        type="button"
                        class="btn btn-secondary"
                        @click="$refs.addCounter.hideModal()"
                    >
                        <i class="fa fa-times" />
                        Cancel
                    </button>
                </div>
            </template>
        </Modal>

        <!-- Add Statblock Modal -->
        <AddEditStatModal v-model:stats="newStatblock" v-ref:add-statblock :mode="'add'" :save="addStatblock" />
    </div>
</template>

<style lang="scss" src="character.scss"></style>

<script type="text/babel">
    import { modal } from 'vueboot';

    import GenericCharacter from './components/model';
    import systemsSvc from '../../../client/components/systems/systemsService';
    import diceUtil from '../../../client/components/dice/diceService';

    import counter from './components/counter.vue';
    import roll from './components/roll.vue';
    import statblock from './components/statblock.vue';
    import notes from '../../../../../client/components/notes/noteBook.vue';
    import AddEditStatModal from './modals/statAddEdit.vue';

    export default {
        components: {
            counter,
            roll,
            statblock,
            notes,
            modal,
            addEditStatModal: AddEditStatModal,
        },
        props: {
            base: {
                required: true,
            },
        },
        data()
        {
            return {
                char: null,
                newRoll: {},
                newCounter: {},
                newStatblock: {},
                rollResults: null,
                rollExpression: '',
            };
        },
        computed: {
            rollRendered()
            {
                if(this.rollResults)
                {
                    return this.rollResults.render();
                }

                return '';
            },
            rollValue()
            {
                return (this.rollResults || {}).value;
            },
        },
        methods: {
            moveUp(listName, item)
            {
                this.char.moveUp(listName, item);
            },
            moveDown(listName, item)
            {
                this.char.moveDown(listName, item);
            },
            save()
            {
                this.char.save();
            },
            deleteCounter(counter)
            {
                this.char.counters.$remove(counter);
                this.char.save();
            },
            executeRoll()
            {
                this.rollResults = diceSvc.roll(this.rollExpression, {});
            },
            clearRoll()
            {
                this.rollResults = null;
                this.rollExpression = '';
            },
            open(modal)
            {
                this.$refs[modal].showModal();
            },
            addRoll()
            {
                this.char.rolls.push(this.newRoll);
                this.newRoll = {};
                this.$refs.addRoll.hideModal();

                this.char.save();
            },
            addCounter()
            {
                this.char.counters.push(this.newCounter);
                this.newCounter = {};
                this.$refs.addCounter.hideModal();

                this.char.save();
            },
            addStatblock()
            {
                this.char.stats.push(this.newStatblock);
                this.newStatblock = {};
                this.char.save();
            },
            deleteStatblock(statblock)
            {
                this.char.stats.$remove(statblock);
                this.char.save();
            },
        },
        activate(done)
        {
            systemsSvc.getChar(this.base.system, this.base.id)
                .then((char) =>
                {
                    // Wrap this in a model!
                    this.char = new GenericCharacter(this.base, char);
                    done();
                });
        },
    };
</script>
