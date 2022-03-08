//----------------------------------------------------------------------------------------------------------------------
// RollsService
//----------------------------------------------------------------------------------------------------------------------

import Vue from 'vue';
import diceSvc from '../../../../client/components/dice/diceService';

//----------------------------------------------------------------------------------------------------------------------

class RollsService
{
    constructor()
    {
        this.state = {
            results: []
        };
    }

    clearResults()
    {
        Vue.set(this.state, 'results', []);
    }

    roll(rollText, scope, title)
    {
        const roll = diceSvc.roll(rollText, scope);

        this.state.results.unshift({
            title,
            roll: {
                value: roll.value,
                text: roll.render()
            }
        });
    }
}

//----------------------------------------------------------------------------------------------------------------------

export default new RollsService();

//----------------------------------------------------------------------------------------------------------------------
