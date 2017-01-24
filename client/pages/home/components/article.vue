<!--------------------------------------------------------------------------------------------------------------------->
<!-- New Article                                                                                                     -->
<!--------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="news-article">
        <md-card class="news-article" :id="id" style="height: 100%">
            <md-card-header>
                <div class="md-title">{{ title }}</div>
                <div class="md-subhead text-right">{{ date }} by {{ author }}</div>
            </md-card-header>

            <md-card-content style="flex: 1" v-html="truncatedBody"></md-card-content>

            <md-card-actions>
                <md-button @click="openReadMore">Read More</md-button>
            </md-card-actions>
        </md-card>

        <md-dialog-alert
            :md-title="title"
            :md-content-html="`${ subhead }\n\n${ body }`"
            :md-open-from="id"
            :md-close-to="id"
            ref="readMore">
        </md-dialog-alert>
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style rel="stylesheet/scss" lang="sass">
    .news-article {
        margin: 8px 0;
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script>
    //------------------------------------------------------------------------------------------------------------------

    import _ from 'lodash';
    import marked from 'marked';
    import moment from 'moment';

    //------------------------------------------------------------------------------------------------------------------

    export default {
        props: {
            article: {
                type: Object,
                required: true
            }
        },
        computed: {
            id()
            {
                return `#readmore-${ _.get(this.readMore, 'attributes.filename', 'unknown') }`;
            },
            title()
            {
                return _.get(this.article, 'attributes.title', 'Unknown Title');
            },
            author()
            {
                return _.get(this.article, 'attributes.author', 'Unknown Author');
            },
            date()
            {
                return moment(this.article.attributes.date).format('MMM Do YYYY');
            },
            truncatedBody()
            {
                const blurb = this.article.body.split('--- $READMORE')[0];
                return marked(blurb);
            },
            subhead()
            {
                return `<div class="md-subhead">${ this.date } by ${ this.article.attributes.user }</div>`;
            },
            body()
            {
                const body = this.article.body.replace('--- $READMORE', '');
                return marked(body);
            }
        },
        methods: {
            openReadMore()
            {
                this.$refs.readMore.open();
            }
        }
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->