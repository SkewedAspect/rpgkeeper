<!--------------------------------------------------------------------------------------------------------------------->
<!-- Main Page                                                                                                       -->
<!--------------------------------------------------------------------------------------------------------------------->

<template>
	<div id="main-page" class="container">
		<h1 class="text-center">
            <img class="rpgk-logo" src="/static/images/logo.png" alt="RPGKeeper Logo" width="40px" height="40px">
            RPGKeeper
			<br/>
			<small>
				The one-stop shop for all your RPG needs.
			</small>
		</h1>
        <md-progress v-if="postsLoading" class="md-accent" md-indeterminate></md-progress>
        <h4 class="text-center" v-else-if="posts.length === 0">No News Posts</h4>
        <md-layout class="news" :md-gutter="true" v-else>
			<md-layout md-flex-small="100" v-for="post in sortedPosts" :key="post.post_id">
				<news-post :post="post"></news-post>
			</md-layout>
		</md-layout>
	</div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss">
	#main-page {
		padding: 16px;

        .rpgk-logo {
            margin-top: -10px;
            margin-right: -5px;
        }

		.news {
			.md-card {
				margin-top: 8px;
				margin-bottom: 8px;
			}
		}
	}
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script>
    //------------------------------------------------------------------------------------------------------------------

    // Managers
    import authMan from '../api/managers/auth';
    import postsMan from '../api/managers/posts';

    // Components
    import NewsPost from '../components/posts/post.vue';

    //------------------------------------------------------------------------------------------------------------------

	export default {
	    components: {
	        NewsPost
		},
        computed: {
	        sortedPosts()
            {
                // Since `.sort` manipulates it in place, we make a copy using `.concat` as a nice shortcut for that.
                return this.posts
                    .concat()
                    .sort((post) => -post.created);
            }
        },
        subscriptions: {
	        postsLoading: postsMan.postsLoading$,
            posts: postsMan.posts$
        },
        data()
        {
            return {
                signingIn: false
            };
        },
        mounted()
        {
            this.$subscribeTo(authMan.status$, (status) =>
            {
                if(status === 'signing in')
                {
                    // We're in the sign in process
                    this.signingIn = true;
                } // end if

                if(status === 'signed in' && this.signingIn)
                {
                    this.signingIn = false;

                    // We've completed a sign in, redirect
                    this.$router.push('/dashboard');
                } // end if
            });
        }
	}
</script>

<!--------------------------------------------------------------------------------------------------------------------->
