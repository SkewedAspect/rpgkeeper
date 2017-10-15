<!--------------------------------------------------------------------------------------------------------------------->
<!-- Main Application Dashboard                                                                                      -->
<!--------------------------------------------------------------------------------------------------------------------->

<template>
    <div id="dashboard" class="container">
        <md-layout v-if="account" md-gutter="16">

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
                            <md-input v-flex="max" v-model="charFilter" placeholder="Search Characters"></md-input>
                            <md-select v-flex="min" name="users" id="users" multiple v-model="systemsFilter" style="min-width: 48px">
                                <md-button class="md-icon-button" md-menu-trigger slot="icon">
                                    <md-icon>filter_list</md-icon>
                                </md-button>

                                <md-subheader>Only these systems:</md-subheader>
                                <md-option :value="system.id" v-for="system in systems" :key="system.id">{{ system.name }}</md-option>
                            </md-select>
                        </md-input-container>
                    </md-toolbar>

                    <md-card-content v-flex="1">
                        <div v-if="charsLoading">
                            <h4 class="text-center">Loading...</h4>
                            <md-progress v-if="systemsStatus !== 'loaded'" class="md-accent" md-indeterminate></md-progress>
                        </div>
                        <md-list v-else class="md-triple-line">
                            <md-list-item v-for="char in characters" @click="goTo(char.url)">
                                <md-avatar class="md-avatar-icon md-large" :style="{ 'background-color': char.ref.color }">
                                    <img :src="char.ref.thumbnail" alt="">
                                    <div class="md-avatar-text">{{ char.ref.initial }}</div>
                                </md-avatar>

                                <div class="md-list-text-container">
                                    <span>{{ char.ref.name }}</span>
                                    <i v-if="char.ref.campaign">{{ char.ref.campaign }} ({{ getSystem(char.ref.system).name }})</i>
                                    <i v-else>{{ getSystem(char.ref.system).name }}</i>
                                    <p>{{ char.ref.description }}</p>
                                </div>

                                <md-button class="md-icon-button md-list-action" @click.prevent.stop="editCharacter(char)">
                                    <md-icon>edit</md-icon>
                                </md-button>
                                <md-button class="md-icon-button md-list-action" @click.prevent.stop="confirmDeleteCharacter(char)">
                                    <md-icon class="md-warn">delete</md-icon>
                                </md-button>

                                <md-divider class="md-inset"></md-divider>
                            </md-list-item>
                        </md-list>
                    </md-card-content>

                    <md-card-actions>
                        <md-button @click="openNewCharacter()">New Character</md-button>
                    </md-card-actions>
                </md-card>
            </md-layout>
        </md-layout>

        <!-- Modals -->
        <md-dialog id="new-character-modal" ref="newCharModal">
            <md-dialog-title>New Character</md-dialog-title>

            <md-dialog-content>
                <md-layout v-flex="grow" md-gutter="16">
                    <md-layout md-flex-xsmall="100" md-flex-medium="50">
                        <md-input-container :class="{ 'md-input-invalid': !newChar.name }">
                            <md-icon>web</md-icon>
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
                    </md-layout>
                    <md-layout md-flex-xsmall="100" md-flex-medium="50">
                        <md-layout md-gutter="16">
                            <md-layout v-flex="grow" md-column>
                                <md-layout v-flex="grow">

                                </md-layout>
                                <md-layout v-flex="shrink">
                                    <md-input-container>
                                        <md-icon>photo</md-icon>
                                        <label>Portrait</label>
                                        <md-input v-model="newChar.portrait"></md-input>
                                    </md-input-container>
                                </md-layout>
                            </md-layout>
                            <md-layout v-flex="shrink">
                                <portrait class="small" :src="newChar.portrait"></portrait>
                            </md-layout>
                        </md-layout>
                    </md-layout>
                </md-layout>
                <md-layout md-gutter="16">
                    <md-layout v-flex="grow" md-gutter="16">
                        <md-layout md-flex-xsmall="100" md-flex="50">
                            <md-input-container>
                                <md-icon>palette</md-icon>
                                <label>Color</label>
                                <md-input type="color" v-model="newChar.color"></md-input>
                            </md-input-container>
                        </md-layout>
                        <md-layout md-flex-xsmall="100" md-flex="50">
                            <md-input-container>
                                <md-icon>photo</md-icon>
                                <label>Thumbnail</label>
                                <md-input v-model="newChar.thumbnail"></md-input>
                            </md-input-container>
                        </md-layout>
                    </md-layout>
                    <md-layout id="thumbnail" v-flex="shrink">
                        <md-avatar class="md-avatar-icon md-large" :style="{ 'background-color': newChar.color }">
                            <img :src="newChar.thumbnail" alt="">
                            <div class="md-avatar-text">{{ newChar.initial }}</div>
                        </md-avatar>
                    </md-layout>
                </md-layout>
                <md-input-container>
                    <md-icon>description</md-icon>
                    <label>Description</label>
                    <md-input v-model="newChar.description"></md-input>
                </md-input-container>
                <md-input-container>
                    <md-icon>subject</md-icon>
                    <label>Biography</label>
                    <md-textarea v-model="newChar.biography"></md-textarea>
                </md-input-container>
            </md-dialog-content>

            <md-dialog-actions>
                <md-button class="md-primary" @click="closeNewCharacter()">Cancel</md-button>
                <md-button class="md-primary"
                           :class="{ 'md-raised md-accent': newCharValid }"
                           @click="closeNewCharacter(true)"
                           :disabled="!newCharValid">
                    Save
                </md-button>
            </md-dialog-actions>
        </md-dialog>

        <md-dialog id="edit-character-modal" ref="editCharModal">
            <md-dialog-title>Edit Character</md-dialog-title>

            <md-dialog-content>
                <md-layout v-flex="grow" md-gutter="16">
                    <md-layout md-flex-xsmall="100" md-flex-medium="50">
                        <md-input-container :class="{ 'md-input-invalid': !editChar.name }">
                            <md-icon>web</md-icon>
                            <label>Name</label>
                            <md-input v-model="editChar.name" required></md-input>
                            <span class="md-error">Name is required</span>
                        </md-input-container>
                        <md-input-container  :class="{ 'md-input-invalid': !editChar.system }">
                            <label>System</label>
                            <md-select name="system" v-model="editChar.system" required>
                                <md-option :value="system.id" v-for="system in systems" disabled>{{ system.name }}</md-option>
                            </md-select>
                            <span class="md-error">System is required</span>
                        </md-input-container>
                    </md-layout>
                    <md-layout md-flex-xsmall="100" md-flex-medium="50">
                        <md-layout md-gutter="16">
                            <md-layout v-flex="grow" md-column>
                                <md-layout v-flex="grow">

                                </md-layout>
                                <md-layout v-flex="shrink">
                                    <md-input-container>
                                        <md-icon>photo</md-icon>
                                        <label>Portrait</label>
                                        <md-input v-model="editChar.portrait"></md-input>
                                    </md-input-container>
                                </md-layout>
                            </md-layout>
                            <md-layout v-flex="shrink">
                                <portrait class="small" :src="editChar.portrait"></portrait>
                            </md-layout>
                        </md-layout>
                    </md-layout>
                </md-layout>
                <md-layout md-gutter="16">
                    <md-layout v-flex="grow" md-gutter="16">
                        <md-layout md-flex-xsmall="100" md-flex="50">
                            <md-input-container>
                                <md-icon>palette</md-icon>
                                <label>Color</label>
                                <md-input type="color" v-model="editChar.color"></md-input>
                            </md-input-container>
                        </md-layout>
                        <md-layout md-flex-xsmall="100" md-flex="50">
                            <md-input-container>
                                <md-icon>photo</md-icon>
                                <label>Thumbnail</label>
                                <md-input v-model="editChar.thumbnail"></md-input>
                            </md-input-container>
                        </md-layout>
                    </md-layout>
                    <md-layout id="thumbnail" v-flex="shrink">
                        <md-avatar class="md-avatar-icon md-large" :style="{ 'background-color': editChar.color }">
                            <img :src="editChar.thumbnail" alt="">
                            <div class="md-avatar-text">{{ editChar.initial }}</div>
                        </md-avatar>
                    </md-layout>
                </md-layout>
                <md-input-container>
                    <md-icon>description</md-icon>
                    <label>Description</label>
                    <md-input v-model="editChar.description"></md-input>
                </md-input-container>
                <md-input-container>
                    <md-icon>subject</md-icon>
                    <label>Biography</label>
                    <md-textarea v-model="editChar.biography"></md-textarea>
                </md-input-container>
            </md-dialog-content>

            <md-dialog-actions>
                <md-button class="md-primary" @click="closeEditCharacter()">Cancel</md-button>
                <md-button class="md-primary"
                           :class="{ 'md-raised md-accent': editCharValid }"
                           @click="closeEditCharacter(true)"
                           :disabled="!editCharValid">
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

