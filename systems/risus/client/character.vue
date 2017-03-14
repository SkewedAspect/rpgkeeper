<!--------------------------------------------------------------------------------------------------------------------->
<!-- Character Component                                                                                             -->
<!--------------------------------------------------------------------------------------------------------------------->

<template>
    <div id="risus-character" class="container">
        <md-layout md-gutter="16">
            <portrait :src="character.portrait"></portrait>
            <md-layout md-flex-xsmall="100" style="min-width: 275px">
                <md-card style="flex: 1">
                    <md-card-content style="flex: 1">
                        <md-input-container>
                            <label>Name</label>
                            <md-input v-model="name" :disabled="!isAuthorized"></md-input>
                        </md-input-container>
                        <md-input-container>
                            <label>Description</label>
                            <md-textarea v-model="biography" :disabled="!isAuthorized"></md-textarea>
                        </md-input-container>
                        <md-layout md-gutter="16">
                            <md-layout md-flex="50">
                                <md-input-container>
                                    <label>Advancement Points</label>
                                    <md-input type="number" v-model="character.advancementPoints" :disabled="!isAuthorized"></md-input>
                                </md-input-container>
                            </md-layout>
                            <md-layout md-flex="50">
                                <md-input-container>
                                    <label>Fire and Forget Dice</label>
                                    <md-input type="number" v-model="character.ffDice" :disabled="!isAuthorized"></md-input>
                                </md-input-container>
                            </md-layout>
                        </md-layout>
                        <pool name="Lucky Shots" :pool="character.luckyShots" :edit-disabled="!isAuthorized"></pool>
                    </md-card-content>
                </md-card>
            </md-layout>
            <md-layout md-flex-xsmall="100" id="rolls">
                <md-card style="flex: 1">
                    <md-card-content style="flex: 1; padding-bottom: 0">
                        <md-input-container style="margin-bottom: 10px;">
                            <label>Dice</label>
                            <md-input type="number" min="0" v-model="dice"></md-input>
                            <span style="margin-left: 10px; padding-top: 4px">D6</span>
                        </md-input-container>
                        <md-list class="md-double-line md-dense roll-list">
                            <md-list-item v-for="item in rolls">
                                <div class="md-list-text-container">
                                    <span>{{ item.display }}</span>
                                    <span>{{ item.name }}</span>
                                </div>
                            </md-list-item>
                        </md-list>
                    </md-card-content>
                    <md-card-actions>
                        <md-button @click.native="roll()">Roll</md-button>
                        <md-button @click.native="clearRolls()">Clear</md-button>
                    </md-card-actions>
                </md-card>
            </md-layout>
            <md-layout md-flex-small="100" style="min-width: 50%">
                <md-card style="flex: 1">
                    <md-card-content style="flex: 1">
                        <md-list class="md-double-line">
                            <cliche-item  v-for="(cliche, index) in cliches" :cliche="cliche"
                                          @click.native="rollCliche(cliche)"
                                          @deleted="onDeleteCliche(index)" :disabled="!isAuthorized"></cliche-item>
                        </md-list>
                    </md-card-content>
                    <md-card-actions>
                        <md-button @click.native="openNewCliche()" :disabled="!isAuthorized">Add Cliche</md-button>
                    </md-card-actions>
                </md-card>
            </md-layout>
            <md-layout md-flex-small="100" style="min-width: 50%">
                <md-card style="flex: 1">
                    <md-card-content style="flex: 1">
                        <md-list>
                            <hook-item  v-for="(hook, index) in hooks" :hook="hook"
                                @deleted="onDeleteHook(index)" :disabled="!isAuthorized"></hook-item>
                        </md-list>
                    </md-card-content>
                    <md-card-actions>
                        <md-button @click.native="openNewHook()" :disabled="!isAuthorized">Add Hook</md-button>
                    </md-card-actions>
                </md-card>
            </md-layout>
        </md-layout>

        <notes :notes="character.notes" :save="character.save"></notes>

        <!-- Dialogs -->

        <md-dialog ref="newCliche">
            <md-dialog-title>New Cliche</md-dialog-title>

            <md-dialog-content>
                <md-input-container>
                    <label>Description</label>
                    <md-input v-model="newCliche.description"></md-input>
                </md-input-container>
                <md-input-container>
                    <label>Value</label>
                    <md-input type="number" v-model="newCliche.value"></md-input>
                </md-input-container>
                <md-input-container>
                    <label>Tools/Abilities</label>
                    <md-textarea v-model="newCliche.tools"></md-textarea>
                </md-input-container>
            </md-dialog-content>

            <md-dialog-actions>
                <md-button class="md-primary" @click.native="cancelNewCliche()">Cancel</md-button>
                <md-button class="md-primary" @click.native="saveNewCliche()">Ok</md-button>
            </md-dialog-actions>
        </md-dialog>

        <md-dialog ref="newHook">
            <md-dialog-title>New Hook</md-dialog-title>

            <md-dialog-content>
                <md-input-container>
                    <label>Description</label>
                    <md-input v-model="newHook.description"></md-input>
                </md-input-container>
            </md-dialog-content>

            <md-dialog-actions>
                <md-button class="md-primary" @click.native="cancelNewHook()">Cancel</md-button>
                <md-button class="md-primary" @click.native="saveNewHook()">Ok</md-button>
            </md-dialog-actions>
        </md-dialog>
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style rel="stylesheet/scss" lang="sass">
    #risus-character {
        padding: 8px 16px;

        .md-layout {
            margin-top: 8px;
            margin-bottom: 8px;
        }

        #portrait {
            margin: 8px;

            @media(max-width: 600px)
            {
                display: none;
            }
        }

        #rolls {
            min-width: 275px;

            @media(min-width: 945px)
            {
                max-width: 300px;
            }
        }

        .roll-list {
            overflow-y: auto;
            max-height: 275px;

            .md-list-item-container {
                min-height: 40px !important;
            }
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script>
    //------------------------------------------------------------------------------------------------------------------

    import _ from 'lodash';

    // Services
    import stateSvc from '../../../client/services/state';
    import diceSvc from '../../../client/services/dice';

    // Components
    import NotesComponent from '../../../client/components/notes/notes.vue';
    import PoolComponent from '../../../client/components/pool.vue';
    import PortraitComponent from '../../../client/components/portrait.vue';
    import ClicheComponent from './components/cliche.vue';
    import HookComponent from './components/hook.vue';

    //------------------------------------------------------------------------------------------------------------------

    export default {
        components: {
            notes: NotesComponent,
            pool: PoolComponent,
            portrait: PortraitComponent,
            clicheItem: ClicheComponent,
            hookItem: HookComponent
        },
        props: {
            character: {
                type: Object,
                required: true
            }
        },
        data()
        {
            return {
                state: stateSvc.state,

                dice: undefined,
                rollName: undefined,
                rolls: [],
                newCliche: {
                    value: undefined,
                    current: undefined,
                    description: undefined,
                    tools: undefined
                },
                newHook: {
                    description: undefined
                }
            };
        },
        computed: {
            account(){ return this.state.account; },
            isAuthorized(){ return _.get(this.account, 'email', 'nope!') == this.character.owner; },
            name: {
                get: function(){ return this.character.name; },
                set: function(val){ this._setName(val); }
            },
            biography: {
                get: function(){ return this.character.biography; },
                set: function(val){ this._setBiography(val); }
            },
            cliches()
            {
                return _.sortBy(this.character.cliches, 'value').reverse();
            },
            hooks()
            {
                return this.character.hooks;
            }
        },
        methods: {
            roll()
            {
                const roll = diceSvc.roll(`${ this.dice }d6`);
                this.rolls.unshift({ roll, name: this.rollName, display: `${ roll.render() } = ${ roll.value }` });
                this.rollName = undefined;
            },
            clearRolls()
            {
                this.rolls = [];
                this.dice = null;
                this.rollName = undefined;
            },

            rollCliche(cliche)
            {
                this.dice = cliche.current;
                this.rollName = cliche.description;
                this.roll();
            },

            onDeleteCliche(clicheIndex)
            {
                this.character.cliches.splice(clicheIndex, 1)
            },
            onDeleteHook(hookIndex)
            {
                this.character.hooks.splice(hookIndex, 1)
            },

            openNewCliche()
            {
                this.clearNewCliche();
                this.$refs.newCliche.open();
            },
            clearNewCliche()
            {
                setTimeout(() =>
                {
                    this.newCliche.index = undefined;
                    this.newCliche.value = undefined;
                    this.newCliche.current = undefined;
                    this.newCliche.description = undefined;
                    this.newCliche.tools = undefined;
                }, 500);
            },
            cancelNewCliche()
            {
                this.clearNewCliche();
                this.$refs.newCliche.close();
            },
            saveNewCliche()
            {
                this.newCliche.current = this.newCliche.value;
                this.character.cliches.push(_.cloneDeep(this.newCliche));
                this.clearNewCliche();
                this.$refs.newCliche.close();
            },
            openNewHook()
            {
                this.clearNewHook();
                this.$refs.newHook.open();
            },
            clearNewHook()
            {
                setTimeout(() => { this.newHook.description = undefined; }, 500);
            },
            cancelNewHook()
            {
                this.clearNewHook();
                this.$refs.newHook.close();
            },
            saveNewHook()
            {
                this.character.hooks.push(_.cloneDeep(this.newHook));
                this.clearNewHook();
                this.$refs.newHook.close();
            }
        },
        watch: {
            character: {
                handler: function(){ this.character.$save(); },
                deep: true
            }
        },
        mounted()
        {
            // FIXME: This is to work arounf a bug with textarea resizing!
            setTimeout(() =>
            {
                this.character.description = this.character.description + ' ';
                this.character.description = this.character.description.trim();
            }, 250);

            // Debounce functions
            this._setBiography = _.debounce((desc) => { this.character.biography = desc; }, 1000, { maxWait: 2000 });
            this._setName = _.debounce((name) => { this.character.name = name; }, 1000, { maxWait: 2000 });
        }
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->