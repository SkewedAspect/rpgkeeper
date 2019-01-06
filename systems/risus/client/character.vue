<!--------------------------------------------------------------------------------------------------------------------->
<!-- Character Component                                                                                             -->
<!--------------------------------------------------------------------------------------------------------------------->

<template>
    <div id="risus-character" class="container" v-if="character">
        <!-- Sheet -->
        <md-layout md-gutter="16">
            <portrait :src="baseChar.portrait"></portrait>
            <md-layout md-flex-xsmall="100" style="min-width: 275px">
                <md-card style="flex: 1">
                    <md-toolbar class="md-dense">
                        <h2 class="md-title">Bio</h2>
                    </md-toolbar>
                    <md-card-content style="flex: 1">
                        <md-input-container>
                            <label>Name</label>
                            <md-input v-model="baseChar.name" :disabled="!isAuthorized"></md-input>
                        </md-input-container>
                        <md-input-container>
                            <label>Description</label>
                            <md-textarea v-model="baseChar.biography" :disabled="!isAuthorized"></md-textarea>
                        </md-input-container>
                        <md-layout md-gutter="16">
                            <md-layout md-flex="50">
                                <md-input-container>
                                    <label class="hidden-sm-up">Adv. Points</label>
                                    <label class="hidden-xs-down">Advancement Points</label>
                                    <md-input type="number" v-model.number="advPoints" :disabled="!isAuthorized" min="0" @blur.native="onAdvBlur()"></md-input>
                                </md-input-container>
                            </md-layout>
                            <md-layout md-flex="50">
                                <md-input-container>
                                    <label class="hidden-sm-up">F & F Dice</label>
                                    <label class="hidden-xs-down">Fire and Forget Dice</label>
                                    <md-input type="number" v-model.number="ffDice" :disabled="!isAuthorized" min="0" @blur.native="onFFBlur()"></md-input>
                                </md-input-container>
                            </md-layout>
                        </md-layout>
                        <pool name="Lucky Shots" :pool="character.luckyShots" :edit-disabled="!isAuthorized"></pool>
                    </md-card-content>
                </md-card>
            </md-layout>
            <md-layout md-flex-xsmall="100" id="rolls">
                <md-card style="flex: 1">
                    <md-toolbar class="md-dense">
                        <h2 class="md-title">Rolls</h2>
                    </md-toolbar>
                    <md-card-content style="flex: 1; padding-bottom: 0">
                        <md-input-container style="margin-bottom: 10px;" :disabled="!isAuthorized">
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
                        <md-button @click.native="roll()" :disabled="!isAuthorized">Roll</md-button>
                        <md-button @click.native="clearRolls()" :disabled="!isAuthorized">Clear</md-button>
                    </md-card-actions>
                </md-card>
            </md-layout>
            <md-layout md-flex-small="100" style="min-width: 50%">
                <md-card style="flex: 1">
                    <md-toolbar class="md-dense">
                        <h2 class="md-title">Clichés</h2>
                    </md-toolbar>
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
                    <md-toolbar class="md-dense">
                        <h2 class="md-title">Hooks</h2>
                    </md-toolbar>
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

<style lang="scss">
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

    // Managers
    import authMan from '../../../client/api/managers/auth';
    import charMan from '../../../client/api/managers/character';

    // Utils
    import diceUtil from '../../../client/api/utils/dice';

    // Components
    import PoolComponent from '../../../client/components/character/pool.vue';
    import PortraitComponent from '../../../client/components/character/portrait.vue';
    import ClicheComponent from './components/cliche.vue';
    import HookComponent from './components/hook.vue';

    //------------------------------------------------------------------------------------------------------------------

    export default {
        components: {
            pool: PoolComponent,
            portrait: PortraitComponent,
            clicheItem: ClicheComponent,
            hookItem: HookComponent
        },
        subscriptions: {
            account: authMan.account$,
            baseChar: charMan.selected$
        },
        data()
        {
            return {
                dice: undefined,
                rollName: undefined,
                rolls: [],
                advPoints: 0,
                ffDice: 0,
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
            isAuthorized(){ return _.get(this.account, 'id', 'nope!') === this.baseChar.account_id; },
            character(){ return this.baseChar.details; },
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
                const roll = diceUtil.roll(`${ this.dice }d6`);
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
            },

            onAdvBlur()
            {
                this.character.advancementPoints = this.advPoints;
            },
            onFFBlur()
            {
                this.character.ffDice = this.ffDice;
            }
        },
        mounted()
        {
            this.$watch('character', () =>
            {
                if(this.character)
                {
                    this.advPoints = this.character.advancementPoints;
                    this.ffDice = this.character.ffDice;

                    // PreSave hook
                    this.character.preSave = function()
                    {
                        // Data validation
                        if(!_.isFinite(this.$system.advancementPoints))
                        {
                            this.$system.advancementPoints = 0;
                        } // end if

                        if(!_.isFinite(this.$system.ffDice))
                        {
                            this.$system.ffDice = 0;
                        } // end if
                    }; // end preSave

                } // end if
            });
        }
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