<style lang="scss">
    #edit-character-modal,
    #new-character-modal {
        .md-dialog {
            min-width: 80%;
        }

        #thumbnail,
        #portrait {
            @media(max-width: 600px)
            {
                display: none;
            }
        }
    }

    #dashboard {
        padding: 16px;

        .md-card {
            margin-top: 8px;
            margin-bottom: 8px;
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script>
    //------------------------------------------------------------------------------------------------------------------

    import _ from 'lodash';
    import Promise from 'bluebird';

    // Utils
    import utilities from '../../../server/utilities';

    // Managers
    import authMan from '../../api/managers/auth';
    import systemsMan from '../../api/managers/systems';
    import characterMan from '../../api/managers/character';

    // Services
    import stateSvc from '../../services/state';
    import charSvc from '../../services/character';

    // Components
    import Portrait from '../../components/portrait.vue';
    
    //------------------------------------------------------------------------------------------------------------------

    export default {
        name: 'DashboardPage',
        components: {
            Portrait
        },
        subscriptions: {
            account: authMan.account$,
            allSystems: systemsMan.systems$,
            characterList: characterMan.characters$,
            systemsStatus: systemsMan.status$
        },
        data()
        {
            return {
                state: stateSvc.state,
                charFilter: '',
                systemsFilter: [],
                newChar: {
                    name: undefined,
                    system: '',
                    description: '',
                    portrait: '',
                    thumbnail: '',
                    color: '#aaaaaa',
                    biography: '',
                    get initial(){ return (_.get(this.name, '0', '?')).toUpperCase(); }
                },
                editChar: {},
                delChar: {},
            };
        },
        computed: {
            charsLoading(){ return this.systemsStatus !== 'loaded'; },
            systems(){ return _.filter(this.allSystems, (sys) => sys.disabled !== true); },
            characters()
            {
                return _(this.characterList)
                    .filter({ owner: this.account.email })
                    .filter((char) =>
                    {
                        const systemValid = this.systemsFilter.length === 0 || _.includes(this.systemsFilter, char.systemID);
                        return !char.system.disabled && systemValid;
                    })
                    .filter((char) =>
                    {
                        return !this.charFilter || _.includes(char.name, this.charFilter);
                    })
                    .value();
            },
            newCharValid(){ return !!this.newChar.name && !!this.newChar.system; },
            editCharValid(){ return !!this.editChar.name && !!this.editChar.system; }
        },
        methods: {
            goTo(path)
            {
                this.$router.push(path);
            },

            getSystem(systemID)
            {
                return _.find(this.systems, { id: systemID });
            },

            // New Character modal
            openNewCharacter()
            {
                _.assign(this.newChar, {
                    name: undefined,
                    system: '',
                    color: utilities.colorize(utilities.shortID()),
                    description: undefined,
                    portrait: undefined,
                    thumbnail: undefined,
                    biography: undefined
                });

                this.$refs.newCharModal.open();
            },
            closeNewCharacter(save)
            {
                const savePromise = save ? characterMan.save(this.newChar) : Promise.resolve();
                return savePromise.then((char) =>
                {
                    this.$refs.newCharModal.close();

                    if(char)
                    {
                        this.goTo(char.url);
                    } // end if
                });
            },

            // Edit Modal
            editCharacter(char)
            {
                this.editChar = char;
                this.$refs.editCharModal.open();
            },
            closeEditCharacter(save)
            {
                if(save)
                {
                    characterMan.save(this.editChar);
                }
                else
                {
                    this.editChar.reset();
                } // end if

                this.$refs.editCharModal.close();
            },

            // Delete Modal
            confirmDeleteCharacter(character)
            {
                this.delChar = character;
                this.$refs.deleteChar.open();
            },
            onConfirmDeleteClosed(result)
            {
                if(result === 'ok')
                {
                    return characterMan.delete(this.delChar);
                } // end if

                this.delChar = {};
            }
        },
        mounted()
        {
            this.$subscribeTo(authMan.status$, (status) =>
            {
                if(status === 'signed out')
                {
                    // We've finished loading, and we're not signed in
                    this.$router.push('/');
                } // end if
            });
        }
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->