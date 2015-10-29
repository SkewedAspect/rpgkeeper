<template>
    <div id="home" class="container">
        <h1 class="text-center">
            <img src="/static/images/logo.png" width="40px" height="40px" style="margin-top: -10px; margin-right: -5px"> RPGKeeper
            <br/>
            <small>
                The one-stop shop for all your RPG needs.
            </small>
        </h1>
        <br/>
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">News</h3>
            </div>
            <ul class="list-group">
                <li class="list-group-item news-article" v-for="article in articles">
                    <div class="pull-right text-muted">{{ article.date | date 'MMM Do YYYY' }}</div>
                    <h1 class="list-group-item-heading" v-html="article.title | markdown"></h1>
                    <div class="list-group-item-text" v-html="article.body | markdown"></div>
                </li>
            </ul>
        </div>
    </div>
</template>

<style lang="sass" src="./home.scss"></style>

<script type="text/babel">
    import marked from 'marked';
    import $http from 'axios';

    export default {
        data: function()
        {
            return {
                articles: []
            };
        },
        filters: {
            markdown: marked
        },
        ready: function()
        {
            $http.get('/news')
                .then((response) =>
                {
                    this.articles = response.data || [];
                });
        }
    }
</script>