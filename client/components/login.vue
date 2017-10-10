<!--------------------------------------------------------------------------------------------------------------------->
<!-- Login Component                                                                                                 -->
<!--------------------------------------------------------------------------------------------------------------------->

<template>
    <div id="login-comp">
        <!-- User Button -->
        <md-button v-if="account" class="settings" @click="goToSettings()">
            <md-avatar>
                <img :src="accountAvatar" alt="People">
            </md-avatar>
            <span class="hidden-xs-down">
                    {{ accountName }}
                </span>
        </md-button>

        <!-- Loading Bar -->
        <md-progress v-else-if="loading" class="md-accent" md-indeterminate></md-progress>

        <!-- SignIn Button -->
        <div v-else class="g-signin2" data-onsuccess="onGoogleSignIn" data-onfailure="onGoogleFailure" data-theme="dark"></div>
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss">
    #login-comp {
		display: inline-block;
        min-width: 150px;

		.g-signin2 {
			display: inline-block;
			text-align: center;
			margin-left: auto;
			margin-right: auto;
		}

		.settings {
			text-transform: none;

			@media(max-width: 575px)
			{
				padding: 4px;
				min-width: 50px;
			}
		}
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script>
    //------------------------------------------------------------------------------------------------------------------

	// Managers
    import authMan from '../api/managers/auth';

    //------------------------------------------------------------------------------------------------------------------

    export default {
        subscriptions: {
            account: authMan.account$,
            authStatus: authMan.status$
        },
		computed: {
            loading(){ return this.authStatus === 'signing in'; },
			accountName()
			{
				return this.account.displayName || this.account.email;
			},
			accountAvatar()
			{
				const id = this.account.id.replace(/-/g, '');
				return this.account.avatar || `https://identicons.github.com/${ id }.png`;
			}
		},
		methods: {
			goToSettings()
			{
				this.$router.push('/settings');
			}
		}
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
