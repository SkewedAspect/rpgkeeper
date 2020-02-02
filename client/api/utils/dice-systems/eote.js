//----------------------------------------------------------------------------------------------------------------------
// EotEDice
//----------------------------------------------------------------------------------------------------------------------

import _ from 'lodash';

//----------------------------------------------------------------------------------------------------------------------

export const eoteChoices = {
    ability: [
        undefined,
        'success',
        'success',
        [ 'success', 'success' ],
        'advantage',
        'advantage',
        [ 'success', 'advantage' ],
        [ 'advantage', 'advantage' ]
    ],
    proficiency: [
        undefined,
        'success',
        'success',
        [ 'success', 'success' ],
        [ 'success', 'success' ],
        'advantage',
        [ 'success', 'advantage' ],
        [ 'success', 'advantage' ],
        [ 'success', 'advantage' ],
        [ 'advantage', 'advantage' ],
        [ 'advantage', 'advantage' ],

        // We add 'success' to the results, since a triumph is both a success and a triumph, for roll resolution.
        [ 'triumph', 'success' ]
    ],
    difficulty: [
        undefined,
        'failure',
        [ 'failure', 'failure' ],
        'threat',
        'threat',
        'threat',
        [ 'threat', 'threat' ],
        [ 'failure', 'threat' ]
    ],
    challenge: [
        undefined,
        'failure',
        'failure',
        [ 'failure', 'failure' ],
        [ 'failure', 'failure' ],
        'threat',
        'threat',
        [ 'failure', 'threat' ],
        [ 'failure', 'threat' ],
        [ 'threat', 'threat' ],
        [ 'threat', 'threat' ],

        // We add 'failure' to the results, since a despair is both a failure and a despair, for roll resolution.
        [ 'despair', 'failure' ]
    ],
    boost: [
        undefined,
        undefined,
        'success',
        [ 'success', 'advantage' ],
        [ 'advantage', 'advantage' ],
        'advantage'
    ],
    setback: [
        undefined,
        undefined,
        'failure',
        'failure',
        'threat',
        'threat'
    ],
    force: [
        'darkside',
        'darkside',
        'darkside',
        'darkside',
        'darkside',
        'darkside',
        [ 'darkside', 'darkside' ],
        'lightside',
        'lightside',
        [ 'lightside', 'lightside' ],
        [ 'lightside', 'lightside' ],
        [ 'lightside', 'lightside' ]
    ]
};

export const eoteDiceSortOrder = [
    'force',
    'proficiency',
    'ability',
    'challenge',
    'difficulty',
    'boost',
    'setback'
];

export const eoteResultsSortOrder = [
    'advantage',
    'threat',
    'success',
    'failure',
    'triumph',
    'despair',
    'lightside',
    'darkside'
];

//----------------------------------------------------------------------------------------------------------------------

/**
 * Takes the results of an Edge of the Empire style dice roll, and cancels the results correctly.
 *
 * @param {string[]} results - The results of the dice roll.
 *
 * @returns {string[]} The uncancelled results.
 */
export function cancelEotEResults(results)
{
    const uncancelled = [];
    const counts = _.countBy(results);

    // Default the count results
    counts.success = counts.success || 0;
    counts.failure = counts.failure || 0;
    counts.advantage = counts.advantage || 0;
    counts.threat = counts.threat || 0;
    counts.triumph = counts.triumph || 0;
    counts.despair = counts.despair || 0;
    counts.lightside = counts.lightside || 0;
    counts.darkside = counts.darkside || 0;

    // Cancel success/failures
    if(counts.success > counts.failure)
    {
        _.each(_.range(counts.success - counts.failure), () => { uncancelled.push('success'); });
    }
    else
    {
        _.each(_.range(counts.failure - counts.success), () => { uncancelled.push('failure'); });
    } // end if

    // Cancel advantage/threat
    if(counts.advantage > counts.threat)
    {
        _.each(_.range(counts.advantage - counts.threat), () => { uncancelled.push('advantage'); });
    }
    else
    {
        _.each(_.range(counts.threat - counts.advantage), () => { uncancelled.push('threat'); });
    } // end if

    // Add back in triumph
    _.each(_.range(counts.triumph), () => { uncancelled.push('triumph'); });

    // Add back in despair
    _.each(_.range(counts.despair), () => { uncancelled.push('despair'); });

    // Add back in light side
    _.each(_.range(counts.lightside), () => { uncancelled.push('lightside'); });

    // Add back in dark side
    _.each(_.range(counts.darkside), () => { uncancelled.push('darkside'); });

    return _.sortBy(uncancelled, (dieResult) => eoteResultsSortOrder.indexOf(dieResult));
} // end cancelResults

//----------------------------------------------------------------------------------------------------------------------
