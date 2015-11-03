<template>
    <div id="generic-char">
        <div v-if="!char">
            <h4 class="text-center">Loading...</h4>
        </div>
        <div v-else>
            <header>
                <div class="pull-right">
                    <div class="btn-group">
                        <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i class="fa fa-plus"></i>
                            Add
                        </button>
                        <div class="dropdown-menu dropdown-menu-right">
                            <a class="dropdown-item" href="#">
                                <i class="fa fa-bar-chart"></i>
                                Counter
                            </a>
                            <a class="dropdown-item" href="#">
                                <i class="fa fa-random"></i>
                                Roll
                            </a>
                        </div>
                    </div>
                </div>
                <h1>{{ char.name }}</h1>
            </header>
            <div class="upper-sheet">
                <div class="main">
                    <div class="portrait-block">
                        <div class="portrait">
                            <img class="img-thumbnail" :src="char.portrait || 'http://placehold.it/800x1200'" height="445px" width="300px" style="max-width: inherit">
                        </div>
                        <div class="counters">
                            <div class="card">
                                <div class="card-header">
                                    <i class="fa fa-bar-chart-o"></i>
                                    Counters
                                </div>
                                <div v-if="!char.counters || char.counters.length == 0" class="text-center card-block">
                                    <h6>No counters, yet.</h6>
                                </div>
                                <div class="card-block" v-else>
                                    <counter v-for="counter in char.counters" :counter="counter" :save="char.save.bind(char)"></counter>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="stats">
                        <div class="card">
                            <div class="card-block">
                                <h6 class="text-center" style="margin: 0">No Stats, yet.</h6>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="sidebar">
                    <div class="card">
                        <div class="card-header">
                            <i class="fa fa-random"></i>
                            Rolls
                        </div>
                        <div v-if="!char.rolls || char.rolls.length == 0" class="text-center card-block">
                            <h6>No rolls, yet.</h6>
                        </div>
                        <div class="card-block" v-else>
                            <roll v-for="roll in char.rolls" :roll="roll" :save="char.save.bind(char)"></roll>
                        </div>
                    </div>
                </div>
            </div>
            <notes :notes="char.notes" :save="char.save.bind(char)"></notes>
        </div>
    </div>
</template>

<style lang="sass" src="./character.scss"></style>

<script type="text/babel">
    import GenericCharacter from './components/model';
    import systemsSvc from '../../components/systems/systemsService';

    import counter from './components/counter.vue';
    import roll from './components/roll.vue';
    import notes from './components/notes.vue';

    export default {
        components: {
            counter: counter,
            roll: roll,
            notes: notes
        },
        props: {
            base: {
                required: true
            },
        },
        data: function()
        {
            return {
                char: null
            };
        },
        activate: function(done)
        {
            systemsSvc.getChar(this.base.system, this.base.id)
                .then((char) =>
                {
                    // Wrap this in a model!
                    this.char = new GenericCharacter(this.base, char);
                    done();
                });
        }
    }
</script>