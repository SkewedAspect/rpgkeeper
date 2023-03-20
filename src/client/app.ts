//----------------------------------------------------------------------------------------------------------------------
// Main Client-side Application
//----------------------------------------------------------------------------------------------------------------------

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';
import { marked } from 'marked';
import { version } from '../../package.json';

// Bootstrap Vue
import { BootstrapVue } from 'bootstrap-vue';

// Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/pro-regular-svg-icons';
import { fas } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon, FontAwesomeLayers } from '@fortawesome/vue-fontawesome';

// Managers
import authMan from './lib/managers/auth';
import charMan from './lib/managers/character';
import systemsMan from './lib/managers/systems';

// Site Theme
import './scss/theme.scss';
import 'bootstrap-vue/dist/bootstrap-vue.css';

// Views
import AppComponent from './app.vue';
import AboutPage from './pages/aboutPage.vue';
import CharacterPage from './pages/characterPage.vue';
import DashboardPage from './pages/dashboardPage.vue';

// Pages
import HomePage from './pages/homePage.vue';
import SettingsPage from './pages/settingsPage.vue';

// Utils
import { buildWarnHandler } from './lib/utils/warning';

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

// Set up pinia
const pinia = createPinia();

// Set up app component
const app = createApp(AppComponent)
    .component('Fa', FontAwesomeIcon)
    .component('FaLayers', FontAwesomeLayers)

    // FixMe: Why does this not work?
    .use(BootstrapVue as any)
    .use(pinia)
    .use(router);

// Set Up Warning Handler
app.config.warnHandler = buildWarnHandler();

//----------------------------------------------------------------------------------------------------------------------
// Marked Setup
//----------------------------------------------------------------------------------------------------------------------

// Configure the marked Markdown parser
const renderer = new marked.Renderer();
renderer.table = function(header, body)
{
    const tableBody = `<thead>${ header }</thead><tbody>${ body }</tbody>`;
    return `<div class="table-responsive">
            <table class="table table-striped table-hover table-sm">${ tableBody }</table>
        </div>`;
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
    await systemsMan.load();
    await charMan.init();

    // Mount the application
    app.mount('#rpgkeeper');
}

// ---------------------------------------------------------------------------------------------------------------------

init();

// ---------------------------------------------------------------------------------------------------------------------
