<!--------------------------------------------------------------------------------------------------------------------->
<!-- Main Application Dashboard                                                                                      -->
<!--------------------------------------------------------------------------------------------------------------------->

<template>
    <div id="dashboard" class="container">
        <md-layout md-gutter="16">

            <!-- Campaigns -->
            <md-layout md-flex-small="100" md-flex-medium="50">
                <md-card style="flex: 1">
                    <md-toolbar class="md-dense">
                        <h2 class="md-title" style="flex: 1">Campaigns</h2>

                        <md-input-container md-inline style="flex: 1">
                            <md-input placeholder="Filter"></md-input>
                        </md-input-container>

                        <md-icon style="margin: 8px">search</md-icon>
                    </md-toolbar>

                    <md-card-content style="flex: 1">
                        Not implemented, yet.
                    </md-card-content>

                    <md-card-actions>
                        <md-button :disabled="true">New Campaign</md-button>
                    </md-card-actions>
                </md-card>
            </md-layout>

            <!-- Characters -->
            <md-layout md-flex-small="100" md-flex-medium="50">
                <md-card style="flex: 1">
                    <md-toolbar class="md-dense">
                        <h2 class="md-title" style="flex: 1">Characters</h2>

                        <md-input-container md-inline style="flex: 1">
                            <md-input placeholder="Filter"></md-input>
                        </md-input-container>

                        <md-icon style="margin: 8px">search</md-icon>
                    </md-toolbar>

                    <md-card-content style="flex: 1">
                        <md-list class="md-triple-line">
                            <md-list-item v-for="char in characters" :href="`/characters/${ char.id }`">
                                <md-avatar>
                                    <img :src="char.thumbnail">
                                </md-avatar>

                                <div class="md-list-text-container">
                                    <span>{{ char.name }}</span>
                                    <i>{{ char.campaign || char.system.name }}</i>
                                    <p>{{ char.description }}</p>
                                </div>

                                <md-button class="md-icon-button md-list-action">
                                    <md-icon class="md-warn">delete</md-icon>
                                </md-button>
                            </md-list-item>
                        </md-list>
                    </md-card-content>

                    <md-card-actions>
                        <md-button>New Character</md-button>
                    </md-card-actions>
                </md-card>
            </md-layout>
        </md-layout>
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style rel="stylesheet/scss" lang="sass">
    #dashboard {
        padding: 16px;

        .md-card {
            margin-top: 8px;
            margin-bottom: 8px;
        }

        .md-toolbar {

            // FIXME: This will only work for the current theme...
            .md-input-container {
                color: white !important;

                input {
                    color: white !important;

                    &::-webkit-input-placeholder {
                        color: rgba(200, 200, 200, .87);
                    }
                }

                &:after {
                    background-color: rgba(200, 200, 200, .87);
                }
            }
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script>
    //------------------------------------------------------------------------------------------------------------------

    import systemSvc from '../../services/system';
    import charSvc from '../../services/character';
    
    //------------------------------------------------------------------------------------------------------------------

    export default {
        data()
        {
            return {
                characters: []
            };
        },
        mounted()
        {
            this.$nextTick(() =>
            {
                // Get the list of systems
                systemSvc.loading.then(() =>
                {
                    // Get a list of characters
                    return charSvc.refresh()
                        .then((characters) =>
                        {
                            this.characters = characters;
                        });
                });
            });
        }
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->