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
                            <md-input v-flex="'max'" v-model="charFilter" placeholder="Search Characters"></md-input>
                            <md-select v-flex="'min'" name="users" id="users" multiple v-model="systemsFilter" style="min-width: 48px">
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

        <!-- New Char Modal -->
        <add-modal ref="newCharModal" @saved="onNewCharSaved"></add-modal>

        <!-- Edit Character Modal -->
        <edit-modal :char="editChar" ref="editCharModal" @save="onEditSaved" @cancel="onEditCanceled"></edit-modal>

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

    // Managers
    import authMan from '../api/managers/auth';
    import systemsMan from '../api/managers/systems';
    import characterMan from '../api/managers/character';

    // Components
    import Portrait from '../components/character/portrait.vue';
    import AddModal from '../components/character/add.vue';
    import EditModal from '../components/character/edit.vue';

    //------------------------------------------------------------------------------------------------------------------

    export default {
        name: 'DashboardPage',
        components: {
            AddModal,
            EditModal,
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
                charFilter: '',
                systemsFilter: [],
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
            }
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
                this.$refs.newCharModal.open();
            },
            onNewCharSaved(char)
            {
                this.goTo(char.url);
            },

            // Edit Modal
            editCharacter(char)
            {
                this.editChar = char;
                this.$refs.editCharModal.open();
            },
            onEditSaved(char)
            {
                characterMan.save(char);
            },
            onEditCanceled(char)
            {
                char.reset();
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
