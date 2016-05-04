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
                <button v-if="!loggedIn" class="btn btn-primary" @click="signIn()">
                    <i class="fa fa-fw fa-envelope-o"></i>
                    <span>Sign In</span>
                </button>
                <span v-if="loggedIn">
                    <span style="display: inline-block; vertical-align: middle; margin-right: 10px;">
                        <gravatar class="img-circle" :email="user.email" :size="64" width="32px"></gravatar>
                        {{ display }}
                    </span>
                    <button class="btn btn-primary" @click="signOut()">
                        <i class="fa fa-fw fa-sign-out"></i>
                        <span>Sign Out</span>
                    </button>
                </span>
            </div>
        </div>
    </nav>
    <login-modal v-ref:login-modal></login-modal>
</template>

<style lang="sass" rel="stylesheet/scss">
    #site-header {
    }
</style>

<script type="text/babel" lang="es">
    import _ from 'lodash';
    import authSvc from '../../services/auth/auth';
    import stateSvc from '../state/stateService.js';

    import LoginModal from '../../modals/login.vue';
    import GravatarComponent from '../gravatar/gravatar.vue';

    export default {
        components: {
            gravatar: GravatarComponent,
            loginModal: LoginModal
        },
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
            },
            user: function(){ return this.state.user; }
        },
        methods: {
            signIn: function()
            {
                this.$refs.loginModal.show();
            },
            signOut: function()
            {
                return authSvc.logout();
            }
        },
        ready()
        {
            // We're doing a reset password procedure
            if(this.$route.params.token)
            {
                this.$refs.loginModal.show();
            } // end if
        }
    }
</script>