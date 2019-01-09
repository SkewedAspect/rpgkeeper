<!----------------------------------------------------------------------------------------------------------------------
  -- Main Page
  --------------------------------------------------------------------------------------------------------------------->

<template>
	<div id="main-page" class="container p-3">
		<h1 class="text-center">
            <img class="rpgk-logo" src="/static/images/logo.png" alt="RPGKeeper Logo" width="40px" height="40px">
            RPGKeeper
			<br/>
			<small>
				The one-stop shop for all your RPG needs.
			</small>
		</h1>

        <loading class="mt-4 mb-4"v-if="postsLoading"></loading>

        <b-card-group class="mt-4" v-else deck>
            <b-card :title="post.title" :sub-title="`by ${ post.account.name }`" v-for="post in sortedPosts" :key="post.post_id">
                <p class="card-text mt-4" v-html="markdown(post.stinger)"></p>
                <div slot="footer">
                    <b-btn variant="primary" class="float-right" size="sm" @click="readMore(post)">
                        <font-awesome-icon icon="book-open"></font-awesome-icon>
                       Read More
                    </b-btn>
                    <div class="mt-2">
                        <small class="text-muted">{{ fromNow(post.created) }}</small>
                    </div>
                </div>
            </b-card>
        </b-card-group>

        <!-- Modal -->
        <b-modal id="readMore" :title="readMorePost.title"
            header-bg-variant="dark"
            header-text-variant="white"
            v-model="showModal"
            v-if="readMorePost"
            size="xl"
            ok-only>
            <div v-html="markdown(readMorePost.content)"></div>

            <template slot="modal-ok">
                <font-awesome-icon icon="times"></font-awesome-icon>
                Close
            </template>
        </b-modal>
	</div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss">
	#main-page {
        .rpgk-logo {
            margin-top: -10px;
            margin-right: -5px;
        }
	}
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script>
    //------------------------------------------------------------------------------------------------------------------

    import marked from 'marked';
    import { format, formatDistance } from 'date-fns';

    // Managers
    import authMan from '../api/managers/auth';
    import postsMan from '../api/managers/posts';

    // Components
    import Loading from '../components/ui/loading.vue';
    import NewsPost from '../components/posts/post.vue';

    //------------------------------------------------------------------------------------------------------------------

	export default {
	    components: {
	        Loading,
	        NewsPost
		},
        computed: {
	        sortedPosts()
            {
                // Since `.sort` manipulates it in place, we make a copy using `.concat` as a nice shortcut for that.
                return this.posts
                    .concat()
                    .sort((post) => -post.created);
            },
            showModal: {
	            get(){ return !!this.readMorePost; },
	            set(val){ !val ? this.readMorePost = undefined : false; }
            }
        },
        methods: {
	        markdown(text)
            {
                return marked(text);
            },
            fromNow(date)
            {
                return formatDistance(date, new Date());
            },
            date(date)
            {
                return format(date, 'MMM do yyyy');
            },
            readMore(post)
            {
                this.readMorePost = post;
            }
        },
        subscriptions: {
	        postsLoading: postsMan.postsLoading$,
            posts: postsMan.posts$
        },
        data()
        {
            return {
                signingIn: false,
                readMorePost: undefined
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
