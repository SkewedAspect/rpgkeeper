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

// VueRX
import VueRx from 'vue-rx'


// Views
import AppComponent from './app.vue';

// Pages
import HomePage from './pages/home/home.vue';
import AboutPage from './pages/about/about.vue';
import DashboardPage from './pages/dashboard/dashboard.vue';
import CharacterPage from './pages/character/character.vue';

import pkg from '../package.json';

// ---------------------------------------------------------------------------------------------------------------------
// Misc.
// ---------------------------------------------------------------------------------------------------------------------

import FlexDirective from './directives/flex';

Vue.directive('flex', FlexDirective);

// ---------------------------------------------------------------------------------------------------------------------
// VueRX
// ---------------------------------------------------------------------------------------------------------------------

Vue.use(VueRx);

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
        { path: '/about', name: 'about', component: AboutPage },
        { path: '/dashboard', name: 'dashboard', component: DashboardPage },
        { path: '/characters/:id', name: 'character', component: CharacterPage },
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
// Marked Setup
//----------------------------------------------------------------------------------------------------------------------

// Configure the marked markdown parser
const renderer = new marked.Renderer();
renderer.table = function(header, body)
{
    const tableBody = `<thead class="md-table-header">${ header }</thead><tbody class="md-table-body">${ body }</tbody>`;
    const tableWrapper = `<div class="md-table md-theme-default"><table>${ tableBody }</table></div>`;
    return `<div class="md-card md-table-card md-theme-default md-theme-default">${ tableWrapper }</div>`;
}; // end table parsing

renderer.tablerow = function(content)
{
    return `<tr class="md-table-row">${ content }</tr>`;
}; // end table row parsing

renderer.tablecell = function(content)
{
    return `<td class="md-table-cell"><div class="md-table-cell-container">${ content }</div></td>`;
}; // end table cell parsing

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
