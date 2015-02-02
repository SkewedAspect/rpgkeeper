// ---------------------------------------------------------------------------------------------------------------------
// BaseCharacterResource
//
// @module character_resource
// ---------------------------------------------------------------------------------------------------------------------

function BaseCharacterResourceFactory($resource)
{
    var Character = $resource('/characters/:charID', {}, {
        save: {
            method: 'PUT'
        }
    });

    function BaseCharacterResource(id)
    {
        this.id = id;

        this.refresh();
    } // end BaseCharacterResource

    BaseCharacterResource.prototype = {
        get name(){ return this.$resource.name; },
        set name(val){ this.$resource.name = val; },
        get system(){ return this.$resource.system; },
        set system(val){ this.$resource.system = val; },
        get user(){ return this.$resource.user; },
        set user(val){ this.$resource.user = val; },
        get portrait(){ return this.$resource.portrait; },
        set portrait(val){ this.$resource.portrait = val; },
        get thumbnail(){ return this.$resource.thumbnail; },
        set thumbnail(val){ this.$resource.thumbnail = val; },
        get biography(){ return this.$resource.biography; },
        set biography(val){ this.$resource.biography = val; },
        get description(){ return this.$resource.description; },
        set description(val){ this.$resource.description = val; },

        get resolved(){ return this.$resource.$resolved; },
        get promise(){ return this.$resource.$promise; }
    }; // end prototype

    BaseCharacterResource.prototype.$loadResource = function()
    {
        var self = this;
        this.$resource = Character.get({ charID: this.id }, function()
            {
                self.error = undefined;
            }, function(response)
            {
                self.error = response;
            });
    }; // end $loadResource

    BaseCharacterResource.prototype.refresh = function()
    {
        this.$loadResource();
    }; // end refresh

    BaseCharacterResource.prototype.save = function()
    {
        return this.$resource.$save({ charID: this.id });
    }; // end save

    BaseCharacterResource.prototype.delete = function()
    {
        return this.$resource.$delete({ charID: this.id });
    }; // end delete

    return function(id){ return new BaseCharacterResource(id); };
} // end BaseCharacterResourceFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('rpgkeeper.services').factory('BaseCharacterResource', [
    '$resource',
    BaseCharacterResourceFactory
]);

// ---------------------------------------------------------------------------------------------------------------------