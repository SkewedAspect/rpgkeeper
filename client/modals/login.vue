<template>
    <modal v-ref:modal :backdrop="'static'" :keyboard="false" :width="'400px'">
        <div class="modal-header" slot="header">
            <h4 class="modal-title">
                <i class="fa" :class="{ 'fa-sign-in': mode == 'login', 'fa-plus': mode == 'register', 'fa-question': mode == 'forgot' }"></i>
                <span v-if="mode == 'login'">Please Sign In</span>
                <span v-if="mode == 'forgot'">Forgot Password</span>
                <span v-if="mode == 'register'">New User Registration</span>
            </h4>
        </div>
        <div class="modal-body text-center" slot="body">
            <!-- Top Links -->
            <div class="text-left" style="margin-bottom: 15px;">
                <a v-if="mode != 'login'" @click="loginMode()"><i class="fa fa-arrow-left"></i> Back</a>
            </div>

            <!-- Alerts -->
            <alert v-if="loginFailure" type="danger" :on-closed="errorDismissed">
                <strong>Login Failure</strong>. Please try again.
            </alert>
            <alert v-if="passwordMismatch" type="danger" :on-closed="errorDismissed">
                <strong>Password Mismatch</strong>. The passwords you entered do not match.
            </alert>
            <alert v-if="userExists" type="danger" :on-closed="errorDismissed">
                <strong>User Already Exists</strong>. Please use a different email address, or try to recover your password.
            </alert>

            <!-- Login Form -->
            <form v-if="mode == 'login'" class="form-signin">
                <label for="inputEmail" class="sr-only">Email address</label>
                <input type="email" id="inputEmail" class="form-control" placeholder="Email address" required autofocus v-model="loginForm.email">
                <label for="inputPassword" class="sr-only">Password</label>
                <input type="password" id="inputPassword" class="form-control" placeholder="Password" required v-model="loginForm.password" @keyup.enter="login()">
                <div class="checkbox text-left" style="margin-bottom: 0">
                    <label>
                        <input type="checkbox" v-model="loginForm.remember"> Remember me
                    </label>
                </div>
            </form>

            <!-- Register Form -->
            <form v-if="mode == 'register'" class="text-left">
                <div class="form-group" :class="{ 'has-danger': !this.emailValid && loginForm.email, 'has-success': this.emailValid && loginForm.email }">
                    <label for="inputEmail" class="sr-only">Email address</label>
                    <input type="email" id="inputEmail"
                           class="form-control"
                           :class="{ 'form-control-danger': !this.emailValid && loginForm.email, 'form-control-success': this.emailValid && loginForm.email }"
                           placeholder="Email address"
                           required
                           autofocus
                           v-model="loginForm.email">
                    <div class="text-right">
                        <small class="text-muted text-help">
                            Emails must be in the form <code>foo@web.site</code>.
                        </small>
                    </div>
                </div>
                <div class="form-group" :class="{ 'has-danger': !this.passwordValid && loginForm.password, 'has-success': this.passwordValid && loginForm.password }">
                    <label for="inputPassword" class="sr-only">Password</label>
                    <input type="password" id="inputPassword"
                           class="form-control"
                           :class="{ 'form-control-danger': !this.passwordValid && loginForm.password, 'form-control-success': this.passwordValid && loginForm.password }"
                           placeholder="Password"
                           required
                           v-model="loginForm.password">
                    <div class="text-right">
                        <small class="text-muted text-help">
                            Passwords must be at least 6 characters long.
                        </small>
                    </div>
                </div>
                <div class="form-group":class="{ 'has-danger': !this.passwordsMatch && loginForm.password2, 'has-success': this.passwordsMatch && loginForm.password2 }">
                    <label for="inputPassword2" class="sr-only">Retype Password</label>
                    <input type="password" id="inputPassword2"
                           class="form-control"
                           :class="{ 'form-control-danger': !this.passwordsMatch && loginForm.password2, 'form-control-success': this.passwordsMatch && loginForm.password2 }"
                           placeholder="Retype Password"
                           required
                           v-model="loginForm.password2">
                    <div class="text-right">
                        <small class="text-muted text-help">
                            Passwords must match.
                        </small>
                    </div>
                </div>

                <!-- reCAPTCHA -->
                <vue-recaptcha class="recaptcha" @verify="onVerify" @expired="onExpired" :key="reCaptchaOpts.sitekey"></vue-recaptcha>
            </form>

            <!-- Bottom Links -->
            <div class="text-right">
                <a v-if="mode == 'login'" @click="forgotMode()">Forgot Password</a><br/>
                <a v-if="mode == 'login'" @click="registerMode()">Register</a>
            </div>
        </div>
        <div class="modal-footer" slot="footer">
            <button type="button"
                    v-if="mode == 'login'"
                    class="btn btn-primary"
                    :disabled="!loginForm.email || !loginForm.password"
                    @click="login()">
                <i class="fa fa-sign-in"></i>
                Sign In
            </button>
            <button type="button"
                    v-if="mode == 'register'"
                    class="btn btn-success"
                    @click="register()"
                    :disabled="!emailValid || !passwordValid || !recaptchaValid || !passwordsMatch">
                <i class="fa fa-save"></i>
                Register
            </button>
            <button type="button"
                    class="btn btn-secondary"
                    @click="hide()">
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

    .recaptcha {
        text-align: center;

        div > div {
            margin: 0 auto;
        }
    }
