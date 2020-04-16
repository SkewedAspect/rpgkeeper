//----------------------------------------------------------------------------------------------------------------------
// Populate a default set of EotE/Genesys Abilities
//----------------------------------------------------------------------------------------------------------------------

exports.seed = function(knex)
{
    // Deletes ALL existing entries
    return knex('eote_ability').del()
        .where({ official: true })
        .then(() =>
        {
            // Inserts seed entries
            return knex('eote_ability').insert([
                { name: 'Bothan Special Ability', description: 'Bothans begin the game with one rank in Streetwise. They still may not train Streetwise above rank 2 during character creation. They also start with one rank in the Convincing Demeanor talent.', reference: 'E-CRB:44', official: true },
                { name: 'Droid Special Ability', description: 'Droids do not need to eat, sleep, or breath, and are unaffected by toxins or poisons. Droids have a cybernetic implant cap of 6 instead of their brawn rating. In addition, after selecting their career, a Droid Player Character may train one rank in six of the eight skills (instead of the usual four). After selecting their first specialization, a Droid Player Character may train one rank in three of the four specialization skills (instead of the usual two).', reference: 'E-CRB:47', official: true },
                { name: 'Inorganic', description: 'Since droids are inorganic, they do not gain the benefits of recovering with a bacta tank, stimpack, or Medicine skill checks. Droids do recover naturally by resting as their systems attempt self-repairs. Otherwise, droids need to be tended to with a Mechanics check, using the same difficulties and results of Medicine checks for organic beings. Due to their resilient metallic construction, droids start the game with one rank in the Enduring talent.', reference: 'E-CRB:47', official: true },
                { name: 'Mechanical Being', description: 'Droids cannot become Force sensitive, nor acquire a Force Rating by any means. Droids cannot use Force powers, and also cannot be affected by mind-altering Force powers.', reference: 'E-CRB:47', official: true },
                { name: 'Gand Special Ability', description: 'Gands begin the game with one rank in Discipline.', reference: 'E-CRB:48', official: true },
                { name: 'Ammonia Breathers', description: 'One notable difference between the two main sub-species of Gand is that one had lungs and one does not. Those that have lungs breathe an ammonia gas mixture. Those without lungs do not respire and gain all necessary metabolic substances through food. When playing a Gand, each player chooses whether he wishes his character to have lungs or not. If he selects to be playing a lungless Gand, his character is immune to suffocation (but not the wounds suffered from being exposed to vacuum). If he chooses to play a gand with lungs, he starts the game with an ammonia respirator, and treats oxygen as a dangerous atmosphere with Rating 8. However, he gains +10 starting XP.', reference: 'E-CRB:48', official: true },
                { name: 'Human Special Ability', description: 'Humans start the game with one rank in two different non-career skills of their choice. They may not train these skills above rank two at character creation.', reference: 'E-CRB:48', official: true },
                { name: 'Rodian Special Ability', description: 'Rodians begin the game with one rank in Survival. Rodians start with one rank in the Expert Tracker talent.', reference: 'E-CRB:50', official: true },
                { name: 'Trandoshans Special Ability', description: 'Trandoshans begin the game with one rank in Perception. They still may not train Perception about rank 2 during character creation.', reference: 'E-CRB:51', official: true },
                { name: 'Regeneration', description: 'Whenever a Trandoshan would recover one or more wounds from natural rest or recuperation in a Bacta tank, he recovers one additional wound. He does not recover one additional wound when receiving first aid or then using a stimpack. Trandoshans can regrow lost limbs as well, though it usually takes at least a month before the limb is usable.', reference: 'E-CRB:51', official: true },
                { name: 'Claws', description: 'When a Trandoshan makes Brawl checks to deal damage to an opponent, he deals +1 damage and has a Critical Rating of 3.', reference: 'E-CRB:51', official: true },
                { name: 'Twi\'lek Special Ability', description: 'Twi\'leks being the game with one rank in either Charm or Deception. They still may not train Charm or Deception above rank 2 during character creation. When making skill checks, Twi\'leks may remove <setback></setback> imposed due to arid or hot environmental conditions.', reference: 'E-CRB:54', official: true },
                { name: 'Wookie Special Ability', description: 'Wookies begin the game with one rank in Brawl. They still may not train Brawl above rank 2 during character creation.', reference: 'E-CRB:53', official: true },
                { name: 'Wookie Rage', description: 'When a Wookie has suffered any wounds, he deals +1 damage to Brawl and Melee attacks. When a Wookie is Critically Injured, he instead deals +2 damage to Brawl and Melee attacks.', reference: 'E-CRB:53', official: true }
            ]);
        });
};

//----------------------------------------------------------------------------------------------------------------------
