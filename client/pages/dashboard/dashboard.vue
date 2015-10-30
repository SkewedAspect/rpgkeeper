<template>
    <div id="dashboard" class="container">
        <!-- If the user isn't authenticated, we don't let them see anything. -->
        <div v-if="!isAuthenticated" class="text-center">
            <h4>You are not currently signed in.</h4>
            <p>Please sign in using the orange <i class="fa fa-envelope-o text-primary"></i> button in the upper right.</p>
        </div>

        <!-- If they are, we show them a list of their characters -->
        <div v-else>
            <div id="characters" class="card">
                <div class="card-header clearfix">
                    <div class="row">
                        <div class="col-xs-4 col-md-6">
                            <h3 class="card-title" style="line-height: 1.4em;">
                                <i class="fa fa-user"></i> Characters
                            </h3>
                        </div>
                        <div class="col-xs-8 col-md-6">
                            <div class="input-group">
                                <span class="input-group-addon" id="search-characters"><i class="fa fa-search"></i></span>
                                <input type="text" class="form-control" placeholder="Search Characters" aria-describedby="search-characters" v-model="searchFilter">
                            <span class="input-group-btn">
                                <button class="btn btn-primary" @click="addChar()">
                                    <i class="fa fa-user-plus"></i> Add
                                </button>
                            </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="characters.length == 0" class="card-block">
                    <h4 class="text-center">No Characters, yet.</h4>
                </div>
                <div v-else class="list-group">
                    <a href="/characters/{{ char.id }}" class="list-group-item" v-for="char in characters | filterBy searchFilter | orderBy 'system' | orderBy 'name'">
                        <div class="btn-toolbar pull-right">
                            <button class="btn btn-primary" @click.stop="editChar(char)"><i class="fa fa-edit"></i> Edit</button>
                            <button class="btn btn-danger" @click.stop="deleteChar(char)"><i class="fa fa-trash-o"></i> Delete</button>
                        </div>
                        <img class="img-thumbnail hidden-xs" :src="char.thumbnail">
                        <h4 class="list-group-item-heading">{{ char.name }} <small>({{ char.fullSystem.name }})</small></h4>
                        <p class="list-group-item-text"><i>{{ char.description }}</i>&nbsp;</p>
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" src="./dashboard.scss"></style>

<script type="text/babel">
    import _ from 'lodash';

    import stateSvc from '../../components/state/stateService';
    import routerSvc from '../../components/router/routerService';
    import charSvc from '../../components/character/characterService.js';
    import systemsSvc from '../../components/systems/systemsService';

    export default {
        data: function()
        {
            return {
                searchFilter: "",
                characters: [],
                state: stateSvc.state
            };
        },
        computed: {
            user: function(){ return this.state.user; },
            isAuthenticated: function()
            {
                return !!this.user;
            }
        },
        methods: {
            refreshCharList: function()
            {
                if(this.user)
                {
                    charSvc.listByEmail(this.user.email)
                        .then((characters) =>
                        {
                            this.characters = characters;
                        });
                } // end if
            }
        },
        watch: {
            user: function(){ this.refreshCharList() }
        },
        ready: function()
        {
            this.refreshCharList();
        }
    }
</script>