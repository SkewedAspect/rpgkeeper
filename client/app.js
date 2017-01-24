//----------------------------------------------------------------------------------------------------------------------
// Main Client-side Application
//
// @module
//----------------------------------------------------------------------------------------------------------------------

// Overwrite the global promise with Bluebird. This makes `axios` use Bluebird promises.
import Promise from 'bluebird';
window.Promise = Promise;

//----------------------------------------------------------------------------------------------------------------------

import marked from 'marked';

import Vue from 'vue';
import VueMaterial from 'vue-material';
import VueRouter from 'vue-router';

import pkg from '../package.json';

// Views
import AppComponent from './app.vue';

// Pages
import HomePage from './pages/home/home.vue';
// import HomeComponent from './pages/home/home.vue';
// import DashboardComponent from './pages/dashboard/dashboard.vue';
// import CharacterComponent from './pages/character/character.vue';

// ---------------------------------------------------------------------------------------------------------------------
// Vue Material
// ---------------------------------------------------------------------------------------------------------------------

Vue.use(VueMaterial);

Vue.material.registerTheme('default', {
    primary: {
        color: 'grey',
        hue: 800
    },
    accent: 'orange'
});

Vue.material.setCurrentTheme('default');

//----------------------------------------------------------------------------------------------------------------------
// Vue Router
//----------------------------------------------------------------------------------------------------------------------

Vue.use(VueRouter);

const router = new VueRouter({
    mode: 'history',
    routes: [
        { path: '/', name: 'home', component: HomePage },
        // { path: '/dashboard', name: 'dashboard', component: DashboardPage },
        // { path: '/characters/:id', name: 'character', component: CharacterPage },
        // { path: '/settings', name: 'settings', component: SettingsPage },
    ]
});

//----------------------------------------------------------------------------------------------------------------------
// App Setup
//----------------------------------------------------------------------------------------------------------------------

Vue.config.debug = true;

const App = Vue.component('app', AppComponent);
const app = new App({
    el: '#rpgkeeper',
    router,
});

//----------------------------------------------------------------------------------------------------------------------
// Service Setup
//----------------------------------------------------------------------------------------------------------------------

// Configure the marked markdown parser
const renderer = new marked.Renderer();
renderer.table = function(header, body)
{
    return `<div class="table-responsive"><table class="table table-striped table-hover table-bordered"><thead>${header}</thead><tbody>${body}</tbody></table></div>`;
}; // end table parsing

// Configure marked parser
marked.setOptions({
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false,
    renderer: renderer
});

// ---------------------------------------------------------------------------------------------------------------------
// Version information
// ---------------------------------------------------------------------------------------------------------------------

window.RPGMap = {
    version: pkg.version
};

// ---------------------------------------------------------------------------------------------------------------------