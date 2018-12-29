//----------------------------------------------------------------------------------------------------------------------
// Main Client-side Application
//
// @module
//----------------------------------------------------------------------------------------------------------------------

import pkg from '../package.json';
import marked from 'marked';

import Vue from 'vue';
import VueMaterial from 'vue-material';
import VueRouter from 'vue-router';

// Code Mirror
import 'codemirror/lib/codemirror.css';

// VueRX
import VueRx from 'vue-rx'

// Managers
import postsMan from './api/managers/posts';

// Views
import AppComponent from './app.vue';

// Pages
import HomePage from './pages/home/home.vue';
import AboutPage from './pages/about/about.vue';
import DashboardPage from './pages/dashboard/dashboard.vue';
import CharacterPage from './pages/character/character.vue';

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

import 'vue-material/dist/vue-material.css';

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
// Setup Vue App
//----------------------------------------------------------------------------------------------------------------------

Vue.config.debug = true;

// Setup app component
const App = Vue.component('app', AppComponent);
new App({
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

//----------------------------------------------------------------------------------------------------------------------
// App Initialization
//----------------------------------------------------------------------------------------------------------------------

async function init()
{
    // Setup Managers
    await postsMan.loadPosts();
} // end init

// ---------------------------------------------------------------------------------------------------------------------

init();

// ---------------------------------------------------------------------------------------------------------------------
