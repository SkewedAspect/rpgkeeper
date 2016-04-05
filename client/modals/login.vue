<template>
    <modal v-ref:modal :backdrop="'static'" :keyboard="false" :width="'400px'">
        <div class="modal-header" slot="header">
            <h4 class="modal-title">
                <i class="fa fa-sign-in"></i>
                Please Sign In
            </h4>
        </div>
        <div class="modal-body text-center" slot="body">
            <alert v-if="loginFailure" type="danger" :on-closed="errorDismissed">
                <strong>Login Failure</strong>. Please try again.
            </alert>
            <form class="form-signin">
                <label for="inputEmail" class="sr-only">Email address</label>
                <input type="email" id="inputEmail" class="form-control" placeholder="Email address" required autofocus v-model="loginForm.email">
                <label for="inputPassword" class="sr-only">Password</label>
                <input type="password" id="inputPassword" class="form-control" placeholder="Password" required v-model="loginForm.password">
                <div class="checkbox text-left" style="margin-bottom: 0">
                    <label>
                        <input type="checkbox" v-model="loginForm.remember"> Remember me
                    </label>
                </div>
            </form>
        </div>
        <div class="modal-footer" slot="footer">
            <button type="button"
                    class="btn btn-primary"
                    @click="login()">
                <i class="fa fa-sign-in"></i>
                Sign In
            </button>
            <button type="button"
                    class="btn btn-secondary"
                    @click="$refs.modal.hideModal()">
                <i class="fa fa-times"></i>
                Cancel
            </button>
        </div>
    </modal>
</template>

<style lang="sass" rel="stylesheet/scss">
    .form-signin {
        max-width: 330px;
        padding: 15px;
        margin: 0 auto;

        .form-signin-heading,
        .checkbox {
            margin-bottom: 10px;
        }

        .checkbox {
            font-weight: normal;
        }

        .form-control {
            position: relative;
            height: auto;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            padding: 10px;
            font-size: 16px;
        }

        .form-control:focus {
            z-index: 2;
        }

        input[type="email"] {
            margin-bottom: -1px;
            border-bottom-right-radius: 0;
            border-bottom-left-radius: 0;
        }

        input[type="password"] {
            margin-bottom: 10px;
            border-top-left-radius: 0;
            border-top-right-radius: 0;
        }
    }

</style>

<script type="text/babel">
    import _ from 'lodash';
    import { alert, modal } from 'vueboot';

    import errors from '../components/errors/errors';
    import authSvc from '../services/auth/auth';

    export default {
        components: {
            alert,
            modal
        },
        data: function()
        {
            return {
                loginFailure: false,
                loginForm: {
                    remember: false,
                    email: "",
                    password: ""
                }
            };
        },
        methods: {
            show: function()
            {
                this.$refs.modal.showModal();
            },
            hide: function()
            {
                this.$refs.modal.hideModal();
            },
            login: function()
            {
                authSvc.login(this.loginForm)
                    .then(() =>
                    {
                        this.hide();
                    })
                    .catch(errors.LoginFailure, () =>
                    {
                        this.loginFailure = true;
                    });
            },
            errorDismissed()
            {
                this.loginFailure = false;
            }
        }
    }
</script>