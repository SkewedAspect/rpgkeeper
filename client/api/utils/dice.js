//----------------------------------------------------------------------------------------------------------------------
// DiceUtil
//----------------------------------------------------------------------------------------------------------------------

import _ from 'lodash';
import rpgdice from 'rpgdicejs';
import LRU from 'lru-cache';

// Dice Systems
import { fudgeChoices } from './dice-systems/fudge';
import { eoteChoices, eoteDiceSortOrder, eoteResultsSortOrder, cancelEotEResults } from './dice-systems/eote';

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

        // Useful properties
        this.eoteDiceSortOrder = eoteDiceSortOrder;
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
            return randomChoice(fudgeChoices);
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

    // We assume dice is in the form of `{ ability: 3, difficulty: 1, setback: 0, ... }`.
    rollEotE(dice)
    {
        let results = _.mapValues(dice, (count, die) =>
        {
            return _.reduce(_.range(count), (dieResults) =>
            {
                return dieResults.concat(randomChoice(eoteChoices[die]));
            }, []);
        });

        // We concat all the sub results together, and sort them.
        results = _.chain(eoteDiceSortOrder)
            .reduce((accum, die) => accum.concat(results[die]), [])
            .compact()
            .sortBy((dieResult) => eoteResultsSortOrder.indexOf(dieResult))
            .value();

        return {
            full: results,
            uncancelled: cancelEotEResults(results)
        };
    } // end rollEotE
} // end DiceUtil

//----------------------------------------------------------------------------------------------------------------------

export default new DiceUtil();

//----------------------------------------------------------------------------------------------------------------------
