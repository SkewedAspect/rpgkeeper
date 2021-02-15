//----------------------------------------------------------------------------------------------------------------------
// Convert the v2 database to sqlite.
//----------------------------------------------------------------------------------------------------------------------

const knex = require('knex');
const path = require('path');
const fs = require('fs/promises');

// Managers
const configMan = require('../../dist/server/managers/config').default;

// Utils
const { shortID, colorize, sortBy } = require('../../dist/server/utils/misc');

// Defaults
const { eote } = require('../../dist/server/systems/eote/defaults').default;

// Old Base DB
const users = require('./base/users.json');
const baseChars = require('./base/base_characters.json');

// Old EotE DB
const abilities = require('./eote/abilities.json');
const eoteChars = require('./eote/characters.json');
const forcePowers = require('./eote/forcePowers.json');
const talents = require('./eote/talents.json');

// External Data Dump
const eoteDump = require('./eote/eote-data-dump.json');

//----------------------------------------------------------------------------------------------------------------------

const activationMap = {
    'Passive': 'p',
    'Active (Incidental)': 'ai',
    'Active (Incidental - Out of turn)': 'aio',
    'Active (Maneuver)': 'am',
    'Active (Action)': 'aa'
};

const rangeMap = {
    engaged: 'en',
    short: 's',
    medium: 'm',
    long: 'l',
    extreme: 'ex'
};

const criticals = [
    {
        range: [ 1, 5 ],
        severity: 1,
        title: 'Minor Nick',
        description: 'The target suffers 1 strain.'
    },
    {
        range: [ 6, 10 ],
        severity: 1,
        title: 'Slowed Down',
        description: 'The target can only act during the last allied initiative slot on his next turn.'
    },
    {
        range: [ 11, 15 ],
        severity: 1,
        title: 'Sudden Jolt',
        description: 'The target drops whatever is in hand.'
    },
    {
        range: [ 16, 20 ],
        severity: 1,
        title: 'Distracted',
        description: 'The target cannot perform a free maneuver during his next turn.'
    },
    {
        range: [ 21, 25 ],
        severity: 1,
        title: 'Off-Balance',
        description: 'Add <setback></setback> to his next skill check.'
    },
    {
        range: [ 26, 30 ],
        severity: 1,
        title: 'Discouraging Wound',
        description: 'Flip one light side Destiny point to a dark side Destiny Point (reverse if NPC.)'
    },
    {
        range: [ 31, 35 ],
        severity: 1,
        title: 'Stunned',
        description: 'The target is staggered until the end of his next turn.'
    },
    {
        range: [ 36, 40 ],
        severity: 1,
        title: 'Stinger',
        description: 'Increase difficulty of next check by one.'
    },
    {
        range: [ 41, 45 ],
        severity: 2,
        title: 'Bowled Over',
        description: 'The target is knocked prone and suffers 1 strain.'
    },
    {
        range: [ 46, 50 ],
        severity: 2,
        title: 'Head Ringer',
        description: 'The target increases the difficulty of all Intellect and Cunning check by one until the end of the encounter.'
    },
    {
        range: [ 51, 55 ],
        severity: 2,
        title: 'Fearsome Wound',
        description: 'The target increases the difficulty of all Presence and Willpower check by one until the end of the encounter.'
    },
    {
        range: [ 56, 60 ],
        severity: 2,
        title: 'Agonizing Wound',
        description: 'The target increases the difficulty of all Brawn and Agility checks by one until the end of the encounter.'
    },
    {
        range: [ 61, 65 ],
        severity: 2,
        title: 'Slightly Dazed',
        description: 'The target is disoriented until the end of the encounter.'
    },
    {
        range: [ 66, 70 ],
        severity: 2,
        title: 'Scattered Senses',
        description: 'Remove all <boost></boost> from skill checks until the end of the encounter.'
    },
    {
        range: [ 71, 75 ],
        severity: 2,
        title: 'Hamstrung',
        description: 'The target loses his free maneuver until the end of the encounter.'
    },
    {
        range: [ 76, 80 ],
        severity: 2,
        title: 'Overpowered',
        description: 'The target leaves himself open, and the attacker may immediately attempt another free attack against him, using the exact same pool as the original attack.'
    },
    {
        range: [ 81, 85 ],
        severity: 2,
        title: 'Winded',
        description: 'Until the end of the encounter, the target cannot voluntarily suffer strain to activate any abilities or gain additional maneuvers.'
    },
    {
        range: [ 86, 90 ],
        severity: 2,
        title: 'Compromised',
        description: 'Increase difficulty of all skill check by one until the end of the encounter.'
    },
    {
        range: [ 91, 95 ],
        severity: 3,
        title: 'At the Brink',
        description: 'The target suffers 1 strain each time he performs an action.'
    },
    {
        range: [ 96, 100 ],
        severity: 3,
        title: 'Crippled',
        description: "One of the target's limbs (selected by the GM) is crippled until healed or replaced. Increase difficulty of all checks that require use of that limb by one."
    },
    {
        range: [ 101, 105 ],
        severity: 3,
        title: 'Maimed',
        description: 'A limb is permanently lost. Unless the target has a cybernetic replacement, the target cannot perform actions that would require the use of that limb. All other actions gain <setback></setback>.'
    },
    {
        range: [ 106, 110 ],
        severity: 3,
        title: 'Horrific Injury',
        description: "Randomly roll 1d10 to determine one of the target's characteristics&#8212; 1-3 for Brawn, 4-6 for Agility, 7 for Intellect, 8 for Cunning, 9 for Presence, 10 for Willpower. Until this Critical Inquiry is repaired, treat that characteristic as one point lower."
    },
    {
        range: [ 111, 115 ],
        severity: 3,
        title: 'Temporarily Lame',
        description: 'Until this Critical Injury is healed, the target cannot perform more than one maneuver during his turn.'
    },
    {
        range: [ 116, 120 ],
        severity: 3,
        title: 'Blinded',
        description: 'The target can no longer see Upgrade the difficulty of all checks twice. Upgrade the difficulty of Perception and Vigilance checks three times.'
    },
    {
        range: [ 121, 125 ],
        severity: 3,
        title: 'Knocked Senseless',
        description: 'The target is staggered for the remainder of the encounter.'
    },
    {
        range: [ 126, 130 ],
        severity: 4,
        title: 'Gruesome Injury',
        description: "Randomly roll 1d10 for one of the target's characteristics&#8212; 1-3 for Brawn, 4-6 for Agility, 7 for Intellect, 8 for Cunning, 9 for Presence, 10 for Willpower. That characteristic is permanently reduced by one, to a minimum of one."
    },
    {
        range: [ 131, 140 ],
        severity: 4,
        title: 'Bleeding Out',
        description: 'Every round, the target suffers 1 wound and 1 strain at the beginning of his turn. For every five wounds he suffers beyond his wound threshold, he suffers one additional Critical Injury. Roll on the chart, suffering the injury (if he suffers this result a second time due to this, roll again).'
    },
    {
        range: [ 141, 150 ],
        severity: 4,
        title: 'The End is Nigh',
        description: 'The target will die after the last Initiative slot during the next round.'
    },
    {
        range: [ 151, Infinity ],
        severity: undefined,
        title: 'Dead',
        description: 'Complete, obliterated death.'
    }
]; // end criticals

//----------------------------------------------------------------------------------------------------------------------

// It's too hard to parse the attachment string, so I'm hard-coding a hand-built list.
const oldCharWeaponAttachments = {
    '3jsDFU': [
        [],
        [ 'Superior Weapon Customization', 'Serrated Edge' ],
        [],
        [ 'Superior Weapon Customization', 'Serrated Edge', 'Stun Pulse' ]
    ],
    '4zt2Hf': [
        [ 'Superior Weapon Customization', 'Shadowsheath' ],
        [ 'Serrated Edge', 'Mono-Molecular Edge' ]
    ],
    '4DtGAM': [
        [],
        [],
        [],
        [ 'Dantari Crystal' ]
    ],
    '2gmFVI': [
        [ 'Superior Weapon Customization', 'Extended Hilt', 'Dantari Crystal' ]
    ],
    '2BkAY6': [
        [ 'Ilum Crystal', 'Superior Hilt' ]
    ]
};

//----------------------------------------------------------------------------------------------------------------------

function $levenshteinDistance(a, b)
{
    if(a.length === 0) { return b.length; }
    if(b.length === 0) { return a.length; }

    const matrix = [];

    // increment along the first column of each row
    let i;
    for(i = 0; i <= b.length; i++)
    {
        matrix[i] = [ i ];
    }

    // increment each column in the first row
    let j;
    for(j = 0; j <= a.length; j++)
    {
        matrix[0][j] = j;
    }

    // Fill in the rest of the matrix
    for(i = 1; i <= b.length; i++)
    {
        for(j = 1; j <= a.length; j++)
        {
            if(b.charAt(i - 1) === a.charAt(j - 1))
            {
                matrix[i][j] = matrix[i - 1][j - 1];
            }
            else
            {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // substitution
                    Math.min(
                        matrix[i][j - 1] + 1, // insertion
                        matrix[i - 1][j] + 1
                    )
                ); // deletion
            }
        }
    }

    return matrix[b.length][a.length];
} // end $levenshteinDistance

async function $lookupReference(referenceType, supplementName, db)
{
    const lookup = Object.values(eoteDump[referenceType] || {});
    const suppDef = lookup.find((supp) => supp.Name.toLowerCase() === supplementName.toLocaleLowerCase());

    if(suppDef)
    {
        const source = suppDef.Source[0];
        const [ title, page ] = source.split(' Page ');

        let titleAbbr = 'E-CRB';

        if(title.includes('Core Rulebook'))
        {
            if(title.includes('Edge'))
            {
                titleAbbr = 'E-CRB';
            }
            else if(title.includes('Age'))
            {
                titleAbbr = 'A-CRB';
            }
            else if(title.includes('Force'))
            {
                titleAbbr = 'F-CRB';
            } // end if
        }
        else
        {
            const results = await db('eote_reference')
                .select()
                .where('name', 'like', `%${ title }%`);

            titleAbbr = results[0].abbr;
        } // end if

        return `${ titleAbbr }:${ page.trim() || '99' }`;
    }
    else
    {
        // We have no freaking idea.
        return 'E-CRB:999';
    } // end if
} // end up

async function $getAccountID(email, db)
{
    const results = await db('account')
        .select()
        .where({ email });

    if(results.length > 0)
    {
        return results[0].account_id;
    } // end if
} // end $getAccountID

function $getCriticalValue(critName)
{
    const critObj = criticals.find((crit) => crit.title === critName);
    return critObj.range[0];
} // end $getCriticalValue

async function $buildTalents(talentList, db, system = 'eote')
{
    return Promise.all(talentList.map(async(talentInst) =>
    {
        const results = await db(`${ system }_talent`)
            .select()
            .where({ name: talentInst.name });

        if(results.length === 0)
        {
            throw new Error(`Failed to find talent '${ talentInst.name }'`);
        } // end if

        return {
            id: results[0].id,
            ranks: talentInst.ranks,
            notes: talentInst.notes
        };
    }));
} // end $buildTalents

async function $buildAbilities(abilityList, db, system = 'eote')
{
    return Promise.all(abilityList.map(async(abilityName) =>
    {
        // Handle the rename of 'Species Special Ability' to 'Species'.
        let name = abilityName ?? '';
        if([ 'Bothan', 'Human', 'Droid', 'Chiss', 'Kaleesh' ].includes(name.split(' ')[0]))
        {
            name = name.split(' ')[0];
        }

        const results = await db(`${ system }_ability`)
            .select()
            .where({ name });

        if(results.length === 0)
        {
            throw new Error(`Failed to find ability '${ name }'.`);
        } // end if

        return results[0].id;
    }));
} // end $buildAbilities

async function $buildForcePowers(powers, db)
{
    return Promise.all(powers.map(async(powerInst) =>
    {
        const [ dbFP ] = await db('eote_forcepower')
            .select()
            .where('name', 'LIKE', `%${ powerInst.name }%`);

        dbFP.upgrades = JSON.parse(dbFP.upgrades);

        const powerDetails = forcePowers[powerInst.name];
        const upgrades = powerInst.upgrades.reduce((results, upgradeInst) =>
        {
            const upgradeDetail = powerDetails.upgrades[upgradeInst.index];
            if(upgradeDetail.name.includes('Control'))
            {
                let matchIdx = undefined;
                let match = Infinity;
                dbFP.upgrades.control.forEach((control, index) =>
                {
                    const dist = $levenshteinDistance(control.description, upgradeDetail.description);
                    if(dist < match)
                    {
                        match = dist;
                        matchIdx = index;
                    } // end if
                });

                results.control.push(matchIdx);
            }
            else
            {
                const name = upgradeDetail.name.toLowerCase();
                results[name] = upgradeInst.ranks ?? 0;
            } // end if

            return results;
        }, { strength: 0, range: 0, mastery: 0, magnitude: 0, duration: 0, control: [] });

        return { id: dbFP.id, upgrades };
    }));
} // end $buildForcePowers

async function $buildArmorAttachments(armor, db, system = 'eote')
{
    const upgrades = armor?.upgrades ?? '';
    const armorAttachments = [];

    // Get all possible attachments
    const attachments = await db(`${ system }_attachment`)
        .select('id', 'name');

    // Loop through all possible, and see if the name is contained in the text field. This is problematic, but the best
    // we can do against a free form entry field.
    attachments.forEach(({ id, name }) =>
    {
        if(upgrades.includes(name))
        {
            armorAttachments.push(id);
        }
    });

    return armorAttachments;
}

async function $buildArmorQualities(armor, db, system = 'eote')
{
    const upgrades = armor?.upgrades ?? '';
    const armorQualities = [];

    // Get all possible qualities (that are armor related)
    const qualities = await db(`${ system }_quality`)
        .select('id', 'name', 'ranked')
        .whereNotIn('name', [
            'Breach',
            'Pierce'
        ]);

    // Loop through all possible, and see if the name is contained in the text field. This is problematic, but the best
    // we can do against a free form entry field.
    qualities.forEach(({ id, name, ranked }) =>
    {
        if(upgrades.includes(name))
        {
            armorQualities.push({ id, ranks: ranked ? 1 : undefined, name });
        }
    });

    return armorQualities.sort(sortBy('name')).map(({ name, ...qual }) => qual);
}

async function $buildWeaponAttachments(charID, weaponIdx, db, system = 'eote')
{
    const charAttachments = oldCharWeaponAttachments[charID]?.[weaponIdx] ?? [];

    // Get all possible attachments
    const attachments = await db(`${ system }_attachment`)
        .select('id', 'name');

    return charAttachments.map((name) =>
    {
        const attachment = attachments.find((attach) => attach.name.toLowerCase() === name.toLowerCase());
        if(attachment)
        {
            return attachment.id;
        }
        else
        {
            console.error(`Failed to find attachment '${ name }'.`);
        }
    });
}

async function $buildWeaponQualities(specials, db, system = 'eote')
{
    const weapQualities = [];
    const parser = /^([a-zA-z ]+)(\d+)?$/;

    // Get all possible qualities (that are armor related)
    const qualities = await db(`${ system }_quality`)
        .select('id', 'name', 'ranked');

    specials.forEach((special) =>
    {
        let [ _full, name, ranks ] = special.match(parser);

        name = name.trim();
        if(name.toLowerCase() === 'stun setting')
        {
            name = 'Stun';
        }

        const qual = qualities.find((item) => item.name.toLowerCase() === name.toLowerCase());
        if(qual)
        {
            weapQualities.push({
                id: qual.id,
                ranks: qual.ranked ? parseInt(ranks) : undefined,
                name: qual.name
            });
        }
        else
        {
            console.error('Failed to find quality:', special);
        }
    });

    return weapQualities.sort(sortBy('name')).map(({ name, ...qual }) => qual);
}

async function $buildWeapon(charID, weapIdx, weapon, db, system = 'eote')
{
    return {
        ...weapon,
        skill: weapon.skill.replaceAll(' ', ''),
        range: rangeMap[weapon.range.toLowerCase()],
        criticalRating: weapon.critical,
        encumbrance: 0,
        rarity: 0,
        attachments: await $buildWeaponAttachments(charID, weapIdx, db, system),
        qualities: await $buildWeaponQualities(weapon.special, db, system)
    };
}

async function $buildWeapons(charID, weapons, db, system = 'eote')
{
    if(weapons)
    {
        return Promise.all(weapons.map((weap, idx) => $buildWeapon(charID, idx, weap, db, system)));
    }

    return [];
}

//----------------------------------------------------------------------------------------------------------------------

async function init()
{
    // Set db config file
    configMan.set('database.connection.filename', path.resolve('./rpgk.db'));

    const db = knex(configMan.get('database'));

    // Build tables and run seeds
    await db.migrate.latest({ directory: '../../dist/server/knex/migrations' });
    await db.seed.run({ directory: '../../dist/server/knex/seeds' });

    // Cleanup the migration references
    await db.update({
        name: db.raw('replace(name, \'.js\', \'.ts\')')
    }).from('knex_migrations');

    return db;
} // end init

async function convertUsers(db)
{
    const accounts = Object.values(users).map((user) =>
    {
        return {
            hash_id: shortID(user.email),
            email: user.email,
            name: user.displayName || user.email.split('@')[0],
            avatar: user.avatar,
            permissions: '[]',
            settings: '{}'
        };
    });

    await Promise.all(accounts.map(async(account) =>
    {
        return db('account')
            .insert(account)
            .onConflict('email')
            .ignore();
    }));
} // end convertUsers

async function convertTalents(db)
{
    const eoteTalents = await Promise.all(Object.values(talents).map(async(talent, index) =>
    {
        return {
            id: index + 1,
            name: talent.name,
            description: talent.description,
            activation: activationMap[talent.activation],
            ranked: !!talent.ranked,
            trees: (talent.trees || []).join(', '),
            reference: await $lookupReference('Talents', talent.name, db),
            official: true,
            scope: 'public'
        };
    }));

    // Dump this for use as a db seed
    await fs.writeFile('./convertedTalents.json', JSON.stringify(eoteTalents, null, 4), 'utf8');

    // Also, insert this, because why not?
    await db('eote_talent')
        .insert(eoteTalents)
        .onConflict('id')
        .ignore();
} // end convertTalents

