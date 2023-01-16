//----------------------------------------------------------------------------------------------------------------------
// Main Client-side Application
//----------------------------------------------------------------------------------------------------------------------

import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { marked } from 'marked';
import { version } from '../../package.json';

// VueCodeMirror
import VueCodemirror from 'vue-codemirror';

// VueRX
import VueRx from 'vue-rx';

// Bootstrap Vue
import { BootstrapVue } from 'bootstrap-vue';

// Vuelidate
import Vuelidate from 'vuelidate';

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

// Utils
import toastUtil from './lib/utils/toast';

// Site Theme
import './scss/theme.scss';

// Views
import AppComponent from './app.vue';
import AboutPage from './pages/about.vue';
import CharacterPage from './pages/character.vue';
import DashboardPage from './pages/dashboard.vue';

// Pages
import HomePage from './pages/home.vue';
import SettingsPage from './pages/settings.vue';

// ---------------------------------------------------------------------------------------------------------------------
// Font Awesome
// ---------------------------------------------------------------------------------------------------------------------

// FIXME: Why the any cast? Whomst fuckith'd the types, praytell?
library.add(fab as any, far as any, fas as any);

// ---------------------------------------------------------------------------------------------------------------------
// VueCodeMirror
// ---------------------------------------------------------------------------------------------------------------------

import 'codemirror/lib/codemirror.css';

// ---------------------------------------------------------------------------------------------------------------------
// Bootstrap Vue
// ---------------------------------------------------------------------------------------------------------------------

// TODO: Needed?
import 'bootstrap-vue/dist/bootstrap-vue.css';

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

// Setup app component
const app = createApp(AppComponent)
    .component('Fa', FontAwesomeIcon)
    .component('FaLayers', FontAwesomeLayers)
    // FixMe: Remove VueRX
    .use(VueRx as any)
    .use(Vuelidate)
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
    .use(router)
    .mount('#rpgkeeper');

//----------------------------------------------------------------------------------------------------------------------
// Marked Setup
//----------------------------------------------------------------------------------------------------------------------

// Configure the marked markdown parser
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
    if(app)
    {
        // Setup Utils
        toastUtil.setVueRoot(app);
    }
}

// ---------------------------------------------------------------------------------------------------------------------

init();

// ---------------------------------------------------------------------------------------------------------------------
