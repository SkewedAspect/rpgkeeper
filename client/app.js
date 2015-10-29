//----------------------------------------------------------------------------------------------------------------------
/// Main Client-side Application
///
/// @module
//----------------------------------------------------------------------------------------------------------------------

import marked from 'marked';

import Vue from 'vue';
import VueRouter from 'vue-router';

// Services
import RouterSvc from './components/router/routerService';

// Pages
import HomeComponent from './pages/home/home.vue';
import DashboardComponent from './pages/dashboard/dashboard.vue';

// Filters
import './components/moment/momentFilters';

// Components
import header from './components/header/header.vue';
import footer from './components/footer/footer.vue';

//----------------------------------------------------------------------------------------------------------------------
// App Setup
//----------------------------------------------------------------------------------------------------------------------

Vue.config.debug = true;
Vue.use(VueRouter);

var app = Vue.extend({
    components: {
        'site-header': header,
        'site-footer': footer
    }
});

//----------------------------------------------------------------------------------------------------------------------
// Router
//----------------------------------------------------------------------------------------------------------------------

RouterSvc.setup({
    history: true,
    saveScrollPosition: true,
    linkActiveClass: 'active'
});

RouterSvc.map({
    '/': {
        name: 'home',
        component: HomeComponent
    },
    '/dashboard': {
        name: 'dashboard',
        component: DashboardComponent
    }
});

//----------------------------------------------------------------------------------------------------------------------
// Service Setup
//----------------------------------------------------------------------------------------------------------------------

// Configure the marked markdown parser
var renderer = new marked.Renderer();

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

// Setup router
RouterSvc.start(app, '#main-app');

// ---------------------------------------------------------------------------------------------------------------------