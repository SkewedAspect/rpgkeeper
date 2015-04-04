// ---------------------------------------------------------------------------------------------------------------------
// DiceService
//
// @module dice_service
// ---------------------------------------------------------------------------------------------------------------------

function DiceServiceFactory($cacheFactory, rpgdice)
{
    function DiceService()
    {
        this.cache = $cacheFactory('rollsCache', { count: 50 });
    } // end DiceService

    DiceService.prototype.roll = function(rollTxt, scope)
    {
        var expr = this.cache.get(rollTxt);
        if(!expr)
        {
            expr = rpgdice.parse(rollTxt);
            this.cache.put(rollTxt, expr);
        } // end if

        return expr.eval(scope);
    }; // end roll

    return new DiceService();
} // end DiceServiceFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('rpgkeeper.services').service('DiceService', [
    '$cacheFactory',
    'rpgdice',
    DiceServiceFactory
]);

// ---------------------------------------------------------------------------------------------------------------------