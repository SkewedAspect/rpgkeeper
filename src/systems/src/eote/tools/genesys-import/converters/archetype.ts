//----------------------------------------------------------------------------------------------------------------------
// Archetype Converter
//----------------------------------------------------------------------------------------------------------------------

import type { ExternalArchetype } from '../types.ts';
import { convertVaryingDisplay } from './description.ts';
import { formatReference, slugify } from '../utils.ts';

//----------------------------------------------------------------------------------------------------------------------

export interface InternalArchetypeAbility
{
    name : string;
    description : string;
}

export interface InternalArchetypeSkillModifier
{
    skill : string;
    startingRanks : number;
    rankLimit ?: number;
}

export interface InternalArchetype
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
    abilities : InternalArchetypeAbility[];
    skillModifiers : InternalArchetypeSkillModifier[];
    reference : string;
}

//----------------------------------------------------------------------------------------------------------------------

/**
 * Convert archetype abilities from external format
 */
function convertAbilities(abilities : string[] | undefined) : InternalArchetypeAbility[]
{
    if(!abilities || abilities.length === 0)
    {
        return [];
    }

    // Abilities are just names in the external format; descriptions come from archetypeAbility
    return abilities.map((name) => ({
        name,
        description: '', // Would need to look up from archetypeAbility data
    }));
}

/**
 * Convert a single archetype
 */
function convertSingleArchetype(archetype : ExternalArchetype, bookFile : string) : InternalArchetype
{
    const id = `genesys-archetype-${ slugify(archetype.name) }`;

    return {
        id,
        name: archetype.name,
        description: convertVaryingDisplay(archetype.description),
        characteristics: {
            brawn: archetype.characteristics.brawn,
            agility: archetype.characteristics.agility,
            intellect: archetype.characteristics.intellect,
            cunning: archetype.characteristics.cunning,
            willpower: archetype.characteristics.willpower,
            presence: archetype.characteristics.presence,
        },
        woundThreshold: archetype.wt,
        strainThreshold: archetype.st,
        startingXP: archetype.xp,
        abilities: convertAbilities(archetype.abilities),
        skillModifiers: [], // Skills are handled differently in Genesys
        reference: formatReference(bookFile, archetype.page),
    };
}

/**
 * Convert all archetypes from a book
 */
export function convertArchetypes(
    archetypes : ExternalArchetype[] | undefined,
    bookFile : string
) : InternalArchetype[]
{
    if(!archetypes)
    {
        return [];
    }

    return archetypes.map((archetype) => convertSingleArchetype(archetype, bookFile));
}

//----------------------------------------------------------------------------------------------------------------------
