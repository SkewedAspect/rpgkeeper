<!--------------------------------------------------------------------------------------------------------------------->
<!-- Login Component                                                                                                 -->
<!--------------------------------------------------------------------------------------------------------------------->

<template>
    <div id="login-comp">
		<span v-if="!account">
            <div v-if="!signingIn" class="g-signin2" data-onsuccess="onGoogleSignIn" data-onfailure="onGoogleFailure" data-theme="dark"></div>
            <spinner v-else :color="'#FF9800'"></spinner>
		</span>
		<div v-else>
			<md-button class="settings" @click="goToSettings()">
				<md-avatar>
					<img :src="accountAvatar" alt="People">
				</md-avatar>
				<span class="hidden-xs-down">
                    {{ accountName }}
                </span>
			</md-button>
		</div>
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss">
    #login-comp {
		display: inline-block;

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

	import stateSvc from '../services/state';
	import authSvc from '../services/auth';
	import accountSvc from '../services/account';
	import spinkit from '../components/spinkit';

    //------------------------------------------------------------------------------------------------------------------

    export default {
		components: {
			spinner: spinkit.wave
		},
		data: function()
		{
			return {
				state: stateSvc.state,
				signingIn: false
			};
		},
		computed: {
			account()
			{
				return this.state.account;
			},
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
			onGoogleSignIn(googleUser)
			{
				this.signingIn = true;
				const idToken = googleUser.getAuthResponse().id_token;

				authSvc.login(idToken)
					.then(() => { this.signingIn = false; });
			},
			onGoogleFailure()
			{
			    console.warn('Google login failed.');
			},
			goToSettings()
			{
				this.$router.push('/settings');
			}
		},
		created()
		{
			// We have to do this, because it seems google doesn't like vue's binding system.
			// If you have a better suggestion, I'm open to ideas, but this works.
			window.onGoogleSignIn = this.onGoogleSignIn;
			window.onGoogleFailure = this.onGoogleFailure;
		}
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
