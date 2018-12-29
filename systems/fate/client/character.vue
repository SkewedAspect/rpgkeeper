<!--------------------------------------------------------------------------------------------------------------------->
<!-- Character Component                                                                                             -->
<!--------------------------------------------------------------------------------------------------------------------->

<template>
    <div id="fate-character" class="container" v-if="character">
        <md-layout md-gutter="16">
            <portrait :src="baseChar.portrait"></portrait>
            <md-layout md-flex-xsmall="100" style="min-width: 275px">
                <md-card style="flex: 1">
                    <md-toolbar class="md-dense">
                        <h2 class="md-title">ID</h2>
                    </md-toolbar>
                    <md-card-content style="flex: 1">
                        <md-input-container>
                            <label>Name</label>
                            <md-input v-model="baseChar.name" :disabled="!isAuthorized"></md-input>
                        </md-input-container>
                        <md-input-container>
                            <label>Description</label>
                            <md-textarea style="font-size: 14px;" v-model="baseChar.biography" :disabled="!isAuthorized"></md-textarea>
                        </md-input-container>
                        <md-layout class="fate-points">
                            <md-layout>
                                <md-input-container>
                                    <label>Fate Points</label>
                                    <md-input type="number" min="0" v-model="character.fatePoints.current" :disabled="!isAuthorized"></md-input>
                                </md-input-container>
                            </md-layout>
                            <md-layout v-flex="'shrink'">
                                <h3 style="padding-top: 10px">/ {{ character.fatePoints.refresh }}</h3>
                            </md-layout>
                            <md-layout v-flex="'shrink'">
                                <div>
                                    <md-button class="refresh-btn md-raised" @click.native="refreshFatePoints" :disabled="!isAuthorized">Refresh</md-button>
                                </div>
                            </md-layout>
                            <md-layout v-flex="'shrink'">
                                <md-button class="edit-btn md-icon-button md-dense" @click="openEditFatePoints()" :disabled="!isAuthorized">
                                    <md-icon>edit</md-icon>
                                </md-button>
                            </md-layout>
                        </md-layout>
                    </md-card-content>
                </md-card>
            </md-layout>
            <md-layout md-flex-xsmall="100" style="min-width: 275px">
                <rolls :skills="character.skills" :is-authorized="isAuthorized"></rolls>
            </md-layout>
        </md-layout>
        <md-layout id="aspects-skills-layout" md-gutter="16">
            <div id="aspects-layout">
                <aspects :aspects="character.aspects" :is-authorized="isAuthorized"></aspects>
            </div>
            <div id="skills-layout" v-flex="'grow'">
                <skills :skills="character.skills" :is-authorized="isAuthorized"></skills>
            </div>
        </md-layout>
        <md-layout md-gutter="16" style="margin-top: -8px">
            <md-layout md-flex-small="100" style="min-width: 275px" md-flex="50">
                <extras v-model="character.extras" :is-authorized="isAuthorized"></extras>
            </md-layout>
            <md-layout md-flex-small="100" style="min-width: 275px" md-flex="50">
                <stunts :stunts="character.stunts" :is-authorized="isAuthorized"></stunts>
            </md-layout>
        </md-layout>
        <md-layout id="stress-consequences-layout" md-gutter="16">
            <div id="stress-layout">
                <stress :character="character" :is-authorized="isAuthorized"></stress>
            </div>
            <div id="consequences-layout">
                <consequences :character="character" :is-authorized="isAuthorized"></consequences>
            </div>
        </md-layout>

        <!-- Edit Dialog -->
        <md-dialog ref="editFatePointsDialog">
            <md-dialog-title>Edit Fate Points</md-dialog-title>
            <md-dialog-content>
                <md-input-container>
                    <label>Refresh</label>
                    <md-input type="number" v-model="fpEdit"></md-input>
                </md-input-container>
            </md-dialog-content>

            <md-dialog-actions>
                <md-button class="md-primary" @click.native="closeEditFatePoints()">Cancel</md-button>
                <md-button class="md-accent" @click.native="closeEditFatePoints(true)">Save</md-button>
            </md-dialog-actions>
        </md-dialog>
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss">
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

        #stress-consequences-layout,
        #aspects-skills-layout {
            margin-top: -8px;

            @media(min-width: 1000px) {
                flex-wrap: nowrap;
            }

            #stress-layout,
            #aspects-layout {
                display: flex;
                flex: 0 0 0%;
                width: auto;
                min-width: 300px;
                margin: 8px;

                @media(max-width: 599px)
                {
                    flex: 1 1 auto;
                }
            }

            #stress-layout {
                flex: 0 1 auto;
            }

            #consequences-layout,
            #skills-layout {
                display: flex;
                flex: 1 1 auto;
                width: auto;
                min-width: 275px;
                margin: 8px;
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

    // Managers
    import authMan from '../../../client/api/managers/auth';
    import charMan from '../../../client/api/managers/character';
    import sysCharMan from '../../../client/api/managers/sysCharacter';

    // Components
    import RollsComponent from './rolls.vue';
    import AspectsComponent from './aspects.vue';
    import SkillsComponent from './skills.vue';
    import ExtrasComponent from './extras.vue';
    import StuntsComponent from './stunts.vue';
    import StressComponent from './stress.vue';
    import ConsequencesComponent from './consequences.vue';
    import PortraitComponent from '../../../client/components/portrait.vue';

    //------------------------------------------------------------------------------------------------------------------

    export default {
        components: {
            rolls: RollsComponent,
            portrait: PortraitComponent,
            aspects: AspectsComponent,
            skills: SkillsComponent,
            extras: ExtrasComponent,
            stunts: StuntsComponent,
            stress: StressComponent,
            consequences: ConsequencesComponent
        },
        subscriptions: {
            account: authMan.account$,
            baseChar: charMan.selected$,
            character: sysCharMan.selected$
        },
        data()
        {
            return {
                state: stateSvc.state,
                fpEdit: undefined
            };
        },
        computed: {
            isAuthorized(){ return _.get(this.account, 'email', 'nope!') === this.baseChar.owner; },
        },
        methods: {
            refreshFatePoints()
            {
                this.character.fatePoints.current = Math.max(this.character.fatePoints.current, this.character.fatePoints.refresh);
            },
            openEditFatePoints()
            {
                this.fpEdit = this.character.fatePoints.refresh;

                // Open the dialog
                this.$refs.editFatePointsDialog.open();
            },
            closeEditFatePoints(save)
            {
                if(save)
                {
                    this.character.fatePoints.refresh = this.fpEdit;
                } // end if

                this.fpEdit = this.character.fatePoints.refresh;

                // Close the dialog
                this.$refs.editFatePointsDialog.close();
            }
        }
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
