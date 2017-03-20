<!--------------------------------------------------------------------------------------------------------------------->
<!-- Main Page                                                                                                       -->
<!--------------------------------------------------------------------------------------------------------------------->

<template>
	<div id="main-page" class="container">
		<h1 class="text-center">
			<img src="/static/images/logo.png" width="40px" height="40px" style="margin-top: -10px; margin-right: -5px"> RPGKeeper
			<br/>
			<small>
				The one-stop shop for all your RPG needs.
			</small>
		</h1>
        <md-layout class="news" :md-gutter="true">
			<md-layout md-flex-small="100" v-for="article in articles">
				<news-article :article="article"></news-article>
			</md-layout>
		</md-layout>
	</div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss">
	#main-page {
		padding: 16px;

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

	import _ from 'lodash';
    import marked from 'marked';
    import moment from 'moment';
    import $http from 'axios';

    // Components
    import Article from './components/article.vue';

    //------------------------------------------------------------------------------------------------------------------

	export default {
	    components: {
	        newsArticle: Article
		},
        data()
        {
            return {
                articles: []
            };
        },
        mounted()
        {
            $http.get('/news')
                .then((response) =>
                {
                    this.articles = response.data || [];
                });
        }
	}
</script>

<!--------------------------------------------------------------------------------------------------------------------->
