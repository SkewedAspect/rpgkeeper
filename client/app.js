//----------------------------------------------------------------------------------------------------------------------
// Main Client-side Application
//----------------------------------------------------------------------------------------------------------------------

import pkg from '../package.json';
import marked from 'marked';

import Vue from 'vue';
import VueRouter from 'vue-router';
import BootstrapVue from 'bootstrap-vue';

//TODO: Remove
import VueMaterial from 'vue-material';

// VueRX
import VueRx from 'vue-rx'

// Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/pro-solid-svg-icons';
import { far } from '@fortawesome/pro-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon, FontAwesomeLayers } from '@fortawesome/vue-fontawesome';

// CodeMirror
import "codemirror/lib/codemirror.css";
import 'codemirror/addon/merge/merge.css';
import 'codemirror/addon/mode/overlay';
import 'codemirror/addon/merge/merge.js';
import 'codemirror/mode/xml/xml';
import 'codemirror/mode/markdown/markdown';
import 'codemirror/mode/gfm/gfm';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/css/css';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/clike/clike';
import 'codemirror/mode/meta';

// Managers
import postsMan from './api/managers/posts';

// Views
import AppComponent from './app.vue';

// Pages
import HomePage from './pages/home.vue';
import AboutPage from './pages/about.vue';
import DashboardPage from './pages/dashboard.vue';
import CharacterPage from './pages/character.vue';
import SettingsPage from './pages/settings.vue';

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
// Font Awesome
// ---------------------------------------------------------------------------------------------------------------------

library.add(fab, far, fas);
Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.component('font-awesome-layers', FontAwesomeLayers);

// ---------------------------------------------------------------------------------------------------------------------
// Bootstrap Vue
// ---------------------------------------------------------------------------------------------------------------------

import './scss/theme.scss';
import 'bootstrap-vue/dist/bootstrap-vue.css';

Vue.use(BootstrapVue);

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
        { path: '/settings', name: 'settings', component: SettingsPage },
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
