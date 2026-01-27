//----------------------------------------------------------------------------------------------------------------------
// Main Client-side Application
//----------------------------------------------------------------------------------------------------------------------

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';
import { type Tokens, marked } from 'marked';

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

// Models
import type { AppVersion } from '@rpgk/core/models/version';

// Managers
import authMan from './lib/managers/auth';
import campMan from './lib/managers/campaign';
import charMan from './lib/managers/character';
import systemsMan from './lib/managers/systems';

// Config
import { features } from './lib/config/features';

// Site Theme
import './scss/theme.scss';

// Views
import AppComponent from './app.vue';
import CampListPage from './pages/campListPage.vue';
import CampaignPage from './pages/campaignPage.vue';
import CharacterPage from './pages/characterPage.vue';
import CharListPage from './pages/charListPage.vue';
import DashboardPage from './pages/dashboardPage.vue';

// Pages
import AdminPage from './pages/adminPage.vue';
import AdminPostsPage from './pages/adminPostsPage.vue';
import AdminAlertsPage from './pages/adminAlertsPage.vue';
import HomePage from './pages/homePage.vue';
import NewsPage from './pages/newsPage.vue';
import NewsPostPage from './pages/newsPostPage.vue';
import SettingsPage from './pages/settingsPage.vue';

// Utils
import versionRA from './lib/resource-access/version';

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
        { path: '/dashboard', name: 'dashboard', component: DashboardPage },
        { path: '/characters', name: 'character-list', component: CharListPage },
        { path: '/characters/:id', name: 'character', component: CharacterPage, meta: { hideFooter: true } },
        { path: '/settings', name: 'settings', component: SettingsPage },
        { path: '/news', name: 'news', component: NewsPage },
        { path: '/news/:slug', name: 'news-post', component: NewsPostPage },
        { path: '/admin', name: 'admin', component: AdminPage },
        { path: '/admin/posts', name: 'admin-posts', component: AdminPostsPage },
        { path: '/admin/alerts', name: 'admin-alerts', component: AdminAlertsPage },

        // Campaign routes (feature flagged)
        ...(features.campaigns ? [
            { path: '/campaigns', name: 'campaign-list', component: CampListPage },
            { path: '/campaigns/:campaignID', name: 'campaign', component: CampaignPage },
        ] : []),
    ],
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
    renderer,
});

// ---------------------------------------------------------------------------------------------------------------------
// Version information
// ---------------------------------------------------------------------------------------------------------------------

declare global
{
    interface Window
    {
        RPGKeeper : AppVersion;
    }
}

//----------------------------------------------------------------------------------------------------------------------
// App Initialization
//----------------------------------------------------------------------------------------------------------------------

async function init() : Promise<void>
{
    // Load current account
    await authMan.load();
    await systemsMan.load();
    if(features.campaigns)
    {
        await campMan.init();
    }
    await charMan.init();

    // Mount the application
    app.mount('#rpgkeeper');

    // Set the app version on window
    const appVersion = await versionRA.getAppVersion();
    window.RPGKeeper = appVersion;

    // Print out an initialization message
    console.info(`RPGKeeper v${ appVersion.version.full } initialized.`);
}

// ---------------------------------------------------------------------------------------------------------------------

init();

// ---------------------------------------------------------------------------------------------------------------------
