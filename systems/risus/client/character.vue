<!--------------------------------------------------------------------------------------------------------------------->
<!-- Character Component                                                                                             -->
<!--------------------------------------------------------------------------------------------------------------------->

<template>
    <div id="risus-character" class="container">
        <md-layout md-gutter="16">
            <portrait :src="character.portrait"></portrait>
            <md-layout md-flex-xsmall="100">
                <md-card style="flex: 1">
                    <md-card-content>
                        <md-input-container>
                            <label>Name</label>
                            <md-input v-model="character.name"></md-input>
                        </md-input-container>
                        <md-input-container>
                            <label>Description</label>
                            <md-textarea v-model="character.description"></md-textarea>
                        </md-input-container>
                    </md-card-content>
                </md-card>
            </md-layout>
            <md-layout md-flex="100">
                <md-card style="flex: 1">
                    <md-card-content>
                        <md-list class="md-double-line">
                            <cliche-item  v-for="(cliche, index) in cliches" :cliche="cliche"
                                @deleted="onDeleteCliche(index)"></cliche-item>
                        </md-list>
                    </md-card-content>
                    <md-card-actions>
                        <md-button @click="openNewCliche()">Add Cliche</md-button>
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
                    <label>Textarea</label>
                    <md-textarea v-model="newCliche.tools"></md-textarea>
                </md-input-container>
            </md-dialog-content>

            <md-dialog-actions>
                <md-button class="md-primary" @click="cancelNewCliche()">Cancel</md-button>
                <md-button class="md-primary" @click="saveNewCliche()">Ok</md-button>
            </md-dialog-actions>
        </md-dialog>
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style rel="stylesheet/scss" lang="sass" scoped>
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
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script>
    //------------------------------------------------------------------------------------------------------------------

    import _ from 'lodash';
    import PortraitComponent from '../../../client/components/portrait.vue';

    // Components
    import ClicheComponent from './components/cliche.vue';

    //------------------------------------------------------------------------------------------------------------------

    export default {
        components: {
            portrait: PortraitComponent,
            clicheItem: ClicheComponent
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
                newCliche: {
                    value: undefined,
                    description: undefined,
                    tools: undefined
                }
            };
        },
        computed: {
            cliches()
            {
                return _.sortBy(this.character.cliches, 'value').reverse();
            }
        },
        methods: {
            onDeleteCliche(clicheIndex)
            {
                this.character.cliches.splice(clicheIndex, 1)
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
                this.character.cliches.push(_.cloneDeep(this.newCliche));
                this.clearNewCliche();
                this.$refs.newCliche.close();
            }
        }
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->