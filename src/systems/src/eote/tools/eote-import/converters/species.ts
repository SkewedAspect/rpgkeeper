//----------------------------------------------------------------------------------------------------------------------
// Species Converter
//----------------------------------------------------------------------------------------------------------------------

import type { XmlOptionChoice, XmlSkillModifier, XmlSpecies, XmlTalentModifier } from '../types.ts';
import { cleanDescription, extractAllReferences } from '../utils.ts';

//----------------------------------------------------------------------------------------------------------------------

export interface InternalSpeciesAbility
{
    name : string;
    description : string;
}

export interface InternalSpeciesSkillModifier
{
    skill : string;
    startingRanks : number;
    rankLimit ?: number;
}

export interface InternalSpeciesTalentModifier
{
    talent : string;
    startingRanks : number;
}

export interface InternalSpecies
{
    id : string;
    name : string;
    description : string;
    characteristics : {
        brawn : number;
        agility : number;
        intellect : number;
        cunning : number;
        willpower : number;
        presence : number;
    };
    woundThreshold : number;
    strainThreshold : number;
    startingXP : number;
    abilities : InternalSpeciesAbility[];
    specialAbilities : string;
    skillModifiers : InternalSpeciesSkillModifier[];
    talentModifiers : InternalSpeciesTalentModifier[];
    reference : string[];
}

//----------------------------------------------------------------------------------------------------------------------
// Skill key to name mapping
//----------------------------------------------------------------------------------------------------------------------

const SKILL_KEY_MAP : Record<string, string> = {
    ASTRO: 'Astrogation',
    ATHL: 'Athletics',
    BRAWL: 'Brawl',
    CHARM: 'Charm',
    COERC: 'Coercion',
    COMP: 'Computers',
    COOL: 'Cool',
    COORD: 'Coordination',
    CORE: 'Core Worlds',
    DECEP: 'Deception',
    DISC: 'Discipline',
    EDU: 'Education',
    GUNN: 'Gunnery',
    LEAD: 'Leadership',
    LORE: 'Lore',
    LTSABER: 'Lightsaber',
    MECH: 'Mechanics',
    MED: 'Medicine',
    MELEE: 'Melee',
    NEG: 'Negotiation',
    OUTER: 'Outer Rim',
    PERC: 'Perception',
    PILOTPL: 'Piloting (Planetary)',
    PILOTSP: 'Piloting (Space)',
    RANGHVY: 'Ranged (Heavy)',
    RANGLT: 'Ranged (Light)',
    RESIL: 'Resilience',
    SKUL: 'Skulduggery',
    STEAL: 'Stealth',
    STWISE: 'Streetwise',
    SURV: 'Survival',
    UNDERW: 'Underworld',
    VIGIL: 'Vigilance',
    XENO: 'Xenology',
};

function mapSkillKey(key : string) : string
{
    return SKILL_KEY_MAP[key] ?? key;
}

//----------------------------------------------------------------------------------------------------------------------
// Talent key to name mapping
//----------------------------------------------------------------------------------------------------------------------

const TALENT_KEY_MAP : Record<string, string> = {
    CONF: 'Confidence',
    CONV: 'Convincing Demeanor',
    DEFDRI: 'Defensive Driving',
    DURA: 'Durable',
    ENDUR: 'Enduring',
    EXTRACK: 'Expert Tracker',
    EYEDET: 'Eye for Detail',
    FRENZ: 'Frenzied Attack',
    GEARHD: 'Gearhead',
    HEIGHT: 'Heightened Awareness',
    INDIS: 'Indistinguishable',
    KILL: 'Kill with Kindness',
    KNOWSOM: 'Know Somebody',
    KNOWSPEC: 'Knowledge Specialization',
    LETHALBL: 'Lethal Blows',
    NATOUT: 'Natural Outdoorsman',
    NOBFOOL: "Nobody's Fool",
    OUTDOOR: 'Outdoorsman',
    PHYSTRAIN: 'Physical Training',
    RESEARCH: 'Researcher',
    SKILLJOCK: 'Skilled Jockey',
    SOLREP: 'Solid Repairs',
    STALK: 'Stalker',
    SURG: 'Surgeon',
    UTINNI: 'Utinni!',
};

function mapTalentKey(key : string) : string
{
    return TALENT_KEY_MAP[key] ?? key;
}

//----------------------------------------------------------------------------------------------------------------------
// Converter Functions
//----------------------------------------------------------------------------------------------------------------------

/**
 * Ensure an item is an array
 */
function ensureArray<T>(item : T | T[] | undefined) : T[]
{
    if(item === undefined)
    {
        return [];
    }
    return Array.isArray(item) ? item : [ item ];
}

/**
 * Convert skill modifiers from XML
 */
function convertSkillModifiers(modifiers : XmlSkillModifier[] | undefined) : InternalSpeciesSkillModifier[]
{
    if(!modifiers)
    {
        return [];
    }

    return modifiers.map((mod) => ({
        skill: mapSkillKey(mod.Key),
        startingRanks: mod.RankStart ?? 0,
        rankLimit: mod.RankLimit,
    }));
}

/**
 * Convert talent modifiers from XML
 */
function convertTalentModifiers(modifiers : XmlTalentModifier[] | undefined) : InternalSpeciesTalentModifier[]
{
    if(!modifiers)
    {
        return [];
    }

    return modifiers.map((mod) => ({
        talent: mapTalentKey(mod.Key),
        startingRanks: mod.RankAdd ?? 1,
    }));
}

/**
 * Extract abilities from option choices
 */
function extractAbilities(optionChoices : XmlOptionChoice[] | undefined) : InternalSpeciesAbility[]
{
    if(!optionChoices)
    {
        return [];
    }

    const abilities : InternalSpeciesAbility[] = [];

    for(const choice of optionChoices)
    {
        const options = ensureArray(choice.Options?.Option);

        // If there's only one option, it's an inherent ability (not a choice)
        if(options.length === 1)
        {
            const option = options[0];
            abilities.push({
                name: choice.Name,
                description: option.Description,
            });
        }
        else if(options.length > 1)
        {
            // Multiple options means it's a choice - combine descriptions
            const optionDescriptions = options.map((opt) => `**${ opt.Name }:** ${ opt.Description }`).join('\n\n');
            abilities.push({
                name: `${ choice.Name } (Choose One)`,
                description: optionDescriptions,
            });
        }
    }

    return abilities;
}

/**
 * Convert a single species
 */
function convertSingleSpecies(species : XmlSpecies) : InternalSpecies
{
    const id = `eote-${ species.Key.toLowerCase() }`;
    const optionChoices = ensureArray(species.OptionChoices?.OptionChoice);
    const skillMods = ensureArray(species.SkillModifiers?.SkillModifier);
    const talentMods = ensureArray(species.TalentModifiers?.TalentModifier);

    return {
        id,
        name: species.Name,
        description: cleanDescription(species.Description, species.Name),
        characteristics: {
            brawn: species.StartingChars.Brawn,
            agility: species.StartingChars.Agility,
            intellect: species.StartingChars.Intellect,
            cunning: species.StartingChars.Cunning,
            willpower: species.StartingChars.Willpower,
            presence: species.StartingChars.Presence,
        },
        woundThreshold: species.StartingAttrs.WoundThreshold,
        strainThreshold: species.StartingAttrs.StrainThreshold,
        startingXP: species.StartingAttrs.Experience,
        abilities: extractAbilities(optionChoices),
        specialAbilities: '',
        skillModifiers: convertSkillModifiers(skillMods),
        talentModifiers: convertTalentModifiers(talentMods),
        reference: extractAllReferences(species.Source, species.Sources),
    };
}

/**
 * Convert all species
 */
export function convertSpecies(speciesList : XmlSpecies[]) : InternalSpecies[]
{
    return speciesList.map(convertSingleSpecies);
}

//----------------------------------------------------------------------------------------------------------------------
