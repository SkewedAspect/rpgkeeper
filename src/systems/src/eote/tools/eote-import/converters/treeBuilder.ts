//----------------------------------------------------------------------------------------------------------------------
// Talent Tree Builder
//
// Builds talent tree and source information from Specialization XML data
//----------------------------------------------------------------------------------------------------------------------

/* eslint-disable id-length */

import type { XmlSpecialization } from '../types.ts';
import {
    ensureArray,
    extractPageNumber,
    extractSourceName,
    formatReference,
} from '../utils.ts';
import type { InternalTalent } from './talent.ts';

//----------------------------------------------------------------------------------------------------------------------
// Types
//----------------------------------------------------------------------------------------------------------------------

/**
 * Source info from a specialization
 */
interface SpecSourceInfo
{
    name : string;
    reference : string;
}

/**
 * Information about a talent's position in talent trees
 */
export interface TalentTreeInfo
{
    /** Array of specialization names where this talent appears */
    trees : string[];
    /** Source references from specializations (for talents without their own source) */
    sources : SpecSourceInfo[];
}

/**
 * Map of talent key to tree info
 */
export type TalentTreeMap = Map<string, TalentTreeInfo>;

//----------------------------------------------------------------------------------------------------------------------
// Tree Building
//----------------------------------------------------------------------------------------------------------------------

/**
 * Extract source info from a specialization
 */
function getSpecSourceInfo(spec : XmlSpecialization) : SpecSourceInfo | null
{
    // Try single Source field first
    const source = spec.Source ?? spec.Sources?.Source;
    if(!source)
    {
        return null;
    }

    const sourceName = extractSourceName(source);
    if(!sourceName)
    {
        return null;
    }

    const page = extractPageNumber(source);
    return {
        name: spec.Name,
        reference: formatReference(sourceName, page),
    };
}

/**
 * Build a map of talent keys to their tree information
 * Analyzes all specializations to find where each talent appears
 */
export function buildTalentTreeMap(specializations : XmlSpecialization[]) : TalentTreeMap
{
    const treeMap : TalentTreeMap = new Map();

    for(const spec of specializations)
    {
        if(spec.TalentRows?.TalentRow)
        {
            const specSource = getSpecSourceInfo(spec);
            const rows = ensureArray(spec.TalentRows.TalentRow);

            for(const row of rows)
            {
                if(row.Talents?.Key)
                {
                    const talentKeys = ensureArray(row.Talents.Key);

                    for(const key of talentKeys)
                    {
                        const existing = treeMap.get(key);

                        if(existing)
                        {
                            // Add tree if not already present
                            if(!existing.trees.includes(spec.Name))
                            {
                                existing.trees.push(spec.Name);
                            }

                            // Add source if we have one and it's not already tracked
                            if(specSource && !existing.sources.some((s) => s.reference === specSource.reference))
                            {
                                existing.sources.push(specSource);
                            }
                        }
                        else
                        {
                            treeMap.set(key, {
                                trees: [ spec.Name ],
                                sources: specSource ? [ specSource ] : [],
                            });
                        }
                    }
                }
            }
        }
    }

    return treeMap;
}

/**
 * Core book priority for sorting references
 */
const CORE_BOOK_PRIORITY : Record<string, number> = {
    'E-CRB': 0,
    'A-CRB': 1,
    'F-CRB': 2,
};

/**
 * Sort references by core book priority
 */
function sortReferences(refs : string[]) : string[]
{
    return [ ...refs ].sort((a, b) =>
    {
        const aPrefix = a.split(':')[0];
        const bPrefix = b.split(':')[0];

        const aPriority = CORE_BOOK_PRIORITY[aPrefix] ?? 99;
        const bPriority = CORE_BOOK_PRIORITY[bPrefix] ?? 99;

        return aPriority - bPriority;
    });
}

/**
 * Enrich converted talents with tree information
 * Updates trees field and merges references from specializations
 */
export function enrichTalentsWithTreeInfo(
    talents : InternalTalent[],
    treeMap : TalentTreeMap,
    talentKeyMap : Map<string, string>
) : void
{
    for(const talent of talents)
    {
        // Find the original XML key for this talent
        const key = talentKeyMap.get(talent.id);

        if(key)
        {
            const treeInfo = treeMap.get(key);

            if(treeInfo)
            {
                talent.trees = treeInfo.trees.join(', ');

                // If talent has no direct source, use sources from specializations
                if(talent.reference.length === 0 && treeInfo.sources.length > 0)
                {
                    // Collect unique references from specializations
                    const specRefs = new Set<string>();
                    for(const src of treeInfo.sources)
                    {
                        specRefs.add(src.reference);
                    }

                    talent.reference = sortReferences(Array.from(specRefs));
                }
                else if(talent.reference.length > 0)
                {
                    // Sort existing references by core book priority
                    talent.reference = sortReferences(talent.reference);
                }
            }
        }
    }
}

/**
 * Simple slugify for talent names (matches utils.ts slugify)
 */
function slugifyName(name : string) : string
{
    return name
        .toLowerCase()
        .trim()
        .replace(/['']/g, '')
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

/**
 * Build a map of talent ID to XML key for lookup
 */
export function buildTalentKeyMap(xmlTalents : { Key : string; Name : string }[]) : Map<string, string>
{
    const keyMap = new Map<string, string>();

    for(const talent of xmlTalents)
    {
        // Generate the same ID that convertTalent produces
        const id = `eote-talent-${ slugifyName(talent.Name) }`;
        keyMap.set(id, talent.Key);
    }

    return keyMap;
}

//----------------------------------------------------------------------------------------------------------------------