</style>

<script type="text/babel">
    import _ from 'lodash';
    import { alert, modal } from 'vueboot';
    import VueRecaptcha from 'vue-recaptcha';

    import errors from '../components/errors/errors';
    import authSvc from '../services/auth/auth';

    export default {
        components: {
            alert,
            modal,
            VueRecaptcha
        },
        data: function()
        {
            return {
                mode: 'login',

                loginFailure: false,
                passwordMismatch: false,
                userExists: false,
                captchaInvalid: false,

                loginForm: {
                    remember: false,
                    email: "",
                    password: "",
                    password2: undefined,
                    recaptcha: undefined
                },
                reCaptchaOpts: {
                    sitekey: '6LeE2R0TAAAAALRIVO4e8U_NGLn-5aPtolvbbgHH'
                }
            };
        },
        computed: {
            emailValid()
            {
                var re = /\S+@\S+\.\S+/;
                return re.test(this.loginForm.email);
            },
            passwordValid()
            {
                return this.loginForm.password.length >= 6;
            },
            passwordsMatch()
            {
                return !_.isEmpty(this.loginForm.password) && this.loginForm.password == this.loginForm.password2;
            },
            recaptchaValid()
            {
                return this.loginForm.recaptcha !== undefined;
            }
        },
        methods: {
            show: function()
            {
                this.mode = 'login';
                this.$refs.modal.showModal();
            },
            hide: function()
            {
                this.clearForm();
                this.$refs.modal.hideModal();
            },
            login: function()
            {
                return authSvc.login(this.loginForm)
                    .then(() =>
                    {
                        this.hide();
                    })
                    .catch(errors.LoginFailure, () =>
                    {
                        this.loginFailure = true;
                    });
            },
            register: function()
            {
                return authSvc.register(this.loginForm)
                    .then(() =>
                    {
                        delete this.loginForm.password2;
                        return this.login();
                    })
                    .catch(errors.CaptchaValidation, () =>
                    {
                        this.loginForm.recaptcha = undefined;
                        window.grecaptcha.reset();
                        this.captchaInvalid = true;
                    })
                    .catch(errors.PasswordMismatch, () =>
                    {
                        this.passwordMismatch = true;
                    })
                    .catch(errors.UserExists, () =>
                    {
                        this.userExists = true;
                    });
            },
            errorDismissed()
            {
                this.loginFailure = false;
                this.passwordMismatch = false;
                this.userExists = false;
                this.captchaInvalid = false;
            },
            loginMode()
            {
                this.mode = 'login';
            },
            registerMode()
            {
                this.mode = 'register';
            },
            forgotMode()
            {
                this.mode = 'forgot';
            },
            clearForm()
            {
                this.errorDismissed();
                this.loginForm.email = "";
                this.loginForm.password = "";
                this.loginForm.password2 = undefined;
                this.loginForm.recaptcha = undefined;
                this.loginForm.remember = false;
            },
            onVerify: function(response)
            {
                this.loginForm.recaptcha = response;
            },
            onExpired: function()
            {
                this.loginForm.recaptcha = undefined;
            }
        }
    }
</script>