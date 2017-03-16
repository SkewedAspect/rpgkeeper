<!--------------------------------------------------------------------------------------------------------------------->
<!-- Main Application Dashboard                                                                                      -->
<!--------------------------------------------------------------------------------------------------------------------->

<template>
    <div id="dashboard" class="container">
        <md-layout md-gutter="16">

            <!-- Campaigns -->
            <!--md-layout md-flex-small="100" md-flex-medium="50">
                <md-card v-flex="1">
                    <md-toolbar class="md-dense">
                        <h2 class="md-title" v-flex="1">Campaigns</h2>

                        <md-input-container md-inline v-flex="1">
                            <md-icon>search</md-icon>
                            <md-input placeholder="Search Campaigns"></md-input>
                        </md-input-container>

                        <md-menu md-direction="bottom left">
                            <md-button class="md-icon-button" md-menu-trigger>
                                <md-icon>filter_list</md-icon>
                            </md-button>

                            <md-menu-content>
                                <md-menu-item>Filters</md-menu-item>
                                <md-menu-item>Go</md-menu-item>
                                <md-menu-item>Here</md-menu-item>
                            </md-menu-content>
                        </md-menu>
                    </md-toolbar>

                    <md-card-content v-flex="1">
                        Not implemented, yet.
                    </md-card-content>

                    <md-card-actions>
                        <md-button :disabled="true">New Campaign</md-button>
                    </md-card-actions>
                </md-card>
            </md-layout-->

            <!-- Characters -->
            <md-layout md-flex-small="100">
                <md-card v-flex="1">
                    <md-toolbar class="md-dense">
                        <h2 class="md-title" v-flex="1">Characters</h2>

                        <md-input-container md-inline v-flex="1">
                            <md-icon>search</md-icon>
                            <md-input v-model="charFilter" placeholder="Search Characters"></md-input>
                        </md-input-container>

                        <md-menu md-direction="bottom left" md-size="7">
                            <md-button class="md-icon-button" :class="{ 'md-accent': !!systemFilter }" md-menu-trigger>
                                <md-icon>filter_list</md-icon>
                            </md-button>

                            <md-menu-content>
                                <md-menu-item :class="{ 'md-accent': systemFilter == system.id }"
                                              v-for="system in systems" @click.native="setSystemFilter(system.id)">
                                    {{ system.name }}
                                </md-menu-item>
                            </md-menu-content>
                        </md-menu>
                    </md-toolbar>

                    <md-card-content v-flex="1">
                        <md-list class="md-triple-line">
                            <md-list-item v-for="char in characters" @click.native="goTo(`/characters/${ char.id }`)">
                                <md-avatar>
                                    <img :src="char.thumbnail">
                                </md-avatar>

                                <div class="md-list-text-container">
                                    <span>{{ char.name }}</span>
                                    <i>{{ char.campaign || char.system.name }}</i>
                                    <p>{{ char.description }}</p>
                                </div>

                                <md-button class="md-icon-button md-list-action" @click.native.prevent.stop="confirmDeleteCharacter(char)">
                                    <md-icon class="md-warn">delete</md-icon>
                                </md-button>
                            </md-list-item>
                        </md-list>
                    </md-card-content>

                    <md-card-actions>
                        <md-button @click.native="openNewCharacter()">New Character</md-button>
                    </md-card-actions>
                </md-card>
            </md-layout>
        </md-layout>

        <!-- Modals -->
        <md-dialog id="new-character-modal"  ref="newCharModal">
            <md-dialog-title>New Character</md-dialog-title>

            <md-dialog-content>
                <md-input-container :class="{ 'md-input-invalid': !newChar.name }">
                    <label>Name</label>
                    <md-input v-model="newChar.name" required></md-input>
                    <span class="md-error">Name is required</span>
                </md-input-container>
                <md-input-container  :class="{ 'md-input-invalid': !newChar.system }">
                    <label>System</label>
                    <md-select name="system" id="system" v-model="newChar.system" required>
                        <md-option :value="system.id" v-for="system in systems">{{ system.name }}</md-option>
                    </md-select>
                    <span class="md-error">System is required</span>
                </md-input-container>
                <md-input-container>
                    <label>Description</label>
                    <md-input v-model="newChar.description"></md-input>
                </md-input-container>
                <md-input-container>
                    <label>Biography</label>
                    <md-textarea v-model="newChar.biography"></md-textarea>
                </md-input-container>
                <md-input-container v-flex="grow">
                    <label>Thumbnail</label>
                    <md-input v-model="newChar.thumbnail"></md-input>
                </md-input-container>
                <md-input-container>
                    <label>Portrait</label>
                    <md-input v-model="newChar.portrait"></md-input>
                </md-input-container>
            </md-dialog-content>

            <md-dialog-actions>
                <md-button class="md-primary" @click.native="closeNewCharacter()">Cancel</md-button>
                <md-button class="md-primary"
                           :class="{ 'md-raised md-accent': newCharValid }"
                           @click.native="closeNewCharacter(true)"
                           :disabled="!newCharValid">
                    Save
                </md-button>
            </md-dialog-actions>
        </md-dialog>

        <!-- Delete Character confirmation -->
        <md-dialog-confirm
            md-title="Delete Character"
            :md-content="`Are your sure you want to delete this character: '${ delChar.name }'?`"
            md-ok-text="Delete"
            md-cancel-text="Cancel"
            @close="onConfirmDeleteClosed"
            ref="deleteChar">
        </md-dialog-confirm>
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style rel="stylesheet/scss" lang="sass">
    #new-character-modal {
        .md-dialog {
            min-width: 60%;
        }
    }

    #dashboard {
        padding: 16px;

        .md-card {
            margin-top: 8px;
            margin-bottom: 8px;
        }

        .md-toolbar {
            .md-input-container {
                .md-icon {
                    &:after {
                        background-color: transparent;
                    }
                }
            }
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script>
    //------------------------------------------------------------------------------------------------------------------

    import _ from 'lodash';
    import Promise from 'bluebird';

    import stateSvc from '../../services/state';
    import systemSvc from '../../services/system';
    import charSvc from '../../services/character';
    
    //------------------------------------------------------------------------------------------------------------------

    export default {
        data()
        {
            return {
                state: stateSvc.state,
                charFilter: '',
                systemFilter: undefined,
                newChar: {
                    name: undefined,
                    system: '',
                    description: '',
                    portrait: '',
                    thumbnail: '',
                    biography: ''
                },
                delChar: {
                    id: undefined,
                    name: undefined
                },
                characterList: []
            };
        },
        computed: {
            systems(){ return _.filter(this.state.systems, (sys) => sys.disabled != true); },
            characters()
            {
                return _(this.characterList)
                    .filter((char) =>
                    {
                        return !char.system.disabled && (!this.systemFilter || char.systemID == this.systemFilter);
                    })
                    .filter((char) =>
                    {
                        return !this.charFilter || _.includes(char.name, this.charFilter);
                    })
                    .value();
            },
            newCharValid()
            {
                return !!this.newChar.name && !!this.newChar.system;
            }
        },
        methods: {
            goTo(path)
            {
                this.$router.push(path);
            },
            setSystemFilter(systemID)
            {
                if(this.systemFilter != systemID)
                {
                    this.systemFilter = systemID;
                }
                else
                {
                    this.systemFilter = undefined;
                } // end if
            },

            clearNewCharacter()
            {
                _.assign(this.newChar, {
                    name: undefined,
                    system: '',
                    description: undefined,
                    portrait: undefined,
                    thumbnail: undefined,
                    biography: undefined
                });
            },
            openNewCharacter()
            {
                this.clearNewCharacter();
                this.$refs.newCharModal.open();
            },
            closeNewCharacter(save)
            {
                const savePromise = save ? charSvc.create(this.newChar) : Promise.resolve();
                return savePromise.then((char) =>
                {
                    this.clearNewCharacter();
                    this.$refs.newCharModal.close();

                    if(char)
                    {
                        this.goTo(`/characters/${ char.id }`);
                    } // end if
                });
            },

            clearDelCharacter()
            {
                _.assign(this.delChar, {
                    name: undefined,
                    id: undefined
                });
            },
            confirmDeleteCharacter(character)
            {
                this.delChar.id = character.id;
                this.delChar.name = character.name;

                this.$refs.deleteChar.open();
            },
            onConfirmDeleteClosed(result)
            {
                let delPromise = Promise.resolve();

                if(result == 'ok')
                {
                    delPromise = charSvc.delete(this.delChar.id)
                        .then(() =>
                        {
                            _.remove(this.characterList, { id: this.delChar.id });
                        });
                } // end if

                return delPromise.then(() =>
                {
                    this.clearDelCharacter();
                });
            }
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
                            this.characterList = characters;
                        });
                });
            });
        }
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->