//----------------------------------------------------------------------------------------------------------------------

/* eslint-disable id-length, sort-imports */
// Ability Converter
//----------------------------------------------------------------------------------------------------------------------

import type { ExternalAbility } from '../types.ts';
import { generateId, formatReference } from '../utils.ts';
import { convertVaryingDisplay } from './description.ts';

//----------------------------------------------------------------------------------------------------------------------
// Internal Ability Type
//----------------------------------------------------------------------------------------------------------------------

export interface InternalAbility
{
    id : string;
    name : string;
    description : string;
    reference : string;
}

//----------------------------------------------------------------------------------------------------------------------
// Conversion
//----------------------------------------------------------------------------------------------------------------------

/**
 * Convert an external ability to internal format
 */
export function convertAbility(external : ExternalAbility, bookFile : string, page ?: number) : InternalAbility
{
    return {
        id: generateId('ability', external.name),
        name: external.name,
        description: convertVaryingDisplay(external.description),
        reference: formatReference(bookFile, page),
    };
}

/**
 * Convert multiple abilities from a book
 */
export function convertAbilities(
    abilities : ExternalAbility[] | undefined,
    bookFile : string
) : InternalAbility[]
{
    if(!abilities || !Array.isArray(abilities))
    {
        return [];
    }

    return abilities.map((a) => convertAbility(a, bookFile));
}

/**
 * Convert both adversary and archetype abilities from a book
 */
export function convertAllAbilities(
    adversaryAbilities : ExternalAbility[] | undefined,
    archetypeAbilities : ExternalAbility[] | undefined,
    bookFile : string
) : InternalAbility[]
{
    const converted : InternalAbility[] = [];

    if(adversaryAbilities && Array.isArray(adversaryAbilities))
    {
        converted.push(...convertAbilities(adversaryAbilities, bookFile));
    }

    if(archetypeAbilities && Array.isArray(archetypeAbilities))
    {
        converted.push(...convertAbilities(archetypeAbilities, bookFile));
    }

    return converted;
}

//----------------------------------------------------------------------------------------------------------------------
