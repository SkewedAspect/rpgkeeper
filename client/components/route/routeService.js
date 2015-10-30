//----------------------------------------------------------------------------------------------------------------------
/// RouterService
///
/// @module
//----------------------------------------------------------------------------------------------------------------------

import VueRouter from 'vue-router';

//----------------------------------------------------------------------------------------------------------------------

class RouteService {
    setup(options)
    {
        this.router = new VueRouter(options);
    } // end constructor

    get app(){ return this.router.app; }
    get path(){ return this.router.app.$route.path; }

    // Router API
    go() { this.router.go.apply(this.router, arguments); }
    map() { this.router.map.apply(this.router, arguments); }
    start() { this.router.start.apply(this.router, arguments); }
    alias() { this.router.alias.apply(this.router, arguments); }
    replace() { this.router.replace.apply(this.router, arguments); }
    redirect() { this.router.redirect.apply(this.router, arguments); }
    afterEach() { this.router.afterEach.apply(this.router, arguments); }
    beforeEach() { this.router.beforeEach.apply(this.router, arguments); }
} // end RouterService

//----------------------------------------------------------------------------------------------------------------------

export default new RouteService();

//----------------------------------------------------------------------------------------------------------------------