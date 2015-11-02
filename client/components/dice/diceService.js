//----------------------------------------------------------------------------------------------------------------------
/// DiceService
///
/// @module
//----------------------------------------------------------------------------------------------------------------------

import rpgdice from 'rpgdicejs';
import LRU from 'lru-cache';

//----------------------------------------------------------------------------------------------------------------------

class DiceService {
    constructor()
    {
        this.cache = LRU(50);
    } // end constructor

    roll(rollTxt, scope)
    {
        // We cache the expression objects, since they're costly to create, and can be evaluated multiple times.
        var expr = this.cache.get(rollTxt);
        if(!expr)
        {
            expr = rpgdice.parse(rollTxt);
            this.cache.set(rollTxt, expr);
        } // end if

        return expr.eval(scope);
    } // end roll
} // end DiceService

//----------------------------------------------------------------------------------------------------------------------

export default new DiceService();

//----------------------------------------------------------------------------------------------------------------------