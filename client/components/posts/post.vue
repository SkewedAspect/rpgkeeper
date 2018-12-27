<!----------------------------------------------------------------------------------------------------------------------
  -- News Post
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="news-post">
        <md-card class="news-post" :id="id" style="height: 100%">
            <md-card-header>
                <div class="md-title">{{ title }}</div>
                <div class="md-subhead text-right">{{ date }} by {{ author }}</div>
            </md-card-header>

            <md-card-content style="flex: 1" v-html="stinger"></md-card-content>

            <md-card-actions>
                <md-button @click="openReadMore">Read More</md-button>
            </md-card-actions>
        </md-card>

        <md-dialog-alert
            :md-title="title"
            :md-content-html="`${ subhead }\n\n${ content }`"
            :md-open-from="id"
            :md-close-to="id"
            ref="readMore">
        </md-dialog-alert>
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss">
    .news-post {
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
            post: {
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
                return _.get(this.post, 'title', 'Unknown Title');
            },
            author()
            {
                return _.get(this.post, 'account.name', 'Unknown Author');
            },
            date()
            {
                return moment(this.post.created).format('MMM Do YYYY');
            },
            stinger()
            {
                return marked(this.post.stinger);
            },
            subhead()
            {
                return `<div class="md-subhead">${ this.date } by ${ this.author }</div>`;
            },
            content()
            {
                return marked(this.post.content);
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
