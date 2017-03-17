<!--------------------------------------------------------------------------------------------------------------------->
<!-- Character Component                                                                                             -->
<!--------------------------------------------------------------------------------------------------------------------->

<template>
    <div id="fate-character" class="container">
        <character :character="character">

            <!-- Sheet -->
            <md-layout md-gutter="16">
                <portrait :src="character.portrait"></portrait>
                <md-layout md-flex-xsmall="100" style="min-width: 275px">
                    <md-card style="flex: 1">
                        <md-card-content style="flex: 1">
                            <md-input-container>
                                <label>Name</label>
                                <md-input v-model="character.name" :disabled="!isAuthorized"></md-input>
                            </md-input-container>
                            <md-input-container>
                                <label>Description</label>
                                <md-textarea style="font-size: 14px;" v-model="character.biography" :disabled="!isAuthorized"></md-textarea>
                            </md-input-container>
                            <md-layout class="fate-points">
                                <md-layout>
                                    <md-input-container>
                                        <label>Fate Points</label>
                                        <md-input type="number" min="0" v-model="character.fatePoints.current" :disabled="!isAuthorized"></md-input>
                                    </md-input-container>
                                </md-layout>
                                <md-layout v-flex="shrink">
                                    <h3 style="padding-top: 10px">/ {{ character.fatePoints.refresh }}</h3>
                                </md-layout>
                                <md-layout v-flex="shrink">
                                    <div>
                                        <md-button class="refresh-btn md-raised" @click.native="refreshFatePoints">Refresh</md-button>
                                    </div>
                                </md-layout>
                                <md-layout v-flex="shrink">
                                    <md-button class="edit-btn md-icon-button md-dense">
                                        <md-icon>edit</md-icon>
                                    </md-button>
                                </md-layout>
                            </md-layout>
                        </md-card-content>
                    </md-card>
                </md-layout>
                <md-layout md-flex-xsmall="100" style="min-width: 275px">
                    <md-card style="flex: 1">
                        <md-card-content style="flex: 1; padding-bottom: 0">
                            <md-input-container md-inline style="margin-bottom: 10px;">
                                <md-select name="skills" id="skills" placeholder="Pick a skill to roll..." v-model="skills">
                                    <md-option value="empathy">Empathy</md-option>
                                </md-select>

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
            </md-layout>
            <md-layout md-flex-xsmall="100" style="min-width: 275px">
                <md-card style="flex: 1">
                    <md-card-content style="flex: 1">
                        <pre><code>{{ JSON.stringify(character.$system, null, 4) }}</code></pre>
                    </md-card-content>
                </md-card>
            </md-layout>

            <!-- Dialogs -->

        </character>
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style rel="stylesheet/scss" lang="sass">
    #fate-character {
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

        .edit-btn {
            .md-icon {
                font-size: 20px;
                top: 4px;
            }
        }

        .fate-points {
            .edit-btn {
                margin-right: 0;
                margin-top: 18px;
            }

            .refresh-btn {
                margin-right: 0;
                margin-top: 16px;
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
    import CharComponent from '../../../client/components/character.vue';
    import PortraitComponent from '../../../client/components/portrait.vue';

    //------------------------------------------------------------------------------------------------------------------

    export default {
        components: {
            character: CharComponent,
            portrait: PortraitComponent,
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
            };
        },
        computed: {
            account(){ return this.state.account; },
            isAuthorized(){ return _.get(this.account, 'email', 'nope!') == this.character.owner; }
        },
        methods: {
            refreshFatePoints()
            {
                this.character.fatePoints.current = Math.max(this.character.fatePoints.current, this.character.fatePoints.refresh);
            }
        }
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->