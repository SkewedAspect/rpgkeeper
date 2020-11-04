//----------------------------------------------------------------------------------------------------------------------
// Populate a default set of EotE/Genesys Abilities
//----------------------------------------------------------------------------------------------------------------------

exports.seed = function(knex)
{
    // Deletes ALL existing entries
    return knex('eote_forcepower').del()
        .where({ official: true })
        .then(() =>
        {
            // Inserts seed entries
            return knex('eote_forcepower').insert([
                {
                    id: 1,
                    name: 'Battle Meditation',
                    description: 'The Force user directs allies in battle, making them more effective as a coordinated unit.\n'
                        + 'The user may spend 3 <forcepoint></forcepoint> to add one automatic <success></success> to '
                        + 'all checks made by a number of engaged friendly targets up to his Presence before the end of his next '
                        + 'turn. If the user used any <darkside></darkside> to generate <forcepoint></forcepoint>, '
                        + 'reduce each target’s Willpower by 1 (to a minimum of 1) until the end of the encounter.',
                    min_rating: 2,
                    upgrades: JSON.stringify({
                        strength: {
                            available: 1,
                            description: 'Spend <forcepoint></force-point><forcepoint></forcepoint> to add one additional '
                                + 'automatic <success></success> to affected character\'s checks.'
                        },
                        magnitude: {
                            available: 4,
                            description: 'Spend <forcepoint></forcepoint> to affect a number of additional targets equal '
                                + 'to Presence per rank of Magnitude purchased.'
                        },
                        duration: {
                            available: 1,
                            description: 'Commit <force></force><force></force><force></force> to sustain the ongoing '
                                + 'effects of the power on each affected target while it remains in range.'
                        },
                        range: {
                            available: 3,
                            description: 'Spend <forcepoint></forcepoint> to increase the power\'s range by a number of '
                                + 'range bands equal to Range upgrades purchased.'
                        },
                        control: [
                            {
                                description: 'When making a <b>Battle Meditation power check</b>, the user may '
                                    + 'make an <b>Easy (<difficulty></difficulty>) Leadership check</b> as part of the '
                                    + 'pool. If the user is able to activate the power and succeeds on the check, he may '
                                    + 'send simple orders as part of the power.'
                            },
                            {
                                description: 'May suffer 4 strain to change the range of the power and range upgrades to '
                                    + 'planetary scale.'
                            }
                        ],
                        mastery: {
                            available: 1,
                            description: 'If no <darkside></darkside> were used to generate <forcepoint></forcepoint>, '
                                + 'choose one skill. While affected by the power, each affected character counts as having '
                                + 'the same number of ranks in the chosen skill as the affected character with the most '
                                + 'ranks in the skill. If the user used any <darkside></darkside> to generate '
                                + '<forcepoint></forcepoint>, each affected character must make an '
                                + '<b>Easy (<difficulty></difficulty>) Discipline check</b> if he wishes to resist obeying '
                                + 'orders.'
                        }
                    }),
                    reference: 'F-CRB:284',
                    official: true,
                    scope: 'public'
                },
                {
                    id: 2,
                    name: 'Bind',
                    description: 'The Force user restrains an enemy, preventing the target from acting.\n\nThe user may '
                        + 'spend <forcepoint></forcepoint> to immobilize a target within short range until the end of the '
                        + 'user\'s next turn.',
                    min_rating: 2,
                    upgrades: JSON.stringify({
                        strength: {
                            available: 3,
                            description: 'Spend <forcepoint></force-point><forcepoint></forcepoint> to disorient the '
                                + 'target for a number of rounds equal to the Strength upgrades purchased.'
                        },
                        magnitude: {
                            available: 3,
                            description: 'Spend <forcepoint></forcepoint> to affect 1 additional target within range '
                                + 'per rank of Magnitude purchased.'
                        },
                        duration: {
                            available: 1,
                            description: 'Commit <force></force><force></force><force></force> to sustain the ongoing '
                                + 'effects of the power on each affected target.'
                        },
                        range: {
                            available: 3,
                            description: 'Spend <forcepoint></forcepoint> to increase the power\'s range by a number of '
                                + 'range bands equal to Range upgrades purchased.'
                        },
                        control: [
                            {
                                description: 'Spend <forcepoint></forcepoint>; whenever a target affected by Bind takes '
                                    + 'an action, that target suffers strain equal to Willpower.'
                            },
                            {
                                description: 'Spend <forcepoint></forcepoint> to move the target one range band closer '
                                    + 'or farther away.'
                            }
                        ],
                        mastery: {
                            available: 1,
                            description: 'When the user is making a <b>Bind power check</b>, if the check was not already opposed, the user may roll an opposed <b>Discipline vs. Discipline check</b> against one target of the power. If no <darkside></darkside> were used to generate <forcepoint></forcepoint> and the user succeeds on the check, he may immediately stagger the target until the end of his next turn. If any <darkside></darkside> were used to generate <forcepoint></forcepoint> and the check succeeds, the target suffers a Critical Injury, adding +10 to the roll per <forcepoint></forcepoint> spent on the check.'
                        }
                    }),
                    reference: 'F-CRB:286',
                    official: true,
                    scope: 'public'
                },
                {
                    id: 3,
                    name: 'Control',
                    description: 'When making an Athletics check, the Force user may roll an <b>Enhance power check</b> '
                        + 'as part of the pool.\n\n The user may spend <forcepoint></forcepoint> to gain '
                        + '<success></success> or <advantage></advantage> (user\'s choice) on the check.',
                    min_rating: 2,
                    upgrades: JSON.stringify({
                        range: {
                            available: 3,
                            description: 'Spend <forcepoint></forcepoint> to increase the power\'s range by a number of '
                                + 'range bands equal to Range upgrades purchased.'
                        },
                        control: [
                            {
                                description: 'Enhance can be used with the Coordination skill.'
                            },
                            {
                                description: 'Enhance can be used with the Piloting (Planetary) skill.'
                            },
                            {
                                description: 'Enhance can be used with the Piloting (Space) skill.'
                            },
                            {
                                description: 'Ongoing effect: Commit <force></force>. The user increases his Agility '
                                    + 'characteristic by 1 (to a maximum of 6).'
                            },
                            {
                                description: 'Enhance can be used with the Resilience skill.'
                            },
                            {
                                description: 'Enhance can be used with the Brawl skill.'
                            },
                            {
                                description: 'Ongoing effect: Commit <force></force>. The user increases his Brawn '
                                    + 'characteristic by 1 (to a maximum of 6).'
                            },
                            {
                                description: 'Take a Force Leap action: Make an <b>Enhance power check</b>. The user '
                                    + 'may spend <forcepoint></forcepoint> to jump horizontally to any location in short range.'
                            },
                            {
                                description: 'When performing a Force Leap, the user can jump vertically in addition to '
                                    + 'jumping horizontally.'
                            },
                            {
                                description: 'The user can perform a Force Leap as a maneuver instead of an action.'
                            }
                        ]
                    }),
                    reference: 'F-CRB:288',
                    official: true,
                    scope: 'public'
                }
            ]);
        });
};

//----------------------------------------------------------------------------------------------------------------------
