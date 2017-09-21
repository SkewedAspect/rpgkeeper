<!--------------------------------------------------------------------------------------------------------------------->
<!-- Site Header                                                                                                     -->
<!--------------------------------------------------------------------------------------------------------------------->

<template>
	<md-toolbar id="site-header">
		<h2 class="md-title" style="flex: 1" @click="goTo('/')">
			<img src="/static/images/logo.png" width="30px" height="30px" style="display: inline-block; margin-top: -5px">
			RPGKeeper
		</h2>

		<!-- Dashboard -->
		<md-button v-if="!!account" class="md-icon-button hidden-sm-up" @click="goTo('/dashboard')">
			<md-icon>dashboard</md-icon>
		</md-button>

		<md-button v-if="!!account" class="hidden-xs-down" @click="goTo('/dashboard')">
			<md-icon>dashboard</md-icon>
            Dashboard
		</md-button>

		<!-- Login -->
		<login></login>
	</md-toolbar>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss">
	#site-header {
		.md-title {
			cursor: pointer;
		}
	}
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script>
	import stateSvc from '../services/state';
	import LoginComponent from './login.vue';

    export default {
        name: 'SiteHeader',
		components: {
			login: LoginComponent
		},
        data()
        {
            return {
				state: stateSvc.state
			};
        },
		computed: {
			account(){ return this.state.account; }
		},
		methods: {
			goTo(path)
			{
				this.$router.push(path);
			}
		}
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
