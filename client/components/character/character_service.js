// ---------------------------------------------------------------------------------------------------------------------
// BaseCharacterService
//
// @module character_service.js
// ---------------------------------------------------------------------------------------------------------------------

function BaseCharacterServiceFactory(Promise, $http, $cacheFactory, $routeParams, CharResource)
{
    function BaseCharacterService()
    {
        this.characterCache = $cacheFactory('charCache', { capacity: 10 });

        Object.defineProperties(this, {
            current: {
                get: function()
                {
                    if($routeParams.charID)
                    {
                        return this.get($routeParams.charID);
                    } // end if
                }
            }
        });
    } // end BaseCharacterService

    BaseCharacterService.prototype.get = function(charID, skipRefresh)
    {
        var char = this.characterCache.get(charID);

        if(!char)
        {
            char = CharResource(charID);
            this.characterCache.put(char);
        }
        else if(!skipRefresh)
        {
            // Get the latest version of the character
            char.refresh();
        } // end if

        return char
    }; // end get

    BaseCharacterService.prototype.new = function(char)
    {
        return new Promise(function(resolve, reject)
        {
            $http.put('/characters', char)
                .success(function(charID)
                {
                    $http.put('/systems/' + char.system + '/characters/' + charID, {})
                        .success(function()
                        {
                            resolve(charID);
                        });
                })
                .error(function(response)
                {
                    reject(response);
                });
        });
    }; // end new

    BaseCharacterService.prototype.getByUser = function(email)
    {
        return new Promise(function(resolve)
        {
            $http.get('/characters', { params: { user: email } })
                .success(function(characters)
                {
                    resolve(_.reduce(characters, function(results, character)
                    {
                        //FIXME: This is wasteful, because we're getting the object twice. But, it's so much easier.
                        results.push(CharResource(character.id));
                        return results;
                    }, []));
                });
        });
    }; // end getByUser

    return new BaseCharacterService();
} // end BaseCharacterServiceFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('rpgkeeper.services').service('BaseCharacterService', [
    '$q',
    '$http',
    '$cacheFactory',
    '$routeParams',
    'BaseCharacterResource',
    BaseCharacterServiceFactory
]);

// ---------------------------------------------------------------------------------------------------------------------