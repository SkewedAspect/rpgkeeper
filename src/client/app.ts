//----------------------------------------------------------------------------------------------------------------------
// Main Client-side Application
//----------------------------------------------------------------------------------------------------------------------

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';
import { marked } from 'marked';
import { version } from '../../package.json';

// VueCodeMirror
import VueCodemirror from 'vue-codemirror';

// VueRX
import VueRx from 'vue-rx';

// Bootstrap Vue
import { BootstrapVue } from 'bootstrap-vue';

// Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/pro-regular-svg-icons';
import { fas } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon, FontAwesomeLayers } from '@fortawesome/vue-fontawesome';

// CodeMirror
import 'codemirror/addon/mode/overlay';
import 'codemirror/mode/xml/xml';
import 'codemirror/mode/markdown/markdown';
import 'codemirror/mode/gfm/gfm';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/css/css';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/clike/clike';
import 'codemirror/mode/meta';

// Managers
import authMan from './lib/managers/auth';
import charMan from './lib/managers/character';

// Utils
import toastUtil from './lib/utils/toast';

// Site Theme
import './scss/theme.scss';
import 'codemirror/lib/codemirror.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

// Views
import AppComponent from './app.vue';
import AboutPage from './pages/aboutPage.vue';
import CharacterPage from './pages/characterPage.vue';
import DashboardPage from './pages/dashboardPage.vue';

// Pages
import HomePage from './pages/homePage.vue';
import SettingsPage from './pages/settingsPage.vue';

// ---------------------------------------------------------------------------------------------------------------------
// Font Awesome
// ---------------------------------------------------------------------------------------------------------------------

library.add(fab, far, fas);

//----------------------------------------------------------------------------------------------------------------------
// Vue Router
//----------------------------------------------------------------------------------------------------------------------

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', name: 'home', component: HomePage },
        { path: '/about', name: 'about', component: AboutPage },
        { path: '/dashboard', name: 'dashboard', component: DashboardPage },
        { path: '/characters/:id', name: 'character', component: CharacterPage },
        { path: '/settings', name: 'settings', component: SettingsPage }
    ]
});

//----------------------------------------------------------------------------------------------------------------------
// Setup Vue App
//----------------------------------------------------------------------------------------------------------------------

// TODO: Do I need to still handle these?
// Vue.config.ignoredElements = [
//     'proficiency',
//     'ability',
//     'boost',
//     'force',
//     'challenge',
//     'difficulty',
//     'setback',
//     'success',
//     'advantage',
//     'triumph',
//     'light-side',
//     'force-point',
//     'failure',
//     'threat',
//     'despair',
//     'dark-side'
// ];

// Set up pinia
const pinia = createPinia();

// Set up app component
const app = createApp(AppComponent)
    .component('Fa', FontAwesomeIcon)
    .component('FaLayers', FontAwesomeLayers)

    // FixMe: Remove VueRX
    .use(VueRx as any)

    // FixMe: Upgrade to VueCodeMirror v6
    .use(VueCodemirror, {
        options: {
            mode: {
                name: 'gfm',
                gitHubSpice: false
            },
            lineNumbers: false,
            lineWrapping: true,
            theme: 'default'
        }
    })

    // FixMe: Why does this not work?
    .use(BootstrapVue as any)

    .use(pinia)
    .use(router);

//----------------------------------------------------------------------------------------------------------------------
// Marked Setup
//----------------------------------------------------------------------------------------------------------------------

// Configure the marked Markdown parser
const renderer = new marked.Renderer();
renderer.table = function(header, body)
{
    const tableBody = `<thead>${ header }</thead><tbody>${ body }</tbody>`;
    return `<div class="table-responsive"><table class="table table-striped table-hover table-sm">${ tableBody }</table></div>`;
};

// Configure marked parser
marked.setOptions({
    gfm: true,
    breaks: false,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false,
    renderer
});

// ---------------------------------------------------------------------------------------------------------------------
// Version information
// ---------------------------------------------------------------------------------------------------------------------

(window as any).RPGKeeper = {
    version
};

//----------------------------------------------------------------------------------------------------------------------
// App Initialization
//----------------------------------------------------------------------------------------------------------------------

async function init() : Promise<void>
{
    // Load current account
    await authMan.load();
    await charMan.init();

    // Initialize Utils
    toastUtil.setVueRoot(app);

    // Mount the application
    app.mount('#rpgkeeper');
}

// ---------------------------------------------------------------------------------------------------------------------

init();

// ---------------------------------------------------------------------------------------------------------------------
