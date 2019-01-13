<!--------------------------------------------------------------------------------------------------------------------->
<!-- Main Application Dashboard                                                                                      -->
<!--------------------------------------------------------------------------------------------------------------------->

<template>
    <b-container id="dashboard" class="pb-0">
        <b-form-row>
            <!--<b-col cols="12" lg="6" class="mb-3">-->
                <!--<b-card header-bg-variant="dark" header-text-variant="white" class="shadow-sm h-100">-->
                    <!--<template slot="header">-->
                        <!--<div class="d-flex">-->
                            <!--<h5 class="align-items-center d-flex text-nowrap m-0 flex-grow-0 flex-shrink-0 w-auto">-->
                                <!--<font-awesome-icon class="mr-1" icon="books"></font-awesome-icon>-->
                                <!--<span class="d-none d-md-inline">Campaigns</span>-->
                            <!--</h5>-->
                            <!--<b-input-group class="flex-fill ml-2">-->
                                <!--<b-form-input placeholder="Search Campaigns..." disabled></b-form-input>-->
                                <!--<b-input-group-append>-->
                                    <!--<b-btn variant="primary" disabled>-->
                                        <!--<font-awesome-icon icon="search"></font-awesome-icon>-->
                                    <!--</b-btn>-->
                                <!--</b-input-group-append>-->
                            <!--</b-input-group>-->
                            <!--<b-dropdown id="filterSystems" class="ml-2 flex-grow-0 flex-shrink-0 w-auto" right disabled>-->
                                <!--<template slot="button-content">-->
                                    <!--<font-awesome-icon icon="cog"></font-awesome-icon>-->
                                <!--</template>-->

                                <!--<b-dropdown-item>Filter 1</b-dropdown-item>-->
                            <!--</b-dropdown>-->
                        <!--</div>-->
                    <!--</template>-->

                    <!--<h4 class="text-center text-muted mb-0">Campaigns are not implemented.</h4>-->
                <!--</b-card>-->
            <!--</b-col>-->
            <b-col cols="12" class="mb-3">

                <!-- Characters Card -->
                <b-card header-bg-variant="dark" header-text-variant="white" class="shadow-sm h-100" no-body>
                    <template slot="header">
                        <div class="d-flex">
                            <h5 class="align-items-center d-flex text-nowrap m-0 mr-2 flex-grow-0 flex-shrink-0 w-auto">
                                <font-awesome-icon class="mr-1" icon="users"></font-awesome-icon>
                                <span class="d-none d-md-inline">Characters</span>
                            </h5>
                            <b-input-group class="flex-fill ml-auto" style="max-width: 400px">
                                <b-form-input placeholder="Search Characters..."></b-form-input>
                                <b-input-group-append>
                                    <b-btn variant="primary">
                                        <font-awesome-icon icon="search"></font-awesome-icon>
                                    </b-btn>
                                </b-input-group-append>
                            </b-input-group>
                            <b-dropdown id="filterSystems" class="ml-2 flex-grow-0 flex-shrink-0 w-auto" right>
                                <template slot="button-content">
                                    <font-awesome-icon icon="cog"></font-awesome-icon>
                                </template>

                                <b-dropdown-item v-for="(system, index) in systems" :key="system.id">
                                    <b-form-checkbox :id="`checkbox-${ index }`"
                                        v-model="systemsFilter[index]"
                                        :value="system.id"
                                        @click.native.stop>
                                        {{ system.name }}
                                    </b-form-checkbox>
                                </b-dropdown-item>
                                <b-dropdown-divider></b-dropdown-divider>
                                <b-dropdown-item style="pointer-events: none">
                                    <div @click.stop="selectAllSystems()" style="pointer-events: all">
                                        <font-awesome-icon icon="check-square"></font-awesome-icon>
                                        Select All
                                    </div>
                                </b-dropdown-item>
                                <b-dropdown-item style="pointer-events: none">
                                    <div @click.stop="selectNoneSystems()" style="pointer-events: all">
                                        <font-awesome-icon :icon="['far', 'square']"></font-awesome-icon>
                                        Select None
                                    </div>
                                </b-dropdown-item>
                            </b-dropdown>
                        </div>
                    </template>

                    <!-- List of Characters -->
                    <div class="card-body" v-if="charsLoading">
                        <loading></loading>
                    </div>

                    <b-list-group v-else-if="characters.length > 0" flush>
                        <b-list-group-item :to="`/characters/${ char.id }`" v-for="char in characters" :key="char.id">
                            <div class="d-flex">
                                <thumbnail :src="char.thumbnail" :color="char.color" :text="char.initial"></thumbnail>
                                <div class="ml-2 flex-column d-flex justify-content-center flex-fill">
                                    <h5 class="mb-1">
                                        {{ char.name }}
                                    </h5>
                                    <p class="text-muted m-0" v-if="char.description">{{ char.description }}</p>
                                </div>
                                <div class="mr-2 flex-column d-flex justify-content-center flex-nowrap" style="flex: 0 0 auto">
                                    <b-button-close title="Edit User" @click.prevent.stop="openAddEditModal(char)">
                                        <font-awesome-icon icon="user-edit"></font-awesome-icon>
                                    </b-button-close>
                                </div>
                                <div class="ml-2 flex-column d-flex justify-content-center flex-nowrap" style="flex: 0 0 auto">
                                    <b-button-close title="Delete Character" @click.prevent.stop="openDelCharacter(char)">
                                        <font-awesome-icon icon="trash-alt"></font-awesome-icon>
                                    </b-button-close>
                                </div>
                            </div>
                        </b-list-group-item>
                    </b-list-group>

                    <div class="card-body" v-else>
                        <h6 class="text-center text-muted">No Characters found.</h6>
                    </div>

                    <div class="card-body text-right">
                        <b-btn variant="primary" @click="openAddEditModal()">
                            <font-awesome-icon icon="user-plus"></font-awesome-icon>
                            New Character
                        </b-btn>
                    </div>
                </b-card>
            </b-col>
        </b-form-row>

        <!-- Modals -->
        <add-edit-modal v-model="addEditChar" @hidden="onAddEditHidden"></add-edit-modal>
        <delete-modal v-model="delChar" @hidden="onDeleteHidden"></delete-modal>
    </b-container>
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
    import Loading from '../components/ui/loading.vue';
    import AddEditModal from '../components/character/addEditModal.vue';
    import DeleteModal from '../components/character/deleteModal.vue';
    import Thumbnail from '../components/character/thumbnail.vue';

    //------------------------------------------------------------------------------------------------------------------

    export default {
        name: 'DashboardPage',
        components: {
            AddEditModal,
            DeleteModal,
            Loading,
            Thumbnail
        },
        subscriptions: {
            account: authMan.account$,
            allSystems: systemsMan.systems$,
            characterList: characterMan.characters$,
            systemsStatus: systemsMan.status$
        },
        computed: {
            charsLoading(){ return this.systemsStatus !== 'loaded'; },
            systems(){ return _.filter(this.allSystems, (sys) => sys.disabled !== true); },
            characters()
            {
                return _(this.characterList)
                    .filter({ account_id: (this.account || {}).id })
                    .filter((char) =>
                    {
                        const systemValid = _.includes(this.systemsFilter, char.system);
                        return !systemsMan.getSystem(char.system).disabled && systemValid;
                    })
                    .filter((char) =>
                    {
                        return !this.charFilter || _.includes(char.name, this.charFilter);
                    })
                    .value();
            }
        },
        methods: {
            getSystem(systemID)
            {
                return _.find(this.systems, { id: systemID });
            },

            selectAllSystems()
            {
                this.systemsFilter = [].concat(this.systems.map((s) => s.id));
            },
            selectNoneSystems()
            {
                this.systemsFilter = [];
            },

            // Add/Edit Modal
            async openAddEditModal(char)
            {
                // If we don't have a character, we build once from scratch.
                if(!char)
                {
                    char = await characterMan.create({});
                } // end if

                this.addEditChar = char;
            },
            onAddEditHidden()
            {
                // We just need to clear this when the modal is hidden.
                this.addEditChar = undefined;
            },

            // Delete Modal
            openDelCharacter(char)
            {
                this.delChar = char;
            },
            onDeleteHidden()
            {
                // We just need to clear this when the modal is hidden.
                this.delChar = undefined;
            }
        },
        data()
        {
            return {
                charFilter: '',
                systemsFilter: [],
                addEditChar: undefined,
                delChar: undefined
            };
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

                this.selectAllSystems();
            });
        }
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
