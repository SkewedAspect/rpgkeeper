<template>
    <nav id="site-header" class="navbar navbar-fixed-top navbar-dark bg-inverse">
        <button class="navbar-toggler hidden-sm-up" type="button" data-toggle="collapse" data-target="#exCollapsingNavbar2">
            &#9776;
        </button>
        <div class="collapse navbar-toggleable-xs" id="exCollapsingNavbar2">
            <a class="navbar-brand" v-link="{ path: '/' }">
                <img alt="Brand" src="/static/images/logo.png" width="30px" height="30px" style="display: inline-block; margin-top: -5px">
                RPGKeeper
            </a>
            <ul class="nav navbar-nav">
                <li class="nav-item">
                    <a class="nav-link" v-link="{ name: 'dashboard', exact: true }">
                        <i class="fa fa-dashboard"></i> Dashboard
                    </a>
                </li>
            </ul>
            <div class="form-inline navbar-form pull-right">
                <p class="form-control-static">{{ display }}&nbsp;</p>
                <button v-if="!loggedIn" class="btn btn-primary" @click="signIn()">
                    <i class="fa fa-fw fa-envelope-o"></i>
                    <span>Sign In</span>
                </button>
                <button v-if="loggedIn" class="btn btn-primary" @click="signOut()">
                    <i class="fa fa-fw fa-sign-out"></i>
                    <span>Sign Out</span>
                </button>
            </div>
        </div>
    </nav>
</template>

<style lang="sass" src="./header.scss"></style>

<script type="text/babel" lang="es">
    import _ from 'lodash';
    import stateSvc from '../state/stateService.js';
    import personaSvc from '../persona/personaService.js';

    export default {
        data: function()
        {
            return {
                state: stateSvc.state
            };
        },
        computed: {
            loggedIn: function()
            {
                return !!this.state.user;
            },
            display: function()
            {
                return (this.state.user || {}).name || (this.state.user || {}).email;
            }
        },
        methods: {
            signIn: function()
            {
                personaSvc.signIn();
            },
            signOut: function()
            {
                personaSvc.signOut();
            }
        }
    }
</script>