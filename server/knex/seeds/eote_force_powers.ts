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
                            description: 'Spend <forcepoint></forcepoint><forcepoint></forcepoint> to add one additional '
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
                            description: 'Spend <forcepoint></forcepoint><forcepoint></forcepoint> to disorient the '
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
                            description: 'When the user is making a <b>Bind power check</b>, if the check was not '
                                + 'already opposed, the user may roll an opposed <b>Discipline vs. Discipline check</b> '
                                + 'against one target of the power. If no <darkside></darkside> were used to '
                                + 'generate <forcepoint></forcepoint> and the user succeeds on the check, he may '
                                + 'immediately stagger the target until the end of his next turn. If any '
                                + '<darkside></darkside> were used to generate <forcepoint></forcepoint> and the check '
                                + 'succeeds, the target suffers a Critical Injury, adding +10 to the roll per '
                                + '<forcepoint></forcepoint> spent on the check.'
                        }
                    }),
                    reference: 'F-CRB:286',
                    official: true,
                    scope: 'public'
                },
                {
                    id: 3,
                    name: 'Enhance',
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
                                    + 'may spend <forcepoint></forcepoint> to jump horizontally to any location in '
                                    + 'short range.'
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
                },
                {
                    id: 4,
                    name: 'Foresee',
                    description: 'The Force user can feel the Force flowing around everything, seeing what is and what '
                        + 'will be.\nThe user may spend <forcepoint></forcepoint> to gain vague hints of events to come, '
                        + 'up to a day into his own, personal future.',
                    min_rating: 1,
                    upgrades: JSON.stringify({
                        strength: {
                            available: 2,
                            description: 'Spend <forcepoint></forcepoint> to pick out specific details equal to '
                                + 'Strength upgrades purchased.'
                        },
                        magnitude: {
                            available: 2,
                            description: 'Spend <forcepoint></forcepoint> to increase targets affected equal to '
                                + 'Magnitude upgrades purchased.'
                        },
                        duration: {
                            available: 2,
                            description: 'Spend <forcepoint></forcepoint> to increase the days into the future the '
                                + 'user can see equal to Duration upgrades purchased.'
                        },
                        range: {
                            available: 3,
                            description: 'Spend <forcepoint></forcepoint> to increase power\'s range by a number of '
                                + 'range bands equal to Range upgrades purchased.'
                        },
                        control: [
                            {
                                description: 'When making a skill check to determine Initiative, the user may roll a '
                                    + '<b>Foresee power check</b> as part of the pool. He may spend '
                                    + '<forcepoint></forcepoint> to gain <success></success> on the check.'
                            },
                            {
                                description: 'When performing a <b>Foresee power check</b> as part of an Initiative '
                                    + 'check, the user may spend <forcepoint></forcepoint> to allow all affected targets '
                                    + 'to take one free maneuver before the first round of combat begins.'
                            },
                            {
                                description: 'Affected targets increase their ranged and melee defense by 2 for the '
                                    + 'first round of combat.'
                            }
                        ]
                    }),
                    reference: 'F-CRB:290',
                    official: true,
                    scope: 'public'
                },
                {
                    id: 5,
                    name: 'Heal/Harm',
                    description: 'The Force user bolsters his ally with renewed vigor or saps his foe of vital '
                        + 'energy.\n<b>Heal (light side Force user only):</b> Spend <forcepoint></forcepoint> to heal '
                        + 'a number of wounds equal to Intellect from an engaged living creature (including user).\n'
                        + '<b>Harm:</b> Spend <forcepoint></forcepoint> to inflict a number of wounds equal to '
                        + 'Intellect (ignoring soak) on an engaged living target. The user gains 1 Conflict.',
                    min_rating: 1,
                    upgrades: JSON.stringify({
                        strength: {
                            available: 2,
                            description: '<b>Heal:</b> Spend <forcepoint></forcepoint> to increase wounds healed by '
                                + '1 per rank of Strength upgrades purchased.\n<b>Harm:</b> Spend '
                                + '<forcepoint></forcepoint> to increase wounds inflicted by 1 per rank of Strength '
                                + 'upgrades purchased.'
                        },
                        magnitude: {
                            available: 3,
                            description: 'Spend <forcepoint></forcepoint><forcepoint></forcepoint> to affect 1 '
                                + 'additional target within the range per rank of Magnitude purchased.'
                        },
                        range: {
                            available: 2,
                            description: 'Spend <forcepoint></forcepoint> to increase power\'s range by a number of '
                                + 'range bands equal to Range upgrades purchased.'
                        },
                        mastery: {
                            available: 1,
                            description: '<b>Heal:</b> Once per session, spend '
                                + '<forcepoint></forcepoint><forcepoint></forcepoint><forcepoint></forcepoint>'
                                + '<forcepoint></forcepoint> to restore 1 target who died after end of user\'s last '
                                + 'turn to life.\n<b>Harm:</b> Once per session, when this power kills a target, may '
                                + 'restore one engaged character who died this encounter to life. Each character gains '
                                + '7 Conflict.'
                        },
                        control: [
                            {
                                description: '<b>Heal:</b> If no <darkside></darkside> generated '
                                    + '<forcepoint></forcepoint>, target heals strain equal to wounds healed.\n'
                                    + '<b>Harm:</b> If any <darkside></darkside> were used to generate '
                                    + '<forcepoint></forcepoint>, user heals strain equal to wounds inflicted.'
                            },
                            {
                                description: '<b>Heal:</b> Spend <forcepoint></forcepoint> to remove one status '
                                    + 'effect from target.\n<b>Harm:</b> The user may spend <forcepoint></forcepoint> '
                                    + 'to heal wounds equal to wounds inflicted on target. Healed Character gains 1 '
                                    + 'Conflict.'
                            },
                            {
                                description: '<b>Heal:</b> May make a <b>Heal power check</b> combined with a '
                                    + '<b>Hard (<difficulty></difficulty><difficulty></difficulty>'
                                    + '<difficulty></difficulty>) Medicine check</b>. If check succeeds, one target who '
                                    + 'heals wounds also heals one Critical Injury.\n<b>Harm:</b> May make a <b>Harm '
                                    + 'power check</b> combined with an <b>opposed Medicine vs. Resilience check</b>. '
                                    + 'If check succeeds, one target who suffers wounds also suffers one Critical '
                                    + 'Injury (adding +10 to the roll per <advantage></advantage>'
                                    + '<advantage></advantage>).'
                            }
                        ]
                    }),
                    reference: 'F-CRB:292',
                    official: true,
                    scope: 'public'
                },
                {
                    id: 6,
                    name: 'Influence',
                    description: '',
                    min_rating: 1,
                    upgrades: JSON.stringify({
                        strength: {
                            available: 0,
                            description: ''
                        },
                        magnitude: {
                            available: 0,
                            description: ''
                        },
                        duration: {
                            available: 0,
                            description: ''
                        },
                        range: {
                            available: 0,
                            description: ''
                        },
                        mastery: {
                            available: 0,
                            description: ''
                        },
                        control: [
                            {
                                description: ''
                            },
                            {
                                description: ''
                            }
                        ]
                    }),
                    reference: 'F-CRB:294',
                    official: true,
                    scope: 'public'
                },
                {
                    id: 7,
                    name: 'Misdirect',
                    description: '',
                    min_rating: 1,
                    upgrades: JSON.stringify({
                        strength: {
                            available: 0,
                            description: ''
                        },
                        magnitude: {
                            available: 0,
                            description: ''
                        },
                        duration: {
                            available: 0,
                            description: ''
                        },
                        range: {
                            available: 0,
                            description: ''
                        },
                        mastery: {
                            available: 0,
                            description: ''
                        },
                        control: [
                            {
                                description: ''
                            },
                            {
                                description: ''
                            }
                        ]
                    }),
                    reference: 'F-CRB:296',
                    official: true,
                    scope: 'public'
                },
                {
                    id: 8,
                    name: 'Move',
                    description: '',
                    min_rating: 1,
                    upgrades: JSON.stringify({
                        strength: {
                            available: 0,
                            description: ''
                        },
                        magnitude: {
                            available: 0,
                            description: ''
                        },
                        duration: {
                            available: 0,
                            description: ''
                        },
                        range: {
                            available: 0,
                            description: ''
                        },
                        mastery: {
                            available: 0,
                            description: ''
                        },
                        control: [
                            {
                                description: ''
                            },
                            {
                                description: ''
                            }
                        ]
                    }),
                    reference: 'F-CRB:298',
                    official: true,
                    scope: 'public'
                },
                {
                    id: 9,
                    name: 'Protect/Unleash',
                    description: '',
                    min_rating: 3,
                    upgrades: JSON.stringify({
                        strength: {
                            available: 0,
                            description: ''
                        },
                        magnitude: {
                            available: 0,
                            description: ''
                        },
                        duration: {
                            available: 0,
                            description: ''
                        },
                        range: {
                            available: 0,
                            description: ''
                        },
                        mastery: {
                            available: 0,
                            description: ''
                        },
                        control: [
                            {
                                description: ''
                            },
                            {
                                description: ''
                            }
                        ]
                    }),
                    reference: 'F-CRB:300',
                    official: true,
                    scope: 'public'
                },
                {
                    id: 10,
                    name: 'Seek',
                    description: '',
                    min_rating: 1,
                    upgrades: JSON.stringify({
                        strength: {
                            available: 0,
                            description: ''
                        },
                        magnitude: {
                            available: 0,
                            description: ''
                        },
                        duration: {
                            available: 0,
                            description: ''
                        },
                        range: {
                            available: 0,
                            description: ''
                        },
                        mastery: {
                            available: 0,
                            description: ''
                        },
                        control: [
                            {
                                description: ''
                            },
                            {
                                description: ''
                            }
                        ]
                    }),
                    reference: 'F-CRB:302',
                    official: true,
                    scope: 'public'
                },
                {
                    id: 11,
                    name: 'Sense',
                    description: '',
                    min_rating: 1,
                    upgrades: JSON.stringify({
                        strength: {
                            available: 0,
                            description: ''
                        },
                        magnitude: {
                            available: 0,
                            description: ''
                        },
                        duration: {
                            available: 0,
                            description: ''
                        },
                        range: {
                            available: 0,
                            description: ''
                        },
                        mastery: {
                            available: 0,
                            description: ''
                        },
                        control: [
                            {
                                description: ''
                            },
                            {
                                description: ''
                            }
                        ]
                    }),
                    reference: 'F-CRB:304',
                    official: true,
                    scope: 'public'
                }
            ]);
        });
};

//----------------------------------------------------------------------------------------------------------------------