async function convertCharacters(db)
{
    // We only convert EotE character, and we skip the one non-eote character that was shoved in the eote system.
    const eoteCharRecords = Object.values(baseChars).filter((char) => char.system === 'eote');

    await Promise.all(eoteCharRecords.map(async(oldChar) =>
    {
        console.log(`Converting ${ oldChar.id }: ${ oldChar.name }...`);

        const system = [ 'Ir26P' ].includes(oldChar.id) ? 'genesys' : 'eote';

        // Get char details
        const oldCharDetails = eoteChars[oldChar.id];

        // Always create a notebook
        const [ note_id ] = await db('note').insert({ hash_id: shortID() });

        // Build char record
        const char = {
            hash_id: oldChar.id,
            system,
            name: oldChar.name,
            description: oldChar.description ?? '',
            portrait: oldChar.portrait ?? '',
            thumbnail: oldChar.thumbnail ?? '',
            color: colorize(oldChar.name),
            campaign: '',
            details: '{}',
            note_id,
            account_id: await $getAccountID(oldChar.user, db)
        };

        //--------------------------------------------------------------------------------------------------------------
        // Handle notes
        //--------------------------------------------------------------------------------------------------------------

        let notePages = [];

        if(oldChar.biography)
        {
            notePages.push({ title: 'Biography', content: oldChar.biography, note_id });
        } // end if

        if(oldCharDetails.quickNotes)
        {
            notePages.push({ title: 'Quick Notes', content: oldCharDetails.quickNotes, note_id });
        } // end if

        if((oldCharDetails.notes || []).length > 0)
        {
            notePages = notePages.concat(oldCharDetails.notes.map((note) =>
            {
                return {
                    title: note.name,
                    content: note.content,
                    note_id
                };
            }));
        } // end if

        if(notePages.length > 0)
        {
            await db('note_page').insert(notePages);
        } // end if

        //--------------------------------------------------------------------------------------------------------------
        // Handle char details
        //--------------------------------------------------------------------------------------------------------------

        try
        {
            const details = {
                career: oldCharDetails.career ?? 'unknown',
                species: oldCharDetails.species ?? 'unknown',
                specialization: (oldCharDetails.specialization || []).join(', '),
                characteristics: {
                    brawn: oldCharDetails.characteristics?.find((charac) => charac.name === 'Brawn')?.ranks || 0,
                    agility: oldCharDetails.characteristics?.find((charac) => charac.name === 'Agility')?.ranks || 0,
                    intellect: oldCharDetails.characteristics?.find((charac) => charac.name === 'Intellect')?.ranks || 0,
                    cunning: oldCharDetails.characteristics?.find((charac) => charac.name === 'Cunning')?.ranks || 0,
                    willpower: oldCharDetails.characteristics?.find((charac) => charac.name === 'Willpower')?.ranks || 0,
                    presence: oldCharDetails.characteristics?.find((charac) => charac.name === 'Presence')?.ranks || 0
                },
                experience: {
                    total: oldCharDetails.totalXP,
                    available: oldCharDetails.availableXP
                },
                defenses: {
                    soak: oldCharDetails.soak,
                    melee: oldCharDetails.meleeDefense,
                    ranged: oldCharDetails.rangedDefense
                },
                health: {
                    wounds: oldCharDetails.wounds ?? 0,
                    woundThreshold: oldCharDetails.woundThreshold ?? 0,
                    strain: oldCharDetails.strain ?? 0,
                    strainThreshold: oldCharDetails.strainThreshold ?? 0,
                    criticalInjuries: (oldCharDetails.criticals || []).map((critName) => ({
                        name: critName,
                        value: $getCriticalValue(critName) ?? 0
                    })),
                    stimsUsed: 0,
                    staggered: false,
                    immobilized: false,
                    disoriented: false
                },
                skills: oldCharDetails.skills?.map((skill) =>
                {
                    return {
                        ...skill,
                        ranks: skill.ranks ?? 0,
                        characteristic: skill.characteristic.toLowerCase()
                    };
                }) ?? eote.character.skills,
                force: {
                    rating: oldCharDetails.forceRank,
                    committed: oldCharDetails.forceCommitted,
                    powers: await $buildForcePowers(oldCharDetails.forcePowers, db, system),
                    sensitive: oldCharDetails.forceRank > 0
                },
                gear: [],
                talents: await $buildTalents(oldCharDetails.talents ?? [], db, system),
                abilities: await $buildAbilities(oldCharDetails.abilities ?? [], db, system),

                armor: {
                    name: oldCharDetails.armor?.name ?? '',
                    defense: oldCharDetails.armor?.defense ?? 0,
                    soak: oldCharDetails.armor?.soak ?? 0,
                    hardpoints: oldCharDetails.armor?.hardPoints ?? 0,
                    encumbrance: oldCharDetails.armor?.encumbrance ?? 0,
                    rarity: 0,
                    attachments: await $buildArmorAttachments(oldCharDetails.armor, db, system),
                    qualities: await $buildArmorQualities(oldCharDetails.armor, db, system)
                },
                weapons: await $buildWeapons(oldChar.id, oldCharDetails.weapons, db, system)
            };

            // Update our details
            char.details = JSON.stringify(details);

            // Save to the db
            await db('character').insert(char);

            console.log(`  ...finished ${ char.hash_id }: ${ char.name }`);
        }
        catch (error)
        {
            console.error(`Failed to build ${ char.hash_id }: ${ char.name }. Error:`, error.stack);
            process.exit(1);
        }
    }));
} // end convertCharacters

//----------------------------------------------------------------------------------------------------------------------

init()
    .then(async(db) =>
    {
        console.log('Database created successfully...');

        // Import users
        await convertUsers(db);

        // This was used to build a seeds file, so no need to run it every time.
        // await convertTalents(db);

        // Import characters
        await convertCharacters(db);

        console.log('Script complete.');
        process.exit();
    })
    .catch((error) =>
    {
        console.error('Script failed.', error.stack);
        process.exit(1);
    });

//----------------------------------------------------------------------------------------------------------------------
