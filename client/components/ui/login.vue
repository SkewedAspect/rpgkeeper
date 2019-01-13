<!--------------------------------------------------------------------------------------------------------------------->
<!-- login                                                                                                         -->
<!--------------------------------------------------------------------------------------------------------------------->

<template>
    <div id="login">
		<!-- Profile dropdown -->
        <b-nav-item-dropdown v-if="account" id="profile-dropdown" :title="account.username" right no-caret>
            <template slot="button-content">
                <b-img v-if="account.avatar" rounded="circle" width="32" height="32" blank-color="#777" :src="account.avatar"></b-img>
                <font-awesome-icon v-else icon="user-circle" size="2x"></font-awesome-icon>
                {{ account.name }}
            </template>
            <b-dropdown-item to="/settings">
				<font-awesome-icon icon="user-circle"></font-awesome-icon>
				Profile
			</b-dropdown-item>
			<b-dropdown-divider></b-dropdown-divider>
            <b-dropdown-item @click="signOut()">
				<font-awesome-icon icon="sign-out"></font-awesome-icon>
				Sign Out
			</b-dropdown-item>
        </b-nav-item-dropdown>

		<!-- Spinner -->
		<b-nav-text v-else-if="loading" class="p-0">
			<span class="fa-layers fa-fw fa-2x">
                <font-awesome-icon class="text-primary" icon="spinner-third" spin></font-awesome-icon>
                <font-awesome-icon icon="user-circle"></font-awesome-icon>
			</span>
		</b-nav-text>

		<!-- Sign In Button -->
		<b-button v-else id="google-signin-btn" variant="dark">
            <font-awesome-icon :icon="['fab', 'google']"></font-awesome-icon>
			Sign In
		</b-button>
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss">
    #login {
		#profile-dropdown {
            margin-top: -2px;
            margin-bottom: -2px;
			a.nav-link {
				padding-top: 0.25rem;
                padding-bottom: 0.25rem;
			}
		}
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script>
    //------------------------------------------------------------------------------------------------------------------

	import $ from 'jquery';

    // Managers
	import authMan from '../../api/managers/auth';

    //------------------------------------------------------------------------------------------------------------------

    export default {
		subscriptions: {
			account: authMan.account$,
			authStatus: authMan.status$
		},
		computed: {
			loading(){ return this.authStatus === 'signing in'; },
		},
		methods: {
			signOut(){ return authMan.signOut(); }
		},
		mounted()
		{
			const btnElem = $(this.$el).find('#google-signin-btn');
			authMan.attachSignIn(btnElem[0])
		}
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
