// ---------------------------------------------------------------------------------------------------------------------
// SystemsService
//
// @module systems_service.js
// ---------------------------------------------------------------------------------------------------------------------

function SystemsServiceFactory(Promise, $http)
{
    function SystemsService()
    {
        this.systems = [];
        this.initialized = this.refresh();
    } // end SystemsService

    SystemsService.prototype.refresh = function()
    {
        var self = this;
        return new Promise(function(resolve)
            {
                $http.get('/systems')
                    .success(function(systems)
                    {
                        resolve(systems);
                    });
            })
            .then(function(systems)
            {
                self.systems = systems;
            });
    }; // end refresh

    return new SystemsService();
} // end SystemsServiceFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('rpgkeeper.services').service('SystemsService', [
    '$q',
    '$http',
    SystemsServiceFactory
]);

// ---------------------------------------------------------------------------------------------------------------------