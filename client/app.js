//----------------------------------------------------------------------------------------------------------------------
// Main Client-side Application
//----------------------------------------------------------------------------------------------------------------------

// Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/pro-regular-svg-icons';
import { fas } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon, FontAwesomeLayers } from '@fortawesome/vue-fontawesome';
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'codemirror/addon/merge/merge.css';
import 'codemirror/addon/merge/merge.js';
import 'codemirror/addon/mode/overlay';
// CodeMirror
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/clike/clike';
import 'codemirror/mode/css/css';
import 'codemirror/mode/gfm/gfm';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/markdown/markdown';
import 'codemirror/mode/meta';
import 'codemirror/mode/xml/xml';
import marked from 'marked';

import Vue from 'vue';
import VueRouter from 'vue-router';
// VueRX
import VueRx from 'vue-rx';
import pkg from '../package.json';
// Managers
import postsMan from './api/managers/posts';
// Views
import AppComponent from './app.vue';
import AboutPage from './pages/about.vue';
import CharacterPage from './pages/character.vue';
import DashboardPage from './pages/dashboard.vue';
// Pages
import HomePage from './pages/home.vue';
import SettingsPage from './pages/settings.vue';
import './scss/theme.scss';

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

Vue.use(BootstrapVue);

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
    const tableBody = `<thead>${ header }</thead><tbody>${ body }</tbody>`;
    return `<div class="table-responsive"><table class="table table-striped table-hover table-sm">${ tableBody }</table></div>`;
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
