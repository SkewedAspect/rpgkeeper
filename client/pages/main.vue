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
			<md-layout md-flex-small="100" md-flex-medium="50" v-for="article in articles">
				<md-card :id="`readmore-${ article.attributes.filename }`">
					<md-card-header>
						<div class="md-title">{{ article.attributes.title }}</div>
						<div class="md-subhead">{{ renderDate(article) }} by {{ article.attributes.user }}</div>
					</md-card-header>

					<md-card-content style="flex: 1" v-html="renderTruncated(article)"></md-card-content>

					<md-card-actions>
						<md-button @click="openReadMore(article)">Read More</md-button>
					</md-card-actions>
				</md-card>
			</md-layout>
		</md-layout>
		<md-dialog-alert
			:md-title="readMoreTitle"
			:md-content-html="readMoreBody"
			:md-open-from="readMoreID"
			:md-close-to="readMoreID"
			@close="onReadMoreClosed"
			ref="readMore">
		</md-dialog-alert>
	</div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style rel="stylesheet/scss" lang="sass">
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

    //------------------------------------------------------------------------------------------------------------------

	export default {
        data()
        {
            return {
                readMore: undefined,
                articles: []
            };
        },
		computed: {
            readMoreID()
			{
			    return `#readmore-${ _.get(this.readMore, 'attributes.filename', 'unknown') }`;
			},
			readMoreTitle()
			{
			    return _.get(this.readMore, 'attributes.title', 'Unknown Title');
			},
			readMoreBody()
			{
			    if(this.readMore)
				{
				    return this.renderBody(this.readMore);
				} // end if

				return " ";
			}
		},
        methods: {
            renderTruncated(article)
            {
                const blurb = article.body.split('--- $READMORE')[0];
                return marked(blurb);
            },
			renderBody(article)
			{
			    let body = article.body.replace('--- $READMORE', '');
			    body = `<div class="md-subhead">${ this.renderDate(this.readMore) } by ${ this.readMore.attributes.user }</div>\n\n${ body }`;

                return marked(body);
			},
			renderDate(article)
			{
				return moment(article.attributes.date).format('MMM Do YYYY');
			},
			openReadMore(article)
			{
			    this.readMore = article;
			    this.$refs.readMore.open();
			},
			onReadMoreClosed()
			{
			    setTimeout(() =>
				{
                    this.readMore = undefined;
				}, 250);
			}
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
