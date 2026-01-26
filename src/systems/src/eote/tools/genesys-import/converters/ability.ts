//----------------------------------------------------------------------------------------------------------------------
// Ability Converter
//----------------------------------------------------------------------------------------------------------------------

import type { ExternalAbility } from '../types.ts';
import { ensureArray, formatReference, generateId } from '../utils.ts';
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
export function convertAbilities(abilities : ExternalAbility[] | undefined, bookFile : string) : InternalAbility[]
{
    return ensureArray(abilities).map((ability) => convertAbility(ability, bookFile));
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
    return [
        ...convertAbilities(adversaryAbilities, bookFile),
        ...convertAbilities(archetypeAbilities, bookFile),
    ];
}

//----------------------------------------------------------------------------------------------------------------------
