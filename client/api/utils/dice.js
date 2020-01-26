//----------------------------------------------------------------------------------------------------------------------
// DiceUtil
//----------------------------------------------------------------------------------------------------------------------

import _ from 'lodash';
import rpgdice from 'rpgdicejs';
import LRU from 'lru-cache';

//----------------------------------------------------------------------------------------------------------------------

/**
 * Chooses an item form a list at random.
 *
 * @param {Array<*>} choices - The list to choose an item out of.
 *
 * @returns {*} Returns an item from the list, randomly chosen.
 */
function randomChoice(choices)
{
    return choices[Math.floor(Math.random() * choices.length)];
} // end randomChoice

//----------------------------------------------------------------------------------------------------------------------

class DiceUtil
{
    constructor()
    {
        this.cache = new LRU(50);
        this.fudgeChoices = [ '-1', '-1', '0', '0', '+1', '+1' ];
    } // end constructor

    roll(rollTxt, scope)
    {
        // We cache the expression objects, since they're costly to create, and can be evaluated multiple times.
        let expr = this.cache.get(rollTxt);
        if(!expr)
        {
            expr = rpgdice.parse(rollTxt);
            this.cache.set(rollTxt, expr);
        } // end if

        return expr.eval(scope);
    } // end roll

    rollFudge(bonus = 0)
    {
        const results = _.map(_.range(4), () =>
        {
            return randomChoice(this.fudgeChoices);
        });

        const rollTotal = _.reduce(results, (total, rollResult) =>
        {
            return total + parseInt(rollResult);
        }, 0);

        return {
            render: () =>
            {
                return `[ ${ results.join(', ') } ] + ${ bonus }`;
            },
            value: rollTotal + bonus
        };
    } // end rollFudge
} // end DiceUtil

//----------------------------------------------------------------------------------------------------------------------

export default new DiceUtil();

//----------------------------------------------------------------------------------------------------------------------
