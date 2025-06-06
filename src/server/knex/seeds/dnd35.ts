//----------------------------------------------------------------------------------------------------------------------

import { Knex } from 'knex';

//----------------------------------------------------------------------------------------------------------------------

const dnd35Classes = [
    {
        id: 1,
        name: 'Barbarian',
        description: 'From the frozen wastes of the north and the hellish jungles of the south come brave, even reckless, warriors. Civilized people call them barbarians or berserkers and suspect them of mayhem, impiety, and atrocities. These “barbarians,” however, have proven their mettle and their value to those who would be their allies. To enemies who underestimated them, they have proved their cunning, rereferencefulness, persistence, and mercilessness.',
        features: [
            {
                name: 'Weapon and Armor Proficiency',
                description: 'A barbarian is proficient with all simple and martial weapons, light armor, medium armor, and shields (except tower shields).',
            },
            {
                name: 'Fast Movement',
                type: 'ex',
                description: 'A barbarian’s land speed is faster than the norm for his race by +10 feet. This benefit applies only when he is wearing no armor, light armor, or medium armor and not carrying a heavy load. Apply this bonus before modifying the barbarian’s speed because of any load carried or armor worn. For example, a human barbarian has a speed of 40 feet, rather than 30 feet, when wearing light or no armor. When wearing medium armor or carrying a medium load, his speed drops to 30 feet. A halfling barbarian has a speed of 30 feet, rather than 20 feet, in light or no armor. When wearing medium armor or carrying a medium load, his speed drops to 20 feet.' },
            {
                name: 'Illiteracy',
                description: 'Barbarians are the only characters who do not automatically know how to read and write. A barbarian may spend 2 skill points to gain the ability to read and write all languages he is able to speak.\n\nA barbarian who gains a level in any other class automatically gains literacy. Any other character who gains a barbarian level does not lose the literacy he or she already had.',
            },
            {
                name: 'Rage',
                type: 'ex',
                description: 'A barbarian can fly into a screaming blood frenzy a certain number of times per day. In a rage, a barbarian gains phenomenal strength and durability but becomes reckless and less able to defend himself. He temporarily gains a +4 bonus to Strength, a +4 bonus to Constitution, and a +2 morale bonus on Will saves, but he takes a –2 penalty to Armor Class.\n\nThe increase in Constitution increases the barbarian’s hit points by 2 points per level, but these hit points go away at the end of the rage when his Constitution score drops back to normal. (These extra hit points are not lost first the way temporary hit points are; see Temporary Hit Points) While raging, a barbarian cannot use any Charisma-, Dexterity-, or Intelligence-based skills (except for Balance, Escape Artist, Intimidate, and Ride), the Concentration skill, or any abilities that require patience or concentration, nor can he cast spells or activate magic items that require a command word, a spell trigger (such as a wand), or spell completion (such as a scroll) to function. He can use any feat he has except Combat Expertise, item creation feats, and metamagic feats. A fit of rage lasts for a number of rounds equal to 3 + the character’s (newly improved) Constitution modifier. A barbarian may prematurely end his rage. At the end of the rage, the barbarian loses the rage modifiers and restrictions and becomes fatigued (–2 penalty to Strength, –2 penalty to Dex- terity, can’t charge or run) for the duration of the current encounter (unless he is a 17th-level barbarian, at which point this limitation no longer applies).\n\nA barbarian can fly into a rage only once per encounter. At 1st level he can use his rage ability once per day. At 4th level and every four levels thereafter, he can use it one additional time per day (to a maximum of six times per day at 20th level). Entering a rage takes no time itself, but a barbarian can do it only during his action (see Initiative), not in response to someone else’s action. A barbarian can’t, for example, fly into a rage when struck down by an arrow in order to get the extra hit points from the increased Constitution, although the extra hit points would be of benefit if he had gone into a rage earlier in the round, _before_ the arrow struck.',
            },
            {
                name: 'Uncanny Dodge',
                type: 'ex',
                description: 'At 2nd level, a barbarian gains the ability to react to danger before his senses would normally allow him to do so. He retains his Dexterity bonus to AC (if any) even if he is caught flat-footed or struck by an invisible attacker. However, he still loses his Dexterity bonus to AC if immobilized.\n\nIf a barbarian already has uncanny dodge from a different class (a barbarian with at least four levels of rogue, for example), he automatically gains improved uncanny dodge instead.',
            },
            {
                name: 'Trap Sense',
                type: 'ex',
                description: 'Starting at 3rd level, a barbarian has an intuitive sense that alerts him to danger from traps, giving him a +1 bonus on Reflex saves made to avoid traps and a +1 dodge bonus to AC against attacks made by traps. These bonuses rise by +1 every three barbarian levels thereafter (6th, 9th, 12th, 15th, and 18th level). Trap sense bonuses gained from multiple classes stack.',
            },
            {
                name: 'Improved Uncanny Dodge',
                type: 'ex',
                description: 'At 5th level and higher, a barbarian can no longer be flanked; he can react to opponents on opposite sides of him as easily as he can react to a single attacker. This defense denies a rogue the ability to sneak attack the barbarian by flanking him, unless the attacker has at least four more rogue levels than the target has barbarian levels.\n\nIf a character already has uncanny dodge (see above) from a second class, the character automatically gains improved uncanny dodge instead, and the levels from the classes that grant uncanny dodge stack to determine the minimum level a rogue must be to flank the character.',
            },
            {
                name: 'Damage Reduction',
                type: 'ex',
                description: 'At 7th level, a barbarian gains the ability to shrug off some amount of injury from each blow or attack. Subtract 1 from the damage the barbarian takes each time he is dealt damage from a weapon or a natural attack. At 10th level, and every three barbarian levels thereafter (13th, 16th, and 19th level), this damage reduction rises by 1 point. Damage reduction can reduce damage to 0 but not below 0.',
            },
            {
                name: 'Greater Rage',
                type: 'ex',
                description: 'At 11th level, a barbarian’s bonuses to Strength and Constitution during his rage each increase to +6, and his morale bonus on Will saves increases to +3. The penalty to AC remains at –2.',
            },
            {
                name: 'Indomitable Will',
                type: 'ex',
                description: 'While in a rage, a barbarian of 14th level or higher gains a +4 bonus on Will saves to resist enchantment spells. This bonus stacks with all other modifiers, including the morale bonus on Will saves he also receives during his rage.',
            },
            {
                name: 'Tireless Rage',
                type: 'ex',
                description: 'At 17th level and higher, a barbarian no longer becomes fatigued at the end of his rage.',
            },
            {
                name: 'Mighty Rage',
                type: 'ex',
                description: 'At 20th level, a barbarian’s bonuses to Strength and Constitution during his rage each increase to +8, and his morale bonus on Will saves increases to +4. The penalty to AC remains at –2.',
            },
        ],
        reference: 'PHB:23',
        official: true,
        scope: 'public',
    },
    {
        id: 2,
        name: 'Bard',
        description: 'It is said that music has a special magic, and the bard proves that saying true. Wandering across the land, gathering lore, telling stories, working magic with his music, and living on the gratitude of his audience—such is the life of a bard. When chance or opportunity draws them into a conflict, bards serve as diplomats, negotiators, messengers, scouts, and spies.\n\nA bard’s magic comes from the heart. If his heart is good, a bard brings hope and courage to the downtrodden and uses his tricks, music, and magic to thwart the schemes of evildoers. If the nobles of the land are corrupt, the good bard is an enemy of the state, cunningly evading capture and raising the spirits of the oppressed. But music can spring from an evil heart as well. Evil bards forego blatant violence in favor of manipulation, holding sway over the hearts and minds of others and taking what enraptured audiences “willingly” give.',
        features: [
            {
                name: 'Weapon and Armor Proficiency',
                description: 'A bard is proficient with all simple weapons, plus the longsword, rapier, sap, short sword, shortbow, and whip. Bards are proficient with light armor and shields (except tower shields).\n\nBecause the somatic components required for bard spells are relatively simple, a bard can cast bard spells while wearing light armor without incurring the normal arcane spell failure chance. However, like any other arcane spellcaster, a bard wearing medium or heavy armor or using a shield incurs a chance of arcane spell failure if the spell in question has a somatic component (most do). A multiclass bard still incurs the normal arcane spell failure chance for arcane spells received from other classes.',
            },
            {
                name: 'Spells',
                description: 'A bard casts arcane spells (the same type of spells available to sorcerers and wizards), which are drawn from the bard spell (page 181) list. He can cast any spell he knows without preparing it ahead of time, the way a wizard or cleric must (see below). Every bard spell has a verbal component (singing, reciting, or music).\nTo learn or cast a spell, a bard must have a Charisma score equal to at least 10 + the spell level (Cha 10 for 0-level spells, Cha 11 for 1st-level spells, and so forth). The Difficulty Class for a saving throw against a bard’s spell is 10 + the spell level + the bard’s Charisma modifier.\n\nLike other spellcasters, a bard can cast only a certain number of spells of each spell level per day. In addition, he receives bonus spells per day if he has a high Charisma score. When the table indicates that the bard gets 0 spells per day of a given spell level (for instance, 1st- level spells for a 2nd-level bard), he gains only the bonus spells he would be entitled to based on his Charisma score for that spell level.\n\nThe bard’s selection of spells is extremely limited. A bard begins play knowing four 0-level spells (also called cantrips) of your choice. At most new bard levels, he gains one or more new spells. (Unlike spells per day, the number of spells a bard knows is not affected by his Charisma score; the numbers are fixed.)\n\nUpon reaching 5th level, and at every third bard level after that (8th, 11th, and so on), a bard can choose to learn a new spell in place of one he already knows. In effect, the bard “loses” the old spell in exchange for the new one. The new spell’s level must be the same as that of the spell being exchanged, and it must be at least two levels lower than the highest-level bard spell the bard can cast. For instance, upon reaching 5th level, a bard could trade a single 0-level spell (two spell levels below the highest-level bard spell he can cast, which is 2nd) for a different 0-level spell. At 8th level, he could trade in a single 0-level or 1st-level spell (since he now can cast 3rd-level bard spells) for a different spell of the same level. A bard may swap only a single spell at any given level, and must choose whether or not to swap the spell at the same time that he gains new spells known for the level.\n\nAs noted above, a bard need not prepare his spells in advance. He can cast any spell he knows at any time, assuming he has not yet used up his allotment of spells per day for the spell’s level. For example, at 1st level, Gimble the bard can cast two 0-level spells per day for being 1st level. However, he knows four 0-level spells: detect magic, ghost sound, light, and read magic. Thus, on any given day,he can cast some combination of those four spells a total of two times. He does not have to decide ahead of time which spells he’ll cast.',
            },
            {
                name: 'Bardic Knowledge',
                description: 'A bard picks up a lot of stray knowledge while wandering the land and learning stories from other bards. He may make a special bardic knowledge check with a bonus equal to his bard level + his Intelligence modifier to see whether he knows some relevant information about local notable people, legendary items, or noteworthy places. (If the bard has 5 or more ranks in Knowledge (history), he gains a +2 bonus on this check.)\n\n| DC | Type of Knowledge | Examples |\n|:--:|-------------------|----------|\n| 10 | Common, known by at least a substantial minority of the local population. | A local mayor’s reputation for drinking; common legends about a powerful place of mystery.|\n| 20 | Uncommon but available, known by only a few people in the area. | A local priest’s shady past; legends about a powerful Magic item. |\n| 25 | Obscure, known by few, hard to come by. | A knight’s family history; legends about a minor place of mystery or magic item |\n| 30 | Extremely obscure, known by very few, possibly forgotten by most who once knew it, possibly known only by those who don’t understand the significance of the knowledge. | A mighty wizard’s childhood nickname; the history of a petty magic item. |\n\nA successful bardic knowledge check will not reveal the powers of a magic item but may give a hint as to its general function. A bard may not take 10 or take 20 on this check; this sort of knowledge is essentially random. The DM can determine the Difficulty Class of the check by referring to the table above.',
            },
            {
                name: 'Bardic Music',
                description: 'Once per day per bard level, a bard can use his song or poetics to produce magical effects on those around him (usually including himself, if desired). While these abilities fall under the category of bardic music and the descriptions discuss singing or playing instruments, they can all be activated by reciting poetry, chanting, singing lyrical songs, singing melodies (fa-la-la, and so forth), whistling, playing an instrument, or playing an instrument in combination with some spoken performance. Each ability requires both a minimum bard level and a minimum number of ranks in the Perform skill to qualify; if a bard does not have the required number of ranks in at least one Perform skill, he does not gain the bardic music ability until he acquires the needed ranks.\n\nStarting a bardic music effect is a standard action. Some bardic music abilities require concentration, which means the bard must take a standard action each round to maintain the ability. Even while using bardic music that doesn’t require concentration, a bard cannot cast spells, activate magic items by spell completion (such as scrolls), or activate magic items by magic word (such as wands). Just as for casting a spell with a verbal component (see Components), a deaf bard has a 20% chance to fail when attempting to use bardic music. If he fails, the attempt still counts against his daily limit.\n\n_Countersong (Su)_: A bard with 3 or more ranks in a Perform skill can use his music or poetics to counter magical effects that depend on sound (but not spells that simply have verbal components). Each round of the countersong, he makes a Perform check. Any creature within 30 feet of the bard (including the bard himself ) that is affected by a sonic or language-dependent magical attack (such as a sound burst or command spell) may use the bard’s Perform check result in place of its saving throw if, after the saving throw is rolled, the Perform check result proves to be higher. If a creature within range of the countersong is already under the effect of a noninstan- taneous sonic or language-dependent magical attack, it gains another saving throw against the effect each round it hears the countersong, but it must use the bard’s Perform check result for the save. Countersong has no effect against effects that don’t allow saves. The bard may keep up the countersong for 10 rounds.\n\n_Fascinate (Sp)_: A bard with 3 or more ranks in a Perform skill can use his music or poetics to cause one or more creatures to become fascinated with him. Each creature to be fascinated must be within 90 feet, able to see and hear the bard, and able to pay attention to him. The bard must also be able to see the creature. The distraction of a nearby combat or other dangers prevents the ability from working. For every three levels a bard attains beyond 1st, he can target one additional creature with a single use of this ability (two at 4th level, three at 7th level, and so on).\n\nTo use the ability, a bard makes a Perform check. His check result is the DC for each affected creature’s Will save against the effect. If a creature’s saving throw succeeds, the bard cannot attempt to fascinate that creature again for 24 hours. If its saving throw fails, the creature sits quietly and listens to the song, taking no other actions, for as long as the bard continues to play and concentrate (up to a maximum of 1 round per bard level). While fascinated, a target takes a –4 penalty on skill checks made as reactions, such as Listen and Spot checks. Any potential threat requires the bard to make another Perform check and allows the creature a new saving throw against a DC equal to the new Perform check result. Any obvious threat, such as someone drawing a weapon, casting a spell, or aiming a ranged weapon at the target, automatically breaks the effect. _Fascinate_ is an enchantment (compulsion), mind-affecting ability.\n\n_Inspire Courage (Su)_: A bard with 3 or more ranks in a Perform skill can use song or poetics to inspire courage in his allies (including himself ), bolstering them against fear and improving their combat abilities. To be affected, an ally must be able to hear the bard sing. The effect lasts for as long as the ally hears the bard sing and for 5 rounds thereafter. An affected ally receives a +1 morale bonus on saving throws against charm and fear effects and a +1 morale bonus on attack and weapon damage rolls. At 8th level, and every six bard levels thereafter, this bonus increases by 1 (+2 at 8th, +3 at 14th, and +4 at 20th). Inspire courage is a mind-affecting ability.\n\n_Inspire Competence (Su)_: A bard of 3rd level or higher with 6 or more ranks in a Perform skill can use his music or poetics to help an ally succeed at a task. The ally must be within 30 feet and able to see and hear the bard. The bard must also be able to see the ally. Depending on the task that the ally has at hand, the bard may use his bardic music to lift the ally’s spirits, to help him or her focus mentally, or in some other way. The ally gets a +2 competence bonus on skill checks with a particular skill as long as he or she continues to hear the bard’s music. The DM may rule that certain uses of this ability are infeasible—chanting to make a rogue move more quietly, for example, is self-defeating. The effect lasts as long as the bard concentrates, up to a maximum of 2 minutes. A bard can’t inspire competence in himself. Inspire competence is a mind-affecting ability.\n\n_Suggestion (Sp)_: A bard of 6th level or higher with 9 or more ranks in a Perform skill can make a suggestion (as the spell) to a creature that he has already fascinated (see above). Using this ability does not break the bard’s concentration on the fascinate effect, nor does it allow a second saving throw against the fascinate effect. Making a suggestion doesn’t count against a bard’s daily limit on bardic music performances. A Will saving throw (DC 10 + 1/2 bard’s level + bard’s Cha modifier) negates the effect. This ability affects only a single creature (but see mass suggestion, below). _Suggestion_ is an enchantment (compulsion), mind-affecting, language dependent ability.\n\n_Inspire Greatness (Su)_: A bard of 9th level or higher with 12 or more ranks in a Perform skill can use music or poetics to inspire greatness in himself or a single willing ally within 30 feet, granting him or her extra fighting capability. For every three levels a bard attains beyond 9th, he can target one additional ally with a single use of this ability (two at 12th level, three at 15th, four at 18th). To inspire greatness, a bard must sing and an ally must hear him sing. The effect lasts for as long as the ally hears the bard sing and for 5 rounds thereafter. A creature inspired with greatness gains 2 bonus Hit Dice (d10s), the commensurate number of temporary hit points (apply the target’s Constitution modifier, if any, to these bonus Hit Dice), a +2 competence bonus on attack rolls, and a +1 competence bonus on Fortitude saves. The bonus Hit Dice count as regular Hit Dice for determining the effect of spells such as sleep. Inspire greatness is a mind-affecting ability.\n\n_Song of Freedom (Sp)_: A bard of 12th level or higher with 15 or more ranks in a Perform skill can use music or poetics to create an effect equivalent to the _break enchantment_ spell (caster level equals the character’s bard level). Using this ability requires 1 minute of uninterrupted concentration and music, and it functions on a single target within 30 feet. A bard can’t use _song of freedom_ on himself.\n\n_Inspire Heroics (Su)_: A bard of 15th level or higher with 18 or more ranks in a Perform skill can use music or poetics to inspire tremendous heroism in himself or a single willing ally within 30 feet, allowing that creature to fight bravely even against over- whelming odds. For every three bard levels the character attains beyond 15th, he can inspire heroics in one additional creature. To inspire heroics, a bard must sing and an ally must hear the bard sing for a full round. A creature so inspired gains a +4 morale bonus on saving throws and a +4 dodge bonus to AC. The effect lasts for as long as the ally hears the bard sing and for up to 5 rounds thereafter. Inspire heroics is a mind-affecting ability.\n\n_Mass Suggestion (Sp)_: This ability functions like suggestion, above, except that a bard of 18th level or higher with 21 or more ranks in a Perform skill can make the suggestion simultaneously to any number of creatures that he has already fascinated (see above). _Mass suggestion_ is an enchantment (compulsion), mind-affecting, language-dependent ability.',
            },
        ],
        reference: 'PHB:26',
        official: true,
        scope: 'public',
    },
    {
        id: 3,
        name: 'Cleric',
        description: 'The handiwork of the gods is everywhere—in places of natural beauty, in mighty crusades, in soaring temples, and in the hearts of worshipers. Like people, gods run the gamut from benevolent to malicious, reserved to intrusive, simple to inscrutable. The gods, however, work mostly through intermediaries—their clerics. Good clerics heal, protect, and avenge. Evil clerics pillage, destroy, and sabotage. A cleric uses the power of his god to make his god’s will manifest. And if a cleric uses his god’s power to improve his own lot, that’s to be expected, too.',
        features: [
            {
                name: 'Weapon and Armor Proficiency',
                description: 'Clerics are proficient with all simple weapons, with all types of armor (light, medium, and heavy), and with shields (except tower shields).\n\nEvery deity has a favored weapon (see Deities), and his or her clerics consider it a point of pride to wield that weapon. A cleric who chooses the War domain receives the Weapon Focus feat related to that weapon as a bonus feat. He also receives the appropriate Martial Weapon Proficiency feat as a bonus feat, if the weapon falls into that category.',
            },
            {
                name: 'Aura',
                type: 'ex',
                description: 'A cleric of a chaotic, evil, good, or lawful deity has a particularly powerful aura corresponding to the deity’s alignment (see the detect evil spell for details). Clerics who don’t worship a specific deity but choose the Chaotic, Evil, Good, or Lawful domain have a similarly powerful aura of the corresponding alignment.',
            },
            {
                name: 'Spells',
                description: 'A cleric casts divine spells (the same type of spells avail- able to the druid, paladin, and ranger), which are drawn from the cleric spell list (page 183). However, his alignment may restrict him from casting certain spells opposed to his moral or ethical beliefs; see Chaotic, Evil, Good, and Lawful Spells, below. A cleric must choose and prepare his spells in advance (see below).\n\nTo prepare or cast a spell, a cleric must have a Wisdom score equal to at least 10 + the spell level (Wis 10 for 0-level spells, Wis 11 for 1st-level spells, and so forth). The Difficulty Class for a saving throw against a cleric’s spell is 10 + the spell level + the cleric’s Wisdom modifier.\n\nLike other spellcasters, a cleric can cast only a certain number of spells of each spell level per day. His base daily spell allotment is given on Table 3–7: The Cleric. In addition, he receives bonus spells per day if he has a high Wisdom score. A cleric also gets one domain spell of each spell level he can cast, starting at 1st level. When a cleric prepares a spell in a domain spell slot, it must come from one of his two domains (see Deities, Domains, and Domain Spells, below).Clerics do not acquire their spells from books or scrolls, nor do they prepare them through study. Instead, they meditate or pray for their spells, receiving them through their own strength of faith or as divine inspiration. Each cleric must choose a time at which he must spend 1 hour each day in quiet contemplation or supplication to regain his daily allotment of spells. Typically, this hour is at dawn or noon for good clerics and at dusk or midnight for evil ones. Time spent resting has no effect on whether a cleric can prepare spells. A cleric may prepare and cast any spell on the cleric spell list (page 183), provided that he can cast spells of that level, but he must choose which spells to prepare during his daily meditation.',
            },
            {
                name: 'Deity, Domains, and Domain Spells',
                description: 'Choose a deity for your cleric. The cleric’s deity influences his alignment, what magic he can perform, his values, and how others see him. You may also choose for your cleric to have no deity.\n\nIf the typical worshipers of a deity include the members of a race, a cleric must be of the indicated race to choose that deity as his own.(The god may have occasional worshipers of other races, but not clerics.)\n\nWhen you have chosen an alignment and a deity for your cleric, choose two domains from among those given on Table 3–7 for the deity. While the clerics of a particular religion are united in their reverence for their deity, each cleric emphasizes different aspects of the deity’s interests. You can select an alignment domain (Chaos, Evil, Good, or Law) for your cleric only if his alignment matches that domain.\n\nIf your cleric is not devoted to a particular deity, you still select two domains to represent his spiritual inclinations and abilities. The restriction on alignment domains still applies.\n\nEach domain gives your cleric access to a domain spell at each spell level he can cast, from 1st on up, as well as a granted power. Your cleric gets the granted powers of both the domains selected. With access to two domain spells at a given spell level, a cleric prepares one or the other each day in his domain spell slot. If a domain spell is not on the cleric spell list, a cleric can prepare it only in his domain spell slot.\n\nFor example, Jozan is a 1st-level cleric of Pelor. He chooses Good and Healing (from Pelor’s domain options) as his two domains. He gets the granted powers of both his selected domains. The Good domain allows him to cast all spells with the good descriptor at +1 caster level (as if he were one level higher as a cleric) as a granted power, and it gives him access to _protection from evil_ as a 1st-level domain spell. The Healing domain allows him to cast all healing subschool spells of the conjuration school at +1 caster level as a granted power, and it gives him access to _cure light wounds_ as a 1st-level domain spell. When Jozan prepares his spells, he gets one 1st-level spell for being a 1st-level cleric, one bonus 1st-level spell for having a high Wisdom score (15), and one domain spell. The domain spell must be one of the two to which he has access, either _protection from evil_ or _cure light wounds_.',
            },
            {
                name: 'Spontaneous Casting',
                description: 'A good cleric (or a neutral cleric of a good deity) can channel stored spell energy into healing spells that the cleric did not prepare ahead of time. The cleric can “lose” any prepared spell that is not a domain spell in order to cast any _cure_ spell of the same spell level or lower (a _cure_ spell is any spell with “cure” in its name). For example, a good cleric who has prepared command (a 1st-level spell) may lose command in order to cast _cure light wounds_ (also a 1st-level spell). Clerics of good deities can cast _cure_ spells in this way because they are especially proficient at wielding positive energy.\n\nAn evil cleric (or a neutral cleric of an evil deity), on the other hand, can’t convert prepared spells to cure spells but can convert them to _inflict_ spells (an _inflict_ spell is one with “inflict” in its name).\n\nA cleric who is neither good nor evil and whose deity is neither good nor evil can convert spells to either _cure_ spells or _inflict_ spells (player’s choice), depending on whether the cleric is more proficient at wielding positive or negative energy. Once the player makes this choice, it cannot be reversed. This choice also determines whether the cleric turns or commands undead (see below). Exceptions: All lawful neutral clerics of Wee Jas (goddess of death and magic) convert prepared spells to _inflict_ spells, not _cure_ spells. All clerics of St. Cuthbert (god of retribution) and all nonevil clerics of Obad-Hai (god of nature) convert prepared spells to _cure_ spells, not _inflict_ spells.',
            },
            {
                name: 'Chaotic, Evil, Good, and Lawful Spells',
                description: 'A cleric can’t cast spells of an alignment opposed to his own or his deity’s (if he has one). For example, a good cleric (or a neutral cleric of a good deity) cannot cast evil spells. Spells associated with particular alignments are indicated by the chaos, evil, good, and law descriptors in their spell descriptions.',
            },
            {
                name: 'Turn or Rebuke Undead',
                type: 'su',
                description: 'Any cleric, regardless of alignment, has the power to affect undead creatures (such as skeletons, zombies, ghosts, and vampires) by channeling the power of his faith through his holy (or unholy) symbol.\n\nA good cleric (or a neutral cleric who worships a good deity) can turn or destroy undead creatures. An evil cleric (or a neutral cleric who worships an evil deity) instead rebukes or commands such creatures., forcing them to cower in awe of his power. If your character is a neutral cleric of a neutral deity, you must choose whether his turning ability functions as that of a good cleric or an evil cleric. Once you make this choice, it cannot be reversed. This decision also determines whether the cleric can cast spontaneous _cure_ or _inflict_ spells (see above). Exceptions: All lawful neutral clerics of Wee Jas (goddess of death and magic) rebuke or command undead. All clerics of St. Cuthbert (god of retribution) and all nonevil clerics of Obad-Hai (god of nature) turn of destroy undead.\n\nA cleric may attempt to turn undead a number of times per day equal to 3 + his Charisma modifier. A cleric with 5 or more ranks in Knowledge (religion) gets a +2 bonus on turning checks against undead.',
            },
            {
                name: 'Bonus Languages',
                description: 'A cleric’s bonus language options include Celestial, Abyssal, and Infernal (the languages of good, chaotic evil, and lawful evil outsiders, respectively). These choices are in addition to the bonus languages available to the character because of his race.',
            },
        ],
        reference: 'PHB:30',
        official: true,
        scope: 'public',
    },
    {
        id: 4,
        name: 'Druid',
        description: 'The fury of a storm, the gentle strength of the morning sun, the cunning of the fox, the power of the bear—all these and more are at the druid’s command. The druid however, claims no mastery over nature. That claim, she says, is the empty boast of a city dweller. The druid gains her power not by ruling nature but by being at one with it. To trespassers in a druid’s sacred grove, and to those who feel her wrath, the distinction is overly fine.',
        features: [
            {
                name: 'Weapon and Armor Proficiency',
                description: 'Druids are proficient with the following weapons: club, dagger, dart, quarterstaff, scimitar, sickle, shortspear, sling, and spear. They are also proficient with all natural attacks (claw, bite, and so forth) of any form they assume with wild shape (see below).\n\nDruids are proficient with light and medium armor but are prohibited from wearing metal armor; thus, they may wear only padded, leather, or hide armor. (A druid may also wear wooden armor that has been altered by the _ironwood_ spell so that it functions as though it were steel. Druids are proficient with shields (except tower shields) but must use only wooden ones.\n\nA druid who wears prohibited armor or carries a prohibited shield is unable to cast druid spells or use any of her supernatural or spelllike class abilities while doing so and for 24 hours thereafter.',
            },
            {
                name: 'Spells',
                description: 'A druid casts divine spells (the same type of spells available to the cleric, paladin, and ranger), which are drawn from the druid spell list. Her alignment may restrict her from casting certain spells opposed to her moral or ethical beliefs; see Chaotic, Evil, Good, and Lawful Spells, below. A druid must choose and prepare her spells in advance (see below).\n\nTo prepare or cast a spell, the druid must have a Wisdom score equal to at least 10 + the spell level (Wis 10 for 0-level spells, Wis 11 for 1st-level spells, and so forth). The Difficulty Class for a saving throw against a druid’s spell is 10 + the spell level + the druid’s Wisdom modifier.\n\nLike other spellcasters, a druid can cast only a certain number of spells of each spell level per day. Her base daily spell allotment is given on Table 3–8: The Druid. In addition, she receives bonus spells per day if she has a high Wisdom score (see Table 1–1: Ability Modifiers and Bonus Spells, page8). She does not have access to any domain spells or granted powers, as a cleric does.\n\nA druid prepares and casts spells the way a cleric does, though she cannot lose a prepared spell to cast a cure spell in its place (but see Spontaneous Casting, below). A druid may prepare and cast any spell on the druid spell list (page 189), provided that she can cast spells of that level, but she must choose which spells to prepare during her daily meditation.',
            },
            {
                name: 'Spontaneous Casting',
                description: 'A druid can channel stored spell energy into summoning spells that she hasn’t prepared ahead of time. She can “lose” a prepared spell in order to cast any _summon nature’s ally_ spell of the same level or lower. For example, a druid who has prepared _repel vermin_ (a 4th-level spell) may lose _repel vermin_ in order to cast _summon nature’s ally_ IV (also a 4th-level spell).',
            },
            {
                name: 'Chaotic, Evil, Good, and Lawful Spells',
                description: 'A druid can’t cast spells of an alignment opposed to her own or her deity’s (if she has one). For example, a neutral good druid cannot cast evil spells. Spells associated with particular alignments are indicated by the chaos, evil, good, and law descriptors in their spell descriptions.',
            },
            {
                name: 'Bonus Languages',
                description: 'A druid’s bonus language options include Sylvan, the language of woodland creatures. This choice is in addition to the bonus languages available to the character because of her race.\n\nA druid also knows Druidic, a secret language known only to druids, which she learns upon becoming a 1st-level druid. Druidic is a free language for a druid; that is, she knows it in addition to her regular allotment of languages and it doesn’t take up a language slot. Druids are forbidden to teach this language to nondruids. Druidic has its own alphabet.',
            },
            {
                name: 'Animal Companion',
                type: 'ex',
                description: 'A druid may begin play with an animal companion selected from the following list: badger, camel, dire rat, dog, riding dog, eagle, hawk, horse (light or heavy), owl, pony, snake (Small or Medium viper), or wolf. If the DM’s campaign takes place wholly or partly in an aquatic environment, the DM may add the following creatures to the druid’s list of options: crocodile, porpoise, Medium shark, and squid. This animal is a loyal companion that accompanies the druid on her adventures as appropriate for its kind.\n\nA 1st-level druid’s companion is completely typical for its kind except as noted in the sidebar on page 36. As a druid advances in level, the animal’s power increases as shown on the table in the sidebar.\n\nIf a druid releases her companion from service, she may gain a new one by performing a ceremony requiring 24 uninterrupted hours of prayer. This ceremony can also replace an animal companion that has perished.\n\nA druid of 4th level or higher may select from alternative lists of animals (see the sidebar). Should she select an animal companion from one of these alternative lists, the creature gains abilities as if the character’s druid level were lower than it actually is. Subtract the value indicated in the appropriate list header from the character’s druid level and compare the result with the druid level entry on the table in the sidebar to determine the animal companion’s powers. (If this adjustment would reduce the druid’s effective level to 0 or lower, she can’t have that animal as a companion.) For example, a 6th-level druid could select a leopard as an animal companion. The leopard would have characteristics and special abilities as if the druid were 3rd level (taking into account the –3 adjustment) instead of 6th level.',
            },
            {
                name: 'Nature Sense',
                type: 'ex',
                description: 'A druid gains a +2 bonus on Knowledge (nature) and Survival checks.',
            },
            {
                name: 'Wild Empathy',
                type: 'ex',
                description: 'A druid can use body language, vocaliza- tions, and demeanor to improve the attitude of an animal (such as a bear or a monitor lizard). This ability functions just like a Diplomacy check made to improve the attitude of a person (see Chapter 4: Skills). The druid rolls 1d20 and adds her druid level and her Charisma modifier to determine the wild empathy check result. The typical domestic animal has a starting attitude of indifferent, while wild animals are usually unfriendly.\n\nTo use wild empathy, the druid and the animal must be able to study each other, which means that they must be within 30 feet of one another under normal conditions. Generally, influencing an animal in this way takes 1 minute but, as with influencing people, it might take more or less time.\n\nA druid can also use this ability to influence a magical beast with an Intelligence score of 1 or 2 (such as a basilisk or a girallon), but she takes a –4 penalty on the check.',
            },
            {
                name: 'Woodland Stride',
                type: 'ex',
                description: 'Starting at 2nd level, a druid may move through any sort of undergrowth (such as natural thorns, briars, overgrown areas, and similar terrain) at her normal speed and with- out taking damage or suffering any other impairment. However, thorns, briars, and overgrown areas that have been magically manipulated to impede motion still affect her.',
            },
            {
                name: 'Trackless Step',
                type: 'ex',
                description: 'Starting at 3rd level, a druid leaves no trail in natural surroundings and cannot be tracked. She may choose to leave a trail if so desired.',
            },
        ],
        reference: 'PHB:33',
        official: true,
        scope: 'public',
    },
    {
        id: 5,
        name: 'Fighter',
        description: 'The questing knight, the conquering overlord, the king’s champion, the elite foot soldier, the hardened mercenary, and the bandit king— all are fighters. Fighters can be stalwart defenders of those in need, cruel marauders, or gutsy adventurers. Some are among the land’s best souls, willing to face death for the greater good. Others are among the worst, with no qualms about killing for private gain, or even for sport. Fighters who are not actively adventuring may be soldiers, guards, bodyguards, champions, or criminal enforcers. An adventuring fighter might call himself a warrior, a mercenary, a thug, or simply an adventurer.',
        features: [
            {
                name: 'Weapon and Armor Proficiency',
                description: 'A fighter is proficient with all simple and martial weapons and with all armor (heavy, medium, and light) and shields (including tower shields).',
            },
            {
                name: 'Bonus Feats',
                description: 'At 1st level, a fighter gets a bonus combat-oriented feat in addition to the feat that any 1st-level character gets and the bonus feat granted to a human character. The fighter gains an additional bonus feat at 2nd level and every two fighter levels thereafter (4th, 6th, 8th, 10th, 12th, 14th, 16th, 18th, and 20th). These bonus feats must be drawn from the feats noted as fighter bonus feats in the PHB. A fighter must still meet all prerequisites for a bonus feat, including ability score and base attack bonus minimums. These bonus feats are in addition to the feat that a character of any class gets from advancing levels. A fighter is not limited to the list of fighter bonus feats when choosing these feats.',
            },
        ],
        reference: 'PHB:37',
        official: true,
        scope: 'public',
    },
    {
        id: 6,
        name: 'Monk',
        description: 'Dotted across the landscape are monasteries—small, walled cloisters inhabited by monks who pursue personal perfection through action as well as contemplation. They train themselves to be versatile warriors skilled at fighting without weapons or armor. The inhabitants of monasteries headed by good masters serve as protectors of the people. Ready for battle even when barefoot and dressed in peasant clothes, monks can travel unnoticed among the populace, catching bandits, warlords, and corrupt nobles unawares. In contrast, the residents of monasteries headed by evil masters rule the surrounding lands through fear, as an evil warlord and his entourage might. Evil monks make ideal spies, infiltrators, and assassins.\n\nThe individual monk is unlikely to care passionately about championing commoners or amassing wealth. She cares primarily for the perfection of her art and, thereby, her personal perfection. Her goal is to achieve a state that is beyond the mortal realm.',
        features: [
            {
                name: 'Weapon and Armor Proficiency',
                description: 'Monks are proficient with certain basic peasant weapons and some special weapons that are part of monk training. The weapons with which a monk is proficient are club, crossbow (light or heavy), dagger, handaxe, javelin, kama, nunchaku, quarterstaff, sai, shuriken, siangham, and sling. Monks are not proficient with any armor or shields—in fact, many of the monk’s special powers require unfettered movement. When wearing armor, using a shield, or carrying a medium or heavy load, a monk loses her AC bonus, as well as her fast movement and flurry of blows abilities.',
            },
            {
                name: 'AC Bonus',
                type: 'ex',
                description: 'A monk is highly trained at dodging blows, and she has a sixth sense that lets her avoid even unanticipated attacks. When unarmored and unencumbered, the monk adds her Wisdom bonus (if any) to her AC. In addition, a monk gains a +1 bonus to AC at 5th level. This bonus increases by 1 for every five monk levels thereafter (+2 at 10th, +3 at 15th, and +4 at 20th level).\n\nThese bonuses to AC apply even against touch attacks or when the monk is flat-footed. She loses these bonuses when she is immobilized or helpless, when she wears any armor, when she carries a shield, or when she carries a medium or heavy load.',
            },
            {
                name: 'Flurry of Blows',
                type: 'ex',
                description: 'When unarmored, a monk may strike with a flurry of blows at the expense of accuracy. When doing so, she may make one extra attack in a round at her highest base attack bonus, but this attack takes a –2 penalty, as does each other attack made that round. The resulting modified base attack bonuses are shown in the Flurry of Blows Attack Column of the Monk Table. This penalty applies for 1 round, so it also affects attacks of opportunity the monk might make before her next action. When a monk reaches 5th level, the penalty lessens to –1, and at 9th level it disappears. A monk must use a full attack action to strike with a flurry of blows.\n\nWhen using flurry of blows, a monk may attack only with unarmed strikes or with special monk weapons (kama, nunchaku, quarterstaff, sai, shuriken, and siangham). She may attack with unarmed strikes and special monk weapons interchangeably as desired. For example, at 6th level, the monk Ember could make one attack with her unarmed strike at an attack bonus of +3 and one attack with a special monk weapon at an attack bonus of +3. When using weapons as part of a flurry of blows, a monk applies her Strength bonus (not Str bonus × 1-1/2 or × 1/2) to her damage rolls for all successful attacks, whether she wields a weapon in one or both hands. The monk can’t use any weapon other than a special monk weapon as part of a flurry of blows.\n\nIn the case of the quarterstaff, each end counts as a separate weapon for the purpose of using the flurry of blows ability. Even though the quarterstaff requires two hands to use, a monk may still intersperse unarmed strikes with quarterstaff strikes, assuming that she has enough attacks in her flurry of blows routine to do so. For example, an 8th-level monk could make two attacks with the quarterstaff (one with each end) at a +5 attack bonus and one with an unarmed strike at a +0 attack bonus, or she could attack with one end of the quarterstaff and one unarmed strike each at a +5 attack bonus, and with the other end of the quarterstaff at a +0 attack bonus, or she could attack with one end of the quarterstaff and one unarmed strike at a +5 attack bonus each, and with the other end of the quarterstaff at a +0 attack bonus. She cannot, however, wield any other weapon at the same time that she uses a quarterstaff.\n\nWhen a monk reaches 11th level, her flurry of blows ability improves. In addition to the standard single extra attack she gets from flurry of blows, she gets a second extra attack at her full base attack bonus.',
            },
            {
                name: 'Unarmed Strike',
                description: 'Monks are highly trained in fighting unarmed, giving them considerable advantages when doing so. At 1st level, a monk gains Improved Unarmed Strike as a bonus feat. A monk’s attacks may be with either fist interchangeably or even from elbows, knees, and feet. This means that a monk may even make unarmed strikes with her hands full. There is no such thing as an off-hand attack for a monk striking unarmed. A monk may thus apply her full Strength bonus on damage rolls for all her unarmed strikes.\n\nUsually a monk’s unarmed strikes deal lethal damage, but she can choose to deal nonlethal damage instead with no penalty on her attack roll. She has the same choice to deal lethal or nonlethal damage while grappling.\n\nA monk’s unarmed strike is treated both as a manufactured weapon and a natural weapon for the purpose of spells and effects that enhance or improve either manufactured weapons or natural weapons (such as the _magic fang_ and _magic weapon_ spells).\n\nA monk also deals more damage with her unarmed strikes than a normal person would. A Small monk deals less damage than the amount given there with her unarmed attacks, while a Large monk deals more damage.\n\n| Level | Damage(Small Monk) | Damage(Large Monk) |\n|:-----:|:------------------:|:------------------:|\n| 1st-3rd | 1d4 | 1d8 |\n| 4th - 7th | 1d6 | 2d6 |\n| 8th - 11th | 1d8 | 2d8 |\n| 12th - 15th | 1d10 | 3d6 |\n| 16th - 19th | 2d6 | 3d8 |\n| 20th | 2d8 | 4d8 |',
            },
            {
                name: 'Bonus Feat',
                description: 'At 1st level, a monk may select either Improved Grapple or Stunning Fist as a bonus feat. At 2nd level, she may select either Combat Reflexes or Deflect Arrows as a bonus feat. At 6th level, she may select either Improved Disarm or Improved Trip as a bonus feat. A monk need not have any of the prerequisites normally required for these feats to select them.',
            },
            {
                name: 'Evasion',
                type: 'ex',
                description: 'A monk of 2nd level or higher can avoid even magical and unusual attacks with great agility. If she makes a successful Reflex saving throw against an attack that normally deals half damage on a successful save (such as a red dragon’s fiery breath or a fireball), she instead takes no damage. Evasion can be used only if a monk is wearing light armor or no armor. A helpless monk (such as one who is unconscious or paralysed) does not gain the benefit of evasion.',
            },
            {
                name: 'Fast Movement',
                type: 'ex',
                description: 'At 3rd level, a monk gains an enhancement bonus to her speed. A monk in armor (even light armor) or carrying a medium or heavy load loses this extra speed.',
            },
            {
                name: 'Still Mind',
                type: 'ex',
                description: 'A monk of 3rd level or higher gains a +2 bonus on saving throws against spells and effects from the school of enchantment, since her meditation and training improve her resistance to mind-affecting attacks.',
            },
            {
                name: 'Ki Strike',
                type: 'su',
                description: 'At 4th level, a monk’s unarmed attacks are empowered with ki. Her unarmed attacks are treated as magic weapons for the purpose of dealing damage to creatures with damage reduction.Ki strike improves with the character’s monk level. At 10th level, her unarmed attacks are also treated as lawful weapons for the purpose of dealing damage to creatures with damage reduction. At 16th level, her unarmed attacks are treated as adamantine weapons for the purpose of dealing damage to creatures with damage reduction and bypassing hardness.',
            },
            {
                name: 'Slow Fal',
                type: 'ex',
                description: 'At 4th level or higher, a monk within arm’s reach of a wall can use it to slow her descent. When first using this ability, she takes damage as if the fall were 20 feet shorter than it actually is. The monk’s ability to slow her fall (that is, to reduce the effective distance of the fall when next to a wall) improves with her monk level until at 20th level she can use a nearby wall to slow her descent and fall any distance without harm.',
            },
            {
                name: 'Purity of Body',
                type: 'ex',
                description: 'At 5th level, a monk gains control over her body’s immune system. She gains immunity to all diseases except for supernatural and magical diseases (such as mummy rot and lycanthropy).',
            },
            {
                name: 'Wholeness of Body',
                type: 'su',
                description: 'At 7th level or higher, a monk can heal her own wounds. She can heal a number of hit points of damage equal to twice her current monk level each day, and she can spread this healing out among several uses.',
            },
            {
                name: 'Improved Evasion',
                type: 'ex',
                description: 'At 9th level, a monk’s evasion ability improves. She still takes no damage on a successful Reflex saving throw against attacks such as a dragon’s breath weapon or a fireball, but henceforth she takes only half damage on a failed save. A help- less monk (such as one who is unconscious or paralysed) does not gain the benefit of improved evasion.',
            },
            {
                name: 'Diamond Body',
                type: 'su',
                description: 'At 11th level, a monk is in such firm control of her own metabolism that she gains immunity to poisons of all kinds.',
            },
            {
                name: 'Abundant Step',
                type: 'su',
                description: 'At 12th level or higher, a monk can slip magically between spaces, as if using the spell _dimension door_, once per day. Her caster level for this effect is one-half her monk level (rounded down).',
            },
            {
                name: 'Diamond Soul',
                type: 'ex',
                description: 'At 13th level, a monk gains spell resistance equal to her current monk level + 10. In order to affect the monk with a spell, a spellcaster must get a result on a caster level check that equals or exceeds the monk’s spell resistance.',
            },
            {
                name: 'Quivering Palm',
                type: 'su',
                description: 'Starting at 15th level, a monk can set up vibrations within the body of another creature that can thereafter be fatal if the monk so desires. She can use this quivering palm attack once a week, and she must announce her intent before making her attack roll. Constructs, oozes, plants, undead, incorporeal creatures, and creatures immune to critical hits cannot be affected. Otherwise, if the monk strikes successfully and the target takes damage from the blow, the quivering palm attack succeeds. Thereafter the monk can try to slay the victim at any later time, as long as the attempt is made within a number of days equal to her monk level. To make such an attempt, the monk merely wills the target to die (a free action), and unless the target makes a Fortitude saving throw (DC 10 + 1/2 the monk’s level + the monk’s Wis modifier), it dies. If the saving throw is successful, the target is no longer in danger from that particular quivering palm attack, but it may still be affected by another one at a later time.',
            },
            {
                name: 'Timeless Body',
                type: 'ex',
                description: 'Upon attaining 17th level, a monk no longer takes penalties to her ability scores for aging and cannot be magically aged. Any such penalties that she has already taken, however, remain in place. Bonuses still accrue, and the monk still dies of old age when her time is up.',
            },
            {
                name: 'Tongue of the Sun and Moon',
                description: 'A monk of 17th level or higher can speak with any living creature.',
            },
            {
                name: 'Empty Body',
                type: 'su',
                description: 'At 19th level, a monk gains the ability to assume an ethereal state for 1 round per monk level per day, as though using the spell _etherealness_. She may go ethereal on a number of different occasions during any single day, as long as the total number of rounds spent in an ethereal state does not exceed her monk level.',
            },
            {
                name: 'Perfect Self',
                type: 'ex',
                description: 'At 20th level, a monk has tuned her body with skill and quasi-magical abilities to the point that she becomes a magical creature. She is forevermore treated as an outsider (an extraplanar creature) rather than as a humanoid for the purpose of spells and magical effects. For instance, _charm person_ does not affect her. Additionally, the monk gains damage reduction 10/magic, which allows her to ignore the first 10 points of damage from any attack made by a nonmagical weapon or by any natural attack made by a creature that doesn’t have similar damage reduction. Unlike other outsiders, the monk can still be brought back from the dead as if she were a member of her previous creature type.',
            },
        ],
        reference: 'PHB:39',
        official: true,
        scope: 'public',
    },
    {
        id: 7,
        name: 'Paladin',
        description: 'The compassion to pursue good, the will to uphold law, and the power to defeat evil—these are the three weapons of the paladin. Few have the purity and devotion that it takes to walk the paladin’s path, but those few are rewarded with the power to protect, to heal, and to smite. In a land of scheming wizards, unholy priests, bloodthirsty dragons, and infernal fiends, the paladin is the final hope that cannot be extinguished.',
        features: [
            {
                name: 'Weapon and Armor Proficiency',
                description: 'Paladins are proficient with all simple and martial weapons, with all types of armor (heavy, medium, and light), and with shields (except tower shields).',
            },
            {
                name: 'Aura of Good',
                type: 'ex',
                description: 'The power of a paladin’s aura of good (see the _detect good_ spell) is equal to her paladin level, just like the aura of a cleric of a good deity.',
            },
            {
                name: 'Detect Evil',
                type: 'sp',
                description: 'At will, a paladin can use _detect evil_, as the spell.',
            },
            {
                name: 'Smite Evil',
                type: 'su',
                description: 'Once per day, a paladin may attempt to smite evil with one normal melee attack. She adds her Charisma bonus (if any) to her attack roll and deals 1 extra point of damage per paladin level. For example, a 13th-level paladin armed with a longsword would deal 1d8+13 points of damage, plus any additional bonuses for high Strength or magical affects that would normally apply. If the paladin accidentally smites a creature that is not evil, the smite has no effect, but the ability is still used up for that day.\n\nAt 5th level, and at every five levels thereafter, the paladin may smite evil one additional time per day, to a maximum of five times per day at 20th level.',
            },
            {
                name: 'Divine Grace',
                type: 'su',
                description: 'At 2nd level, a paladin gains a bonus equal to her Charisma bonus (if any) on all saving throws.',
            },
            {
                name: 'Lay on Hands',
                type: 'su',
                description: 'Beginning at 2nd level, a paladin with a Charisma score of 12 or higher can heal wounds (her own or those of others) by touch. Each day she can heal a total number of hit points of damage equal to her paladin level × her Charisma bonus. For example, a 7th-level paladin with a 16 Charisma (+3 bonus) can heal 21 points of damage per day. A paladin may choose to divide her healing among multiple recipients, and she doesn’t have to use it all at once. Using lay on hands is a standard action.\n\nAlternatively, a paladin can use any or all of this healing power to deal damage to undead creatures. Using lay on hands in this way requires a successful melee touch attack and doesn’t provoke an attack of opportunity. The paladin decides how many of her daily allotment of points to use as damage after successfully touching an undead creature.',
            },
            {
                name: 'Aura of Courage',
                type: 'su',
                description: 'Beginning at 3rd level, a paladin is immune to fear (magical or otherwise). Each ally within 10 feet of her gains a +4 morale bonus on saving throws against fear effects.\n\nThis ability functions while the paladin is conscious, but not if she is unconscious or dead.',
            },
            {
                name: 'Divine Health',
                type: 'ex',
                description: 'At 3rd level, a paladin gains immunity to all diseases, including supernatural and magical diseases (such as mummy rot and lycanthropy).',
            },
            {
                name: 'Turn Undead',
                type: 'su',
                description: 'When a paladin reaches 4th level, she gains the supernatural ability to turn undead. She may use this ability a number of times per day equal to 3 + her Charisma modifier. She turns undead as a cleric of three levels lower would.',
            },
            {
                name: 'Spells',
                description: 'Beginning at 4th level, a paladin gains the ability to cast a small number of divine spells (the same type of spells available to the cleric, druid, and ranger), which are drawn from the paladin spell list.A paladin must choose and prepare her spells in advance.\n\nTo prepare or cast a spell, a paladin must have a Wisdom score equal to at least 10 + the spell level (Wis 11 for 1st-level spells, Wis 12 for 2nd-level spells, and so forth). The Difficulty Class for a saving throw against a paladin’s spell is 10 + the spell level + the paladin’s Wisdom modifier.\n\nLike other spellcasters, a paladin can cast only a certain number of spells of each spell level per day. In addition, she receives bonus spells per day if she has a high Wisdom score. When it indicates that the paladin gets 0 spells per day of a given spell level (for instance, 1st-level spells for a 4th-level paladin), she gains only the bonus spells she would be entitled to based on her Wisdom score for that spell level The paladin does not have access to any domain spells or granted powers, as a cleric does.\n\nA paladin prepares and casts spells the way a cleric does, though she cannot lose a prepared spell to spontaneously cast a cure spell in its place. A paladin may prepare and cast any spell on the paladin spell list, provided that she can cast spells of that level, but she must choose which spells to prepare during her daily meditation.\n\nThrough 3rd level, a paladin has no caster level. At 4th level and higher, her caster level is one-half her paladin level.',
            },
            {
                name: 'Special Mount',
                type: 'sp',
                description: 'Upon reaching 5th level, a paladin gains the service of an unusually intelligent, strong, and loyal steed to serve her in her crusade against evil (see the sidebar). This mount is usu- ally a heavy warhorse (for a Medium paladin) or a warpony (for a Small paladin).\n\nOnce per day, as a full-round action, a paladin may magically call her mount from the celestial realms in which it resides. The mount immediately appears adjacent to the paladin and remains for 2 hours per paladin level; it may be dismissed at any time as a free action. The mount is the same creature each time it is summoned, though the paladin may release a particular mount from service (if it has grown too old to join her crusade, for instance). Each time the mount is called, it appears in full health, regardless of any damage it may have taken previously. The mount also appears wearing or carrying any gear it had when it was last dismissed )including barding, saddle, saddlebags, and the like). Calling a mount is a conjuration (calling) effect.\n\nShould the paladin’s mount die, it immediately disappears, leav- ing behind any equipment it was carrying. The paladin may not summon another mount for thirty days or until she gains a paladin level, whichever comes first, even if the mount is somehow returned from the dead. During this thirty-day period, the paladin takes a –1 penalty on attack and weapon damage rolls.',
            },
            {
                name: 'Remove Disease',
                type: 'sp',
                description: 'At 6th level, a paladin can produce a _remove disease_ effect, as the spell, once per week. She can use this ability one additional time per week for every three levels after 6th (twice per week at 9th, three times at 12th, and so forth).',
            },
            {
                name: 'Code of Conduct',
                description: 'A paladin must be of lawful good alignment and loses all class abilities if she ever willingly commits an evil act. Additionally, a paladin’s code requires that she respect legitimate authority, act with honor (not lying, not cheating, not using poison, and so forth), help those in need (provided they do not use the help for evil or chaotic ends), and punish those who harm or threaten innocents.',
            },
            {
                name: 'Associates',
                description: 'While she may adventure with characters of any good or neutral alignment, a paladin will never knowingly associate with evil characters, nor will she continue an association with someone who consistently offends her moral code. A paladin may accept only henchmen, followers, or cohorts who are lawful good.',
            },
        ],
        reference: 'PHB:42',
        official: true,
        scope: 'public',
    },
    {
        id: 8,
        name: 'Ranger',
        description: 'The forests are home to fierce and cunning creatures, such as bloodthirsty owlbears and malicious displacer beasts. But more cunning and powerful than these monsters is the ranger, a skilled hunter and stalker. He knows the woods as if they were his home (as indeed they are), and he knows his prey in deadly detail.',
        features: [
            {
                name: 'Weapon and Armor Proficiency',
                description: 'A ranger is proficient with all simple and martial weapons, and with light armor and shields (except tower shields).',
            },
            {
                name: 'Favored Enemy',
                type: 'ex',
                description: 'At 1st level, a ranger may select a type of creature from among those given on Table 3–14: Ranger Favored Enemies. Due to his extensive study on his chosen type of foe and training in the proper techniques for combating such creatures, the ranger gains a +2 bonus on Bluff, Listen, Sense Motive, Spot, and Survival checks when using these skills against creatures of this type. Likewise, he gets a +2 bonus on weapon damage rolls against such creatures.\n\nAt 5th level and every five levels thereafter (10th, 15th, and 20th level), the ranger may select an additional favored enemy from those given on the table. In addition, at each such interval, the bonus against any one favored enemy (including the one just selected, if so desired) increases by 2. For example, a 5th-level ranger has two favored enemies; against one he gains a +4 bonus on Bluff, Listen, Sense Motive, Spot, and Survival checks and weapon damage rolls, and against the other he has a +2 bonus. At 10th level, he has three favored enemies, and he gains an additional +2 bonus, which he can allocate to the bonus against any one of his three favored enemies. Thus, his bonuses could be either +4, +4, +2 or +6, +2, +2.\n\nIf the ranger chooses humanoids or outsiders as a favored enemy, he must also choose an associated subtype, as indicated on the table. If a specific creature falls into more than one category of favored enemy (for instance, devils are both evil outsiders and lawful outsiders), the ranger’s bonuses do not stack; he simply uses whichever bonus is higher. See the _Monster Manual_ for more information on types of creatures.',
            },
            {
                name: 'Track',
                description: 'A ranger gains Track as a bonus feat.',
            },
            {
                name: 'Wild Empathy',
                type: 'ex',
                description: 'A ranger can use body language, vocalizations, and demeanor to improve the attitude of an animal (such as a bear or a monitor lizard). This ability functions just like a Diplomacy check to improve the attitude of a person. The ranger rolls 1d20 and adds his ranger level and his Charisma bonus to determine the wild empathy check result. The typical domestic animal has a starting attitude of indifferent, while wild animals are usually unfriendly.\n\nTo use wild empathy, the ranger and the animal must be able to study each other, which means that they must be within 30 feet of one another under normal visibility conditions. Generally, influencing an animal in this way takes 1 minute, but, as with influencing people, it might take more or less time.\n\nThe ranger can also use this ability to influence a magical beast with an Intelligence score of 1 or 2 (such as a basilisk or a girallon), but he takes a –4 penalty on the check.',
            },
            {
                name: 'Combat Style',
                type: 'ex',
                description: 'At 2nd level, a ranger must select one of two combat styles to pursue: archery or two-weapon combat. This choice affects the character’s class features but does not restrict his selection of feats or special abilities in any way.\n\nIf the ranger selects archery, he is treated as having the Rapid Shot feat, even if he does not have the normal prerequisites for that feat.\n\nIf the ranger selects two-weapon combat, he is treated as having the Two-Weapon Fighting feat, even if he does not have the normal prerequisites for that feat.\n\nThe benefits of the ranger’s chosen style apply only when he wears light or no armor. He loses all benefits of his combat style when wearing medium or heavy armor.',
            },
            {
                name: 'Endurance',
                description: 'A ranger gains Endurance as a bonus feat at 3rd level.',
            },
            {
                name: 'Animal Companion',
                type: 'ex',
                description: 'At 4th level, a ranger gains an animal companion selected from the following list: badger, camel, dire rat, dog, riding dog, eagle, hawk, horse (light or heavy), owl, pony, snake (Small or Medium viper), or wolf. If the DM’s campaign takes place wholly or partly in an aquatic environment, the DM may add the following creatures to the ranger’s list of options: crocodile, porpoise, Medium shark, and squid. This animal is a loyal companion that accompanies the ranger on his adventures as appropriate for its kind. (For instance, an aquatic creature can’t adventure with a ranger on land and shouldn’t be selected by a nonaquatic character without extenuating circumstances). In most cases, the animal companion functions as a mount, sentry, scout, or hunting animal, rather than as a protector.\n\nThis ability functions like the druid ability of the same name, except that the ranger’s effective druid level is one-half his ranger level. For example, the animal companion of a 4th-level ranger would be the equivalent of a 2nd-level druid’s animal companion. A ranger may select from the alternative lists of animal companions just as a druid can, though again his effective druid level is half his ranger level. Thus, he must be at least an 8th-level ranger to select from the druid’s list of 4th-level animal companions, and if he chooses one of those animals, his effective druid level would be reduced by 3, to 1st level. Like a druid, a ranger cannot select an alternative animal if the choice would reduce his effective druid level below 1st.',
            },
            {
                name: 'Spells',
                description: 'Beginning at 4th level, a ranger gains the ability to cast a small number of divine spells (the same type of spells available to the cleric, druid, and paladin), which are drawn from the ranger spell list. A ranger must choose and prepare his spells in advance (see below).\n\nTo prepare or cast a spell, a ranger must have a Wisdom score equal to at least 10 + the spell level (Wis 11 for 1st-level spells, Wis 12 for 2nd-level spells, and so forth). The Difficulty Class for a saving throw against a ranger’s spell is 10 + the spell level + the ranger’s Wisdom modifier.\n\nLike other spellcasters, a ranger can cast only a certain number of spells of each spell level per day. In addition, he receives bonus spells per day if he has a high Wisdom score. When Table 3–13 indicates that the ranger gets 0 spells per day of a given spell level (for instance, 1st-level spells for a 4th-level ranger), he gains only the bonus spells he would be entitled to based on his Wisdom score for that spell level. The ranger does not have access to any domain spells or granted powers, as a cleric does.\n\nA ranger prepares and casts spells the way a cleric does, though he cannot lose a prepared spell to cast a cure spell in its place. A ranger may prepare and cast any spell on the ranger spell list, provided that he can cast spells of that level, but he must choose which spells to prepare during his daily meditation.\n\nThrough 3rd level, a ranger has no caster level. At 4th level and higher, his caster level is one-half his ranger level.',
            },
            {
                name: 'Improved Combat Style',
                type: 'ex',
                description: 'At 6th level, a ranger’s aptitude in his chosen combat style (archery or two-weapon combat) improves. If he selected archery at 2nd level, he is treated as having the Manyshot feat, even if he does not have the normal prerequisites for that feat.\n\nIf the ranger selected two-weapon combat at 2nd level, he is treated as having the Improved Two-Weapon Fighting feat, even if he does not have the normal prerequisites for that feat.\n\nAs before, the benefits of the ranger’s chosen style apply only when he wears light or no armor. He loses all benefits of his combat style when wearing medium or heavy armor.',
            },
            {
                name: 'Woodland Stride',
                type: 'ex',
                description: 'Starting at 7th level, a ranger may move through any sort of undergrowth (such as natural thorns, briars, overgrown areas, and similar terrain) at his normal speed and without taking damage or suffering any other impairment. However, thorns, briars, and overgrown areas that are enchanted or magically manipulated to impede motion still affect him.',
            },
            {
                name: 'Swift Tracker',
                type: 'ex',
                description: 'Beginning at 8th level, a ranger can move at his normal speed while following tracks without taking the normal –5 penalty. He takes only a –10 penalty (instead of the normal –20) when moving at up to twice normal speed while tracking.',
            },
            {
                name: 'Evasion',
                type: 'ex',
                description: 'At 9th level, a ranger can avoid even magical and unusual attacks with great agility. If he makes a successful Reflex saving throw against an attack that normally deals half damage on a successful save (such as a red dragon’s fiery breath or a _fireball_), he instead takes no damage. Evasion can be used only if the ranger is wearing light armor or no armor. A helpless ranger (such as one who is unconscious or paralysed) does not gain the benefit of evasion.',
            },
            {
                name: 'Combat Style Mastery',
                type: 'ex',
                description: 'At 11th level, a ranger’s aptitude in his chosen combat style (archery or two-weapon combat) improves again. If he selected archery at 2nd level, he is treated as having the Improved Precise Shot feat, even if he does not have the normal prerequisites for that feat.\n\nIf the ranger selected two-weapon combat at 2nd level, he is treated as having the Greater Two-Weapon Fighting feat, even if he does not have the normal prerequisites for that feat.\n\nAs before, the benefits of the ranger’s chosen style apply only when he wears light or no armor. He loses all benefits of his combat style when wearing medium or heavy armor.',
            },
            {
                name: 'Camouflage',
                type: 'ex',
                description: 'A ranger of 13th level or higher can use the Hide skill in any sort of natural terrain, even if the terrain doesn’t grant cover or concealment.',
            },
            {
                name: 'Hide in Plain Sight',
                type: 'ex',
                description: 'While in any sort of natural terrain, a ranger of 17th level or higher can use the Hide skill even while being observed.',
            },
        ],
        reference: 'PHB:46',
        official: true,
        scope: 'public',
    },
    {
        id: 9,
        name: 'Rogue',
        description: 'Rogues share little in common with each other. Some are stealthy thieves. Others are silver-tongued tricksters. Still others are scouts, infiltrators, spies, diplomats, or thugs. What they share is versatility, adaptability, and rereferencefulness. In general, rogues are skilled at getting what others don’t want them to get: entrance into a locked treasure vault, safe passage past a deadly trap, secret battle plans, a guard’s trust, or some random person’s pocket money.',
        features: [
            {
                name: 'Weapon and Armor Proficiency',
                description: 'Rogues are proficient with all simple weapons, plus the hand crossbow, rapier, shortbow, and short sword. Rogues are proficient with light armor, but not with shields.',
            },
            {
                name: 'Sneak Attack',
                description: 'If a rogue can catch an opponent when he is unable to defend himself effectively from her attack, she can strike a vital spot for extra damage. Basically, the rogue’s attack deals extra damage any time her target would be denied a Dexterity bonus to AC (whether the target actually has a Dexterity bonus or not), or when the rogue flanks her target. This extra damage is 1d6 at 1st level, and it increases by 1d6 every two rogue levels thereafter. Should the rogue score a critical hit with a sneak attack, this extra damage is not multiplied.\n\nRanged attacks can count as sneak attacks only if the target is within 30 feet. A rogue can’t strike with deadly accuracy from beyond that range.\n\nWith a sap (blackjack) or an unarmed strike, a rogue can make a sneak attack that deals nonlethal damage instead of lethal damage. She cannot use a weapon that deals lethal damage to deal nonlethal damage in a sneak attack, not even with the usual –4 penalty, because she must make optimal use of her weapon in order to execute a sneak attack.\n\nA rogue can sneak attack only living creatures with discernible anatomies—undead, constructs, oozes, plants, and incorporeal creatures lack vital areas to attack. Any creature that is immune to critical hits is not vulnerable to sneak attacks. The rogue must be able to see the target well enough to pick out a vital spot and must be able to reach such a spot. A rogue cannot sneak attack while striking a creature with concealment or striking the limbs of a creature whose vitals are beyond reach.',
            },
            {
                name: 'Trapfinding',
                description: 'Rogues (and only rogues) can use the Search skill to locate traps when the task has a Difficulty Class higher than 20. Finding a nonmagical trap has a DC of at least 20, or higher if it is well hidden. Finding a magic trap has a DC of 25 + the level of the spell used to create it.\n\nRogues (and only rogues) can use the Disable Device skill to disarm magic traps. A magic trap generally has a DC of 25 + the level of the spell used to create it. A rogue who beats a trap’s DC by 10 or more with a Disable Device check can study a trap, figure out how it works, and bypass it (with her party) without disarming it.',
            },
            {
                name: 'Evasion',
                type: 'ex',
                description: 'At 2nd level and higher, a rogue can avoid even magical and unusual attacks with great agility. If she makes a successful Reflex saving throw against an attack that normally deals half damage on a successful save (such as a red dragon’s fiery breath or a _fireball_), she instead takes no damage. Evasion can be used only if the rogue is wearing light armor or no armor. A helpless rogue (such as one who is unconscious or paralysed) does not gain the benefit of evasion.',
            },
            {
                name: 'Trap Sense',
                type: 'ex',
                description: 'At 3rd level, a rogue gains an intuitive sense that alerts her to danger from traps, giving her a +1 bonus on Reflex saves made to avoid traps and a +1 dodge bonus to AC against attacks made by traps. These bonuses rise to +2 when the rogue reaches 6th level, to +3 when she reaches 9th level, to +4 when she reaches 12th level, to +5 at 15th, and to +6 at 18th level. Trap sense bonuses gained from multiple classes stack.',
            },
            {
                name: 'Uncanny Dodge',
                type: 'ex',
                description: 'Starting at 4th level, a rogue can react to danger before her senses would normally allow her to do so. She retains her Dexterity bonus to AC (if any) even if she is caught flat-footed or struck by an invisible attacker. However, she still loses her Dexterity bonus to AC if immobilized.\n\nIf a rogue already has uncanny dodge from a different class (a rogue with at least two levels of barbarian, for example), she auto- matically gains improved uncanny dodge (see below) instead.',
            },
            {
                name: 'Improved Uncanny Dodge',
                type: 'ex',
                description: 'A rogue of 8th level or higher can no longer be flanked; she can react to opponents on opposite sides of her as easily as she can react to a single attacker. This defense denies another rogue the ability to sneak attack the character by flanking her, unless the attacker has at least four more rogue levels than the target does.\n\nIf a character already has uncanny dodge (see above) from a second class, the character automatically gains improved uncanny dodge instead, and the levels from the classes that grant uncanny dodge stack to determine the minimum rogue level required to flank the character.',
            },
            {
                name: 'Special Abilities',
                type: 'ex',
                description: 'On attaining 10th level, and at every three levels thereafter (13th, 16th, and 19th), a rogue gains a special ability of her choice from among the following options.\n\n_Crippling Strike (Ex)_: A rogue with this ability can sneak attack opponents with such precision that her blows weaken and hamper them. An opponent damaged by one of her sneak attacks also takes 2 points of Strength damage. Ability points lost to damage return on their own at the rate of 1 point per day for each damaged ability.\n\n_Defensive Roll (Ex)_: The rogue can roll with a potentially lethal blow to take less damage from it than she otherwise would. Once per day, when she would be reduced to 0 or fewer hit points by damage in combat (from a weapon or other blow, not a spell or spe- cial ability), the rogue can attempt to roll with the damage. To use this ability, the rogue must attempt a Reflex saving throw (DC = damage dealt). If the save succeeds, she takes only half damage from the blow; if it fails, she takes full damage. She must be aware of the attack and able to react to it in order to execute her defensive roll— if she is denied her Dexterity bonus to AC, she can’t use this ability. Since this effect would not normally allow a character to make a Reflex save for half damage, the rogue’s evasion ability does not apply to the defensive roll.\n\n_Improved Evasion (Ex)_: This ability works like evasion, except that while the rogue still takes no damage on a successful Reflex saving throw against attacks such as a dragon’s breath weapon or a fireball, henceforth she henceforth takes only half damage on a failed save. A helpless rogue (such as one who is unconscious or paralysed) does not gain the benefit of improved evasion.\n\n_Opportunist (Ex)_: Once per round, the rogue can make an attack of opportunity against an opponent who has just been struck for damage in melee by another character. This attack counts as the rogue’s attack of opportunity for that round. Even a rogue with the Combat Reflexes feat can’t use the opportunist ability more than once per round.\n\n_Skill Mastery_: The rogue becomes so certain in the use of certain skills that she can use them reliably even under adverse conditions. Upon gaining this ability, she selects a number of skills equal to 3 + her Intelligence modifier. When making a skill check with one of these skills, she may take 10 even if stress and distractions would normally prevent her from doing so. A rogue may gain this special ability multiple times, selecting additional skills for it to apply to each time.\n\n_Slippery Mind (Ex)_: This ability represents the rogue’s ability to wriggle free from magical effects that would otherwise control or compel her. If a rogue with slippery mind is affected by an enchantment spell or effect and fails her saving throw, she can attempt it again 1 round later at the same DC. She gets only this one extra chance to succeed on her saving throw.\n\n_Feat_: A rogue may gain a bonus feat in place of a special ability.',
            },
        ],
        reference: 'PHB:49',
        official: true,
        scope: 'public',
    },
    {
        id: 10,
        name: 'Sorcerer',
        description: 'Sorcerers create magic the way a poet creates poems, with inborn talent honed by practice. They have no books, no mentors, no theories—just raw power that they direct at will. Some sorcerers claim that the blood of dragons courses through their veins. That claim may even be true in some cases—it is common knowledge that certain powerful dragons can take humanoid form and even have humanoid lovers, and it’s difficult to prove that a given sorcerer does not have a dragon ancestor. It’s true that sorcerers often have striking good looks, usually with a touch of the exotic that hints at an unusual heritage. Others hold that the claim is either an unsubstantiated boast on the part of certain sorcerers or envious gossip on the part of those who lack the sorcerer’s gift.',
        features: [
            {
                name: 'Weapon and Armor Proficiency',
                description: 'Sorcerers are proficient with all simple weapons. They are not proficient with any type of armor or shield. Armor of any type interferes with a sorcerer’s arcane gestures, which can cause his spells with somatic components to fail.',
            },
            {
                name: 'Spells',
                description: 'A sorcerer casts arcane spells (the same type of spells available to bards and wizards), which are drawn primarily from the sorcerer/wizard spell list. He can cast any spell he knows without preparing it ahead of time, the way a wizard or a cleric must (see below).\n\nTo learn or cast a spell, a sorcerer must have a Charisma score equal to at least 10 + the spell level (Cha 10 for 0-level spells, Cha 11 for 1st-level spells, and so forth). The Difficulty Class for a saving throw against a sorcerer’s spell is 10 + the spell level + the sorcerer’s Charisma modifier.\n\nLike other spellcasters, a sorcerer can cast only a certain number of spells of each spell level per day. In addition, he receives bonus spells per day if he has a high Charisma score.\n\nA sorcerer’s selection of spells is extremely limited. A sorcerer begins play knowing four 0-level spells (also called cantrips) and two 1st-level spells of your choice. At each new sorcerer level, he gains one or more new spells, . (Unlike spells per day, the number of spells a sorcerer knows is not affected by his Charisma score; the numbers are fixed.) These new spells can be common spells chosen from the sorcerer/wizard spell list, or they can be unusual spells that the sorcerer has gained some understanding of by study. For example, a sorcerer with a scroll or spellbook detailing an unusual sorcerer/wizard spell (one not on the sorcerer/wizard spell list in this book) could select that spell as one of his new spells for attaining a new level, provided that it is of the right spell level. The sorcerer can’t use this method of spell acquisition to learn spells at a faster rate, however.\n\nUpon reaching 4th level, and at every even-numbered sorcerer level after that (6th, 8th, and so on), a sorcerer can choose to learn a new spell in place of one he already knows. In effect, the sorcerer “loses” the old spell in exchange for the new one. The new spell’s level must be the same as that of the spell being exchanged, and it must be at least two levels lower than the highest-level sorcerer spell the sorcerer can cast. For instance, upon reaching 4th-level, a sorcerer could trade in a single 0-level spell (two spell levels below the highest-level sorcerer spell he can cast, which is 2nd) for a different 0-level spell. At 6th level, he could trade in a single 0-level or 1st-level spell (since he now can cast 3rd-level sorcerer spells) for a different spell of the same level. A sorcerer may swap only a single spell at any given level, and must choose whether or not to swap the spell at the same time that he gains news pells known for the level.\n\nUnlike a wizard or a cleric, a sorcerer need not prepare his spells in advance. He can cast any spell he knows at any time, assuming he has not yet used up his spells per day for that spell level. For example, at 1st level, the sorcerer Hennet can cast four 1st-level spells per day—three for being 1st level However, he knows only two 1st-level spells: _magic missile_ and _sleep_. Thus, on any given day, he can cast some combination of the two spells a total of four times. He does not have to decide ahead of time which spells he’ll cast.',
            },
            {
                name: 'Familiar',
                description: 'A sorcerer can obtain a familiar. Doing so takes 24 hours and uses up magical materials that cost 100 gp. A familiar is a magical beast that resembles a small animal and is unusually tough and intelligent. The creature serves as a companion and servant.\n\nThe sorcerer chooses the kind of familiar he gets. As the sorcerer advances in level, his familiar also increases in power.\n\nIf the familiar dies or is dismissed by the sorcerer, the sorcerer must attempt a DC 15 Fortitude saving throw. Failure means he loses 200 experience points per sorcerer level; success reduces the loss to one-half that amount. However, a sorcerer’s experience point total can never go below 0 as the result of a familiar’s demise or dismissal. For example, suppose that Hennet is a 3rd-level sorcerer with 3,230 XP when his owl familiar is killed by a bugbear. Hennet makes a successful saving throw, so he loses 300 XP, dropping him below 3,000 XP and back to 2nd level (see the _Dungeon Master’s Guide_ for rules for losing levels). A slain or dismissed familiar cannot be replaced for a year and day. A slain familiar can be raised from the dead just as a character can be, and it does not lose a level or a Constitution point when this happy event occurs.\n\nA character with more than one class that grants a familiar may have only one familiar at a time.',
            },
        ],
        reference: 'PHB:51',
        official: true,
        scope: 'public',
    },
    {
        id: 11,
        name: 'Wizard',
        description: 'A few unintelligible words and fleeting gestures carry more power than a battleaxe, when they are the words and gestures of a wizard. These simple acts make magic seem easy, but they only hint at the time the wizard must spend poring over her spellbook preparing each spell for casting, and the years before that spent in apprenticeship to learn the arts of magic.\n\nWizards depend on intensive study to create their magic. They examine musty old tomes, debate magical theory with their peers, and practice minor magics whenever they can. For a wizard, magic is not a talent but a difficult, rewarding art.',
        features: [
            {
                name: 'Weapon and Armor Proficiency',
                description: 'Wizards are proficient with the club, dagger, heavy crossbow, light crossbow, and quarterstaff, but not with any type of armor or shield. Armor of any type interferes with a wizard’s movements, which can cause her spells with somatic components to fail.',
            },
            {
                name: 'Spells',
                description: 'A wizard casts arcane spells (the same type of spells available to sorcerers and bards), which are drawn from the sorcerer/wizard spell list. A wizard must choose and prepare her spells ahead of time (see below).\n\nTo learn, prepare, or cast a spell, the wizard must have an Intelligence score equal to at least 10 + the spell level (Int 10 for 0-level spells, Int 11 for 1st-level spells, and so forth). The Difficulty Class for a saving throw against a wizard’s spell is 10 + the spell level + the wizard’s Intelligence modifier.\n\nLike other spellcasters, a wizard can cast only a certain number of spells of each spell level per day. In addition, she receives bonus spells per day if she has a high Intelligence score.\n\nUnlike a bard or sorcerer, a wizard may know any number of spells. She must choose and prepare her spells ahead of time by getting a good night’s sleep and spending 1 hour studying her spellbook. While studying, the wizard decides which spells to prepare.',

            },
            {
                name: 'Bonus Languages',
                description: 'A wizard may substitute Draconic for one of the bonus languages available to the character because of her race. Many ancient tomes of magic are written in Draconic, and apprentice wizards often learn it as part of their studies.',
            },
            {
                name: 'Familiar',
                description: 'A wizard can obtain a familiar in exactly the same manner as a sorcerer can. See the sorcerer description and the accompanying Familiars sidebar for details.',
            },
            {
                name: 'Scribe Scroll',
                description: 'At 1st level, a wizard gains Scribe Scroll as a bonus feat. This feats enables her to create magic schools.',
            },
            {
                name: 'Bonus Feats',
                description: 'At 5th, 10th, 15th, and 20th level, a wizard gains a bonus feat. At each such opportunity, she can choose a metamagic feat, an item creation feat, or Spell Mastery. The wizard must still meet all prerequisites for a bonus feat, including caster level minimums.\n\nThese bonus feats are in addition to the feat that a character of any class gets every three levels. The wizard is not limited to the categories of item creation feats, metamagic feats, or Spell Mastery when choosing these feats.',
            },
            {
                name: 'Spellbooks',
                description: 'A wizard must study her spellbook each day to prepare her spells. She cannot prepare any spell not recorded in her spellbook, except for read magic, which all wizards can prepare from memory.\n\nA wizard begins play with a spellbook containing all 0-level wizard spells (except those from her prohibited school or schools, if any; plus three 1st-level spells of your choice. For each point of Intelligence bonus the wizard has, the spellbook holds one additional 1st-level spell of your choice. At each new wizard level, she gains two new spells of any spell level or levels that she can cast (based on her new wizard level) for her spellbook. For example, when a wizard attains 5th level, she can cast 3rd-level spells. At this point, she can add two new 3rd-level spells to her spellbook, or one 2nd-level spell and one 3rd-level spell, or any combination of two spells between 1st and 3rd level. At any time, a wizard can also add spells found in other wizards’ spellbooks to her own.',
            },
        ],
        reference: 'PHB:55',
        official: true,
        scope: 'public',
    },
];

const dnd35Races = [
    {
        id: 1,
        name: 'Human',
        description: 'Most humans are the descendants of pioneers, conquerors, traders, travelers, refugees, and other people on the move. As a result, human lands are home to a mix of people—physically, culturally, religiously, and politically different. Hardy or fine, light-skinned or dark, showy or austere, primitive or civilized, devout or impious, humans run the gamut.',
        size: 'M',
        speed: 30,
        traits: [
            {
                name: 'Automatic Language',
                description: 'Common.',
            },
            {
                name: 'Bonus Language',
                description: 'Any (other than secret languages, such as Druidic). Humans mingle with all kinds of other folk and thus can learn any language found in an area.',
            },
            {
                name: 'Favored Class',
                description: 'Any. When determining whether a multiclass human takes an experience point penalty, her highest-level class does not count.',
            },
        ],
        reference: "Player's Handbook",
        official: true,
        scope: 'public',
    },
    {
        id: 2,
        name: 'Dwarf',
        description: 'Dwarves are known for their skill in warfare, their ability to withstand physical and magical punishment, their knowledge of the earth’s secrets, their hard work, and their capacity for drinking ale. Their mysterious kingdoms, carved out from the insides of mountains, are renowned for the marvelous treasures that they produce as gifts or for trade.',
        size: 'S',
        speed: 20,
        traits: [
            {
                name: 'Darkvision',
                description: 'Dwarves can see in the dark up to 60 feet. Darkvision is black and white only, but it is otherwise like normal sight, and dwarves can function just fine with no light at all.',
            },
            {
                name: 'Stonecunning',
                description: 'This ability grants a dwarf a +2 racial bonus on Search checks to notice unusual stonework, such as sliding walls, stonework traps, new construction (even when built to match the old), unsafe stone surfaces, shaky stone ceilings, and the like. Something that isn’t stone but that is disguised as stone also counts as unusual stonework. A dwarf who merely comes within 10 feet of unusual stonework can make a Search check as if he were actively searching, and a dwarf can use the Search skill to find stonework traps as a rogue can. A dwarf can also intuit depth, sensing his approximate depth underground as naturally as a human can sense which way is up. Dwarves have a sixth sense about stonework, an innate ability that they get plenty of opportunity to practice and hone in their underground homes.',
            },
            {
                name: 'Weapon Familiarity',
                description: 'Dwarves may treat dwarven waraxes and dwarven urgroshes as martial weapons, rather than exotic weapons.',
            },
            {
                name: 'Stability',
                description: 'Dwarves are exceptionally stable on their feet. A dwarf gains a +4 bonus on ability checks made to resist being bull rushed or tripped when standing on the ground (but not when climbing, flying, riding, or otherwise not standing firmly on the ground).',
            },
            {
                name: 'Resistant',
                description: '+2 racial bonus on saving throws against poison: Dwarves are hardy and resistant to toxins.',
            },
            {
                name: 'Innate Resistance',
                description: '+2 racial bonus on saving throws against spells and spell-like effects: dwarves have an innate resistance to magic spells.',
            },
            {
                name: 'Common Enemy',
                description: '+1 racial bonus to attack rolls against orcs (including half-orcs) and goblinoids (including goblins, hobgoblins, and bugbears): Dwarves are trained in the special combat techniques that allow them to fight their common enemies more effectively.',
            },
            {
                name: 'Giant Hunter',
                description: '+4 dodge bonus to Armor Class against monsters of the giant type (such as ogres, trolls, and hill giants): This bonus represents special training that dwarves undergo, during which they learn tricks that previous generations developed in their battles with giants. Any time a creature loses its Dexterity bonus (if any) to Armor Class, such as when it’s caught flat-footed, it loses its dodge bonus, too. The _Monster Manual_ has information on which creatures are of the giant type.',
            },
            {
                name: 'Metalcunning',
                description: '+2 racial bonus on Appraise checks that are related to stone or metal items: Dwarves are familiar with valuable items of all kinds, especially those made of stone or metal.',
            },
            {
                name: 'Artisan',
                description: '+2 racial bonus on Craft checks that are related to stone or metal: Dwarves are especially capable with stonework and metalwork.',
            },
            {
                name: 'Automatic Languages',
                description: 'Common and Dwarven.',
            },
            {
                name: 'Bonus Languages',
                description: 'Giant, Gnome, Goblin, Orc, Terran, and Undercommon. Dwarves are familiar with the languages of their enemies and of their subterranean allies.',
            },
            {
                name: 'Favored Class',
                description: 'Fighter. A multiclass dwarf’s fighter class does not count when determining whether he takes an experience point penalty for multiclassing. Dwarven culture extols the virtues of battle, and the vocation comes easily to dwarves.',
            },
        ],
        reference: "Player's Handbook",
        official: true,
        scope: 'public',
    },
    {
        id: 3,
        name: 'Elf',
        description: 'Elves mingle freely in human lands, always welcome yet never at home there. They are well known for their poetry, dance, song, lore, and magical arts. Elves favor things of natural and simple beauty. When danger threatens their woodland homes, however, elves reveal a more martial side, demonstrating skill with sword, bow, and battle strategy.',
        size: 'M',
        speed: 30,
        traits: [
            {
                name: 'Sleep Immunity',
                description: 'Immunity to magic sleep effects, and a +2 racial saving throw bonus against enchantment spells or effects.',
            },
            {
                name: 'Low-light Vision',
                description: 'An elf can see twice as far as a human in starlight, moonlight, torchlight, and similar conditions of poor illumination. She retains the ability to distinguish color and detail under these conditions.',
            },
            {
                name: 'Weapon Proficiency',
                description: 'Elves receive the Martial Weapon Proficiency feats for the longsword, rapier, longbow (including composite longbow), and shortbow (including composite shortbow) as bonus feats. Elves esteem the arts of swordplay and archery, so all elves are familiar with these weapons.',
            },
            {
                name: 'Keen Senses',
                description: '+2 racial bonus on Listen, Search, and Spot checks. An elf who merely passes within 5 feet of a secret or concealed door is entitled to a Search check to notice it as if she were actively looking for it. An elf’s senses are so keen that she practically has a sixth sense about hidden portals.',
            },
            {
                name: 'Automatic Languages',
                description: 'Common and Elven.',
            },
            {
                name: 'Bonus Languages',
                description: 'Draconic, Gnoll, Gnome, Goblin, Orc, and Sylvan. Elves commonly know the languages of their enemies and of their friends, as well as Draconic, the language commonly found in ancient tomes of secret knowledge.',
            },
            {
                name: 'Favored Class',
                description: 'Wizard. A multiclass elf’s wizard class does not count when determining whether she takes an experience point penalty for multiclassing. Wizardry comes naturally to elves—indeed, they sometimes claim to have invented it, and fighter/wizards are especially common among them.',
            },
        ],
        reference: "Player's Handbook",
        official: true,
        scope: 'public',
    },
    {
        id: 4,
        name: 'Gnome',
        description: 'Gnomes are welcome everywhere as technicians, alchemists, and inventors. Despite the demand for their skills, most gnomes prefer to remain among their own kind, living in comfortable burrows beneath rolling, wooded hills where animals abound.',
        size: 'S',
        speed: 20,
        traits: [
            {
                name: 'Low-light Vision',
                description: 'A gnome can see twice as far as a human in starlight, moonlight, torchlight, and similar conditions of poor illumination. He retains the ability to distinguish color and detail under these conditions.',
            },
            {
                name: 'Weapon Familiarity',
                description: 'Gnomes may treat gnome hooked hammers as martial weapons rather than exotic weapons.',
            },
            {
                name: 'Illusory Studies',
                description: '+2 racial bonus on saving throws against illusions: Gnomes are innately familiar with illusions of all kinds.',
            },
            {
                name: 'Skilled Illusionist',
                description: 'Add +1 to the Difficulty Class for all saving throws against illusion spells cast by gnomes. Their innate familiarity with these effects make their illusions more difficult to see through. This adjustment stacks with those from similar effects, such as the Spell Focus feat.',
            },
            {
                name: 'Common Enemy',
                description: '+1 racial bonus on attack rolls against kobolds and goblinoids (including goblins, hobgoblins, and bugbears): Gnomes battle these creatures frequently and practice special techniques for fighting them.',
            },
            {
                name: 'Giant Hunter',
                description: '+4 dodge bonus to Armor Class against monsters of the giant type (such as ogres, trolls, and hill giants): This bonus represents special training that gnomes undergo, during which they learn tricks that previous generations developed in their battles with giants. Any time a creature loses its Dexterity bonus (if any) to Armor Class, such as when it’s caught flat-footed, it loses its dodge bonus, too. The _Monster Manual_ has information on which creatures are of the giant type.',
            },
            {
                name: 'Keen Ears',
                description: '+2 racial bonus on Listen checks: Gnomes have keen ears.',
            },
            {
                name: 'Natural Alchemist',
                description: '+2 racial bonus on Craft (alchemy) checks: A gnome’s sensitive nose allows him to monitor alchemical processes by smell.',
            },
            {
                name: 'Automatic Languages',
                description: 'Common and Gnome.',
            },
            {
                name: 'Bonus Languages',
                description: 'Draconic, Dwarven, Elven, Giant, Goblin, and Orc. Gnomes deal more with elves and dwarves than elves and dwarves deal with one another, and they learn the languages of their enemies (kobolds, giants, goblins, and orcs) as well. In addition, a gnome can use speak with a burrowing mammal (a badger, fox, rabbit, or the like, see below). This ability is innate to gnomes.',
            },
            {
                name: 'Spell-Like Abilities',
                description: '1/day — _speak with animals_ (burrowing mammal only, duration 1 minute). A gnome with a Charisma score of at least 10 also has the following spell-like abilities: 1/day — _dancing lights_, _ghost sound_, _prestidigitation_. Caster level 1st; save DC 10 + gnome’s Cha modifier + spell level.',
            },
            {
                name: 'Favored Class',
                description: 'Bard. A multiclass gnome’s bard class does not count when determining whether he takes an experience point penalty.',
            },
        ],
        reference: "Player's Handbook",
        official: true,
        scope: 'public',
    },
    {
        id: 5,
        name: 'Half-Elf',
        description: 'Humans and elves sometimes wed, the elf attracted to the human’s energy and the human to the elf’s grace. These marriages end quickly as elves count years because a human’s life is so brief, but they leave an enduring legacy—half-elf children.\n\nThe life of a half-elf can be hard. If raised by elves, the half-elf seems to grow with astounding speed, reaching maturity within two decades. The half-elf becomes an adult long before she has had time to learn the intricacies of elven art and culture, or even grammar. She leaves behind her childhood friends, becoming physically an adult but culturally still a child by elven standards. Typically, she leaves her elven home, which is no longer familiar, and finds her way among humans.\n\nIf, on the other hand, she is raised by humans, the half-elf finds herself different from her peers: more aloof, more sensitive, less ambitious, and slower to mature. Some half-elves try to fit in among humans, while others find their identities in their difference. Most find places for themselves in human lands, but some feel like outsiders all their lives.',
        size: 'M',
        speed: 30,
        traits: [
            {
                name: 'Sleep Immunity',
                description: 'Immunity to magic sleep effects, and a +2 racial saving throw bonus against enchantment spells or effects.',
            },
            {
                name: 'Low-light Vision',
                description: 'A half-elf can see twice as far as a human in starlight, moonlight, torchlight, and similar conditions of poor illumination. She retains the ability to distinguish color and detail under these conditions.',
            },
            {
                name: 'Keen Senses',
                description: '+1 racial bonus on Listen, Search, and Spot checks: A half-elf does not have the elf’s ability to notice secret doors simply by passing near them. Half-elves have keen senses, but not as keen as those of an elf.',
            },
            {
                name: 'Natural Diplomat',
                description: '+2 racial bonus on Diplomacy and Gather Information checks: Half-elves get along naturally with all people.',
            },
            {
                name: 'Elven Blood',
                description: 'For all effects related to race, a half-elf is considered an elf. Half-elves, for example, are just as vulnerable to special effects that affect elves as their elf ancestors are, and they can use magic items that are only usable by elves.',
            },
            {
                name: 'Automatic Languages',
                description: 'Common and Elven.',
            },
            {
                name: 'Bonus Languages',
                description: 'Any (other than secret languages, such as Druidic). Half-elves have all the versatility and broad (if shallow) experience that humans have.',
            },
            {
                name: 'Favored Class',
                description: 'Any. When determining whether a multiclass half-elf takes an experience point penalty, her highest-level class does not count.',
            },
        ],
        reference: "Player's Handbook",
        official: true,
        scope: 'public',
    },
    {
        id: 6,
        name: 'Half-Orc',
        description: 'In the wild frontiers, tribes of human and orc barbarians live in uneasy balance, fighting in times of war and trading in times of peace. Half-orcs who are born in the frontier may live with either human or orc parents, but they are nevertheless exposed to both cultures. Some, for whatever reason, leave their homeland and travel to civilized lands, bringing with them the tenacity, courage, and combat prowess that they developed in the wilds.',
        size: 'M',
        speed: 30,
        traits: [
            {
                name: 'Darkvision',
                description: 'Half-orcs (and orcs) can see in the dark up to 60 feet. Darkvision is black and white only, but it is otherwise like normal sight, and half-orcs can function just fine with no light at all.',
            },
            {
                name: 'Orc Blood',
                description: 'For all effects related to race, a half-orc is considered an orc. Half-orcs, for example, are just as vulnerable to special effects that affect orcs as their orc ancestors are, and they can use magic items that are only usable by orcs.',
            },
            {
                name: 'Automatic Languages',
                description: 'Common and Orc.',
            },
            {
                name: 'Bonus Languages',
                description: 'Draconic, Giant, Gnoll, Goblin, and Abyssal. Smart half-orcs (who are rare) may know the languages of their allies or rivals.',
            },
            {
                name: 'Favored Class',
                description: 'Barbarian. A multiclass half-orc’s barbarian class does not count when determining whether he takes an experience point penalty. Ferocity runs in a half-orc’s veins.',
            },
        ],
        reference: "Player's Handbook",
        official: true,
        scope: 'public',
    },
    {
        id: 7,
        name: 'Halfling',
        description: 'Halflings are clever, capable opportunists. Halfling individuals and clans find room for themselves wherever they can. Often they are strangers and wanderers, and others react to them with suspicion or curiosity. Depending on the clan, halflings might be reliable, hard-working (if clannish) citizens, or they might be thieves just waiting for the opportunity to make a big score and disappear in the dead of night. Regardless, halflings are cunning, rereferenceful survivors.',
        size: 'S',
        speed: 20,
        traits: [
            {
                name: 'Natural Agility',
                description: '+2 racial bonus on Climb, Jump, and Move Silently checks: Halflings are agile, surefooted, and athletic.',
            },
            {
                name: 'Lucky',
                description: '+1 racial bonus on all saving throws: Halflings are surprisingly capable of avoiding mishaps.',
            },
            {
                name: 'Fearless',
                description: '+2 morale bonus on saving throws against fear. This bonus stacks with the halfling’s +1 bonus on saving throws in general.',
            },
            {
                name: 'Natural Marksman',
                description: '+1 racial bonus on attack rolls with a thrown weapon and slings: Throwing and slinging stones is a universal sport among halflings, and they develop especially good aim.',
            },
            {
                name: 'Keen Ears',
                description: '+2 racial bonus on Listen checks: Halflings have keen ears.',
            },
            {
                name: 'Automatic Languages',
                description: 'Common and Halfling.',
            },
            {
                name: 'Bonus Languages',
                description: 'Dwarven, Elven, Gnome, Goblin, and Orc. Smart halflings learn the languages of their friends and enemies.',
            },
            {
                name: 'Favored Class',
                description: 'Rogue. A multiclass halfling’s rogue class does not count when determining whether she take an experience point penalty for multiclassing. Halflings have long had to rely on stealth, wit, and skill, and the vocation of rogue comes naturally to them.',
            },
        ],
        reference: "Player's Handbook",
        official: true,
        scope: 'public',
    },
    {
        id: 8,
        name: 'Tiefling',
        description: 'Tieflings are sneaky, subtle, and generally conniving. They prefer to strike from ambush and usually avoid a fair fight if they can. Many tieflings are indistinguishable from humans. Others have small horns, pointed teeth, red eyes, a whiff of brimstone about them, or even cloven feet. No two tieflings are the same.',
        size: 'M',
        speed: 30,
        traits: [
            {
                name: 'Darkvision',
                description: 'Darkvision out to 60 feet.',
            },
            {
                name: 'Natural Cunning',
                description: 'Tieflings have a +2 racial bonus on Bluff and Hide checks. Tieflings are naturally cunning.',
            },
            {
                name: 'Darkness',
                type: 'sp',
                description: 'A tiefling can use darkness once per day (caster level equal to class levels).',
            },
            {
                name: 'Infernal Resistance',
                description: 'Resistance to cold 5, electricity 5, and fire 5.',
            },
            {
                name: 'Automatic Languages',
                description: 'Common and Infernal.',
            },
            {
                name: 'Bonus Languages',
                description: 'Draconic, Dwarven, Elven, Gnome, Goblin, Halfling, Orc.',
            },
            {
                name: 'Favored Class',
                description: 'Rogue. A multiclass tiefling’s rogue class does not count when determining whether she take an experience point penalty for multiclassing. Tieflings have long had to rely on stealth, wit, and skill, and the vocation of rogue comes naturally to them.',
            },
        ],
        reference: 'SRD:0',
        official: true,
        scope: 'public',
    },
];

//----------------------------------------------------------------------------------------------------------------------
export async function seed(knex : Knex) : Promise<void>
{
    // Delete existing entries
    await knex('dnd35_reference').del();
    await knex('dnd35_class')
        .where({ official: true })
        .del();
    await knex('dnd35_race')
        .where({ official: true })
        .del();

    // Insert new entries
    await knex('dnd35_reference').insert([
        { name: 'Homebrew', abbr: 'HB', product_code: 'HB999' },
        { name: 'Player\'s Handbook', abbr: 'PHB', product_code: 'PHB999' },
        { name: 'System Reference Document', abbr: 'SRD', product_code: 'SRD999' },
    ]);
    await knex('dnd35_class').insert([
        ...dnd35Classes.map((cls) => ({ ...cls, features: JSON.stringify(cls.features) })),
    ]);
    await knex('dnd35_race').insert([
        ...dnd35Races.map((race) => ({ ...race, traits: race.traits ? JSON.stringify(race.traits) : [] })),
    ]);
}

//----------------------------------------------------------------------------------------------------------------------
