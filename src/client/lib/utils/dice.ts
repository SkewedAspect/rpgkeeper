//----------------------------------------------------------------------------------------------------------------------
// DiceUtil
//----------------------------------------------------------------------------------------------------------------------

import _ from 'lodash';
import { LRU } from './lru';
import rpgdice, { Roll } from 'rpgdicejs';

// Dice Systems
import { fudgeChoices } from './dice-systems/fudge';
import {
    cancelEotEResults,
    criticals,
    eoteChoices,
    eoteDiceSortOrder,
    eoteResultsSortOrder,
    findCritical,
} from './dice-systems/eote';

// Interfaces
import { EoteCritical } from '@rpgk/core/models/systems';

//----------------------------------------------------------------------------------------------------------------------

/**
 * Rolls a random die, of the given sides.
 *
 * @param [sides=1] - The number of sides of the die to roll.
 *
 * @returns Returns a random number.
 */
function randomDieRoll(sides = 1) : number
{
    return Math.floor(Math.random() * sides);
}

/**
 * Chooses an item form a list at random.
 *
 * @param choices - The list to choose an item out of.
 *
 * @returns Returns an item from the list, randomly chosen.
 */
function randomChoice<T>(choices : T[]) : T
{
    return choices[randomDieRoll(choices.length)];
}

//----------------------------------------------------------------------------------------------------------------------

class DiceUtil
{
    #cache : LRU;

    public eoteDiceSortOrder : typeof eoteDiceSortOrder;
    public eoteCriticals : EoteCritical[];

    constructor()
    {
        this.#cache = new LRU(50);

        // Useful properties
        this.eoteDiceSortOrder = eoteDiceSortOrder;
        this.eoteCriticals = criticals;
    }

    roll(rollTxt : string, scope ?: Record<string, unknown>) : Roll
    {
        // We cache the expression objects, since they're costly to create, and can be evaluated multiple times.
        let expr = this.#cache.get(rollTxt);
        if(!expr)
        {
            expr = rpgdice.parse(rollTxt);
            this.#cache.set(rollTxt, expr);
        }

        return expr.eval(scope);
    }

    rollFudge(bonus = 0) : { render() : string, value : number }
    {
        const results = _.map(_.range(4), () =>
        {
            return randomChoice(fudgeChoices);
        });

        const rollTotal = _.reduce(results, (total, rollResult) =>
        {
            return total + parseInt(rollResult as string);
        }, 0);

        return {
            render: () =>
            {
                return `[ ${ results.join(', ') } ] + ${ bonus }`;
            },
            value: rollTotal + bonus,
        };
    }

    // We assume dice is in the form of `{ ability: 3, difficulty: 1, setback: 0, ... }`.
    rollEotE(dice : Record<string, number>) : { full : string[], uncancelled : string[] }
    {
        const results = _.mapValues(dice, (count : number, die : string) =>
        {
            return _.reduce(_.range(count), (dieResults) =>
            {
                return dieResults.concat(randomChoice(eoteChoices[die]));
            }, []);
        });

        // We concat all the sub results together, and sort them.
        const sorted = _.chain(eoteDiceSortOrder)
            .reduce((accum, die) => accum.concat(results[die]), [])
            .compact()
            .sortBy((dieResult) => eoteResultsSortOrder.indexOf(dieResult))
            .value();

        return {
            full: sorted,
            uncancelled: cancelEotEResults(sorted),
        };
    }

    rollEotECritical(bonus = 0) : EoteCritical | undefined
    {
        const roll = randomDieRoll(100) + bonus;
        return findCritical(roll);
    }
}

//----------------------------------------------------------------------------------------------------------------------

export default new DiceUtil();

//----------------------------------------------------------------------------------------------------------------------
