<template>
    <div id="dnd35-char">
        <div v-if="!char">
            <h4 class="text-center">Loading...</h4>
        </div>
        <div v-else>
            <header>
                <div class="name">
                    <h1>{{ char.name }} <small class="text-muted">{{ char.description }}</small></h1>
                </div>
                <div class="classes">
                    <button class="close pull-right" title="Edit Classes and Levels" style="margin-left: 10px;">
                        <i class="fa fa-edit"></i>
                    </button>
                    <h4 class="text-muted">
                        <span v-for="classObj in char.classes">
                            {{ classObj.level }} {{ classObj.class.name }}
                            <span v-if="$index != (char.classes.length - 1)">/</span>
                        </span>
                    </h4>
                </div>
            </header>

            <!-- Notes -->
            <notes :notes="char.notes" :save="save"></notes>
        </div>
    </div>
</template>

<style rel="stylesheet/scss" lang="sass">
    #dnd35-char {
        header {
            display: table;
            width: 100%;

            .name {
                display: table-cell;
                vertical-align: bottom;
            }

            .classes {
                display: table-cell;
                vertical-align: bottom;
                text-align: right;
                padding-bottom: 3px;
            }
        }
    }
</style>

<script type="text/babel">
    import DnD35Character from './model';
    import systemsSvc from '../../../client/components/systems/systemsService';
    import diceSvc from '../../../client/components/dice/diceService';

    // Components
    import notes from '../../../client/components/notes/notes.vue';

    export default {
        components: {
            notes
        },
        props: {
            base: { required: true }
        },
        data: function()
        {
            return {
                char: null
            };
        },
        methods: {
            save()
            {
                this.char.save();
            }
        },
        activate: function(done)
        {
            var char = new DnD35Character(this.base, {});
            char.loading.then(() =>
            {
                this.char = char;
                done()
            });
        }
    }
</script>