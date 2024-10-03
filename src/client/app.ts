//----------------------------------------------------------------------------------------------------------------------
// Main Client-side Application
//----------------------------------------------------------------------------------------------------------------------

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';
import { marked, Tokens } from 'marked';

// Bootstrap Vue
import { createBootstrap } from 'bootstrap-vue-next';

// Vue Bootstrap Autocomplete
import { install as installVBA } from '@morgul/vue-bootstrap-autocomplete';

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

// Views
import AppComponent from './app.vue';
import AboutPage from './pages/aboutPage.vue';
import CharacterPage from './pages/characterPage.vue';
import DashboardPage from './pages/dashboardPage.vue';

// Pages
import HomePage from './pages/homePage.vue';
import SettingsPage from './pages/settingsPage.vue';

// Utils
// import { buildWarnHandler } from './lib/utils/warning';

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
    .use(createBootstrap())
    .use(installVBA)
    .use(pinia)
    .use(router);

// Set Up Warning Handler
// app.config.warnHandler = buildWarnHandler();

//----------------------------------------------------------------------------------------------------------------------
// Marked Setup
//----------------------------------------------------------------------------------------------------------------------

// Configure the marked Markdown parser
const renderer = new marked.Renderer();
renderer.table = function(token : Tokens.Table) : string
{
    // Build table head
    let tableBody = '<thead>';
    for(const header of token.header)
    {
        // Translate alignment
        const align = header.align === 'center' ? 'text-center' : header.align === 'right' ? 'text-end' : 'text-start';

        tableBody += `<th class="${ align }">${ header.text }</th>`;
    }
    tableBody += '</thead>';

    tableBody += '<tbody>';
    for(const row of token.rows)
    {
        tableBody += '<tr>';
        for(const cell of row)
        {
            const align = cell.align === 'center' ? 'text-center' : cell.align === 'right' ? 'text-end' : 'text-start';
            tableBody += `<td class="${ align }">${ cell.text }</td>`;
        }
        tableBody += '</tr>';
    }
    tableBody += '</tbody>';

    return `<div class="table-responsive">
            <table class="table table-striped table-hover table-sm">${ tableBody }</table>
        </div>`;
};

// Configure marked parser
marked.setOptions({
    gfm: true,
    breaks: false,
    pedantic: false,
    renderer
});

// ---------------------------------------------------------------------------------------------------------------------
// Version information
// ---------------------------------------------------------------------------------------------------------------------

declare global
{
    interface Window
    {
        RPGKeeper : {
            version : string;
        }
    }
}

window.RPGKeeper = {
    version: __APP_VERSION__
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
