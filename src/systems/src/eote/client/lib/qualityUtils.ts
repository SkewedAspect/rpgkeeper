//----------------------------------------------------------------------------------------------------------------------
// Quality Utilities
//
// Functions for computing effective qualities on weapons/armor by combining base qualities with attachment
// contributions, and rendering mod option descriptions from structured data.
//----------------------------------------------------------------------------------------------------------------------

import type {
    BaseQuality,
    BaseQualityRef,
    EoteArmorRef,
    EoteAttachment,
    EoteAttachmentRef,
    EoteModOption,
    EoteWeaponRef,
} from '../../models.ts';

//----------------------------------------------------------------------------------------------------------------------
// Types
//----------------------------------------------------------------------------------------------------------------------

export interface ComputedQuality
{
    id : string;
    baseRanks : number;
    attachmentRanks : number;
    totalRanks : number;
    sources : string[]; // Names of attachments that contribute
}

export interface ComputedWeaponStats
{
    damage : number;
    damageModifier : number; // Total modifier from attachments
    critical : number;
    criticalModifier : number; // Total modifier from attachments
    encumbrance : number;
    encumbranceModifier : number; // Total modifier from attachments
}

export interface ComputedArmorStats
{
    defense : number;
    defenseModifier : number; // Total modifier from attachments
    soak : number;
    soakModifier : number; // Total modifier from attachments
    encumbrance : number;
    encumbranceModifier : number; // Total modifier from attachments
}

//----------------------------------------------------------------------------------------------------------------------
// Internal Helpers
//----------------------------------------------------------------------------------------------------------------------

/**
 * Merge a quality into an existing map, summing ranks
 */
function mergeQuality(
    qualityMap : Map<string, { baseRanks : number; attachmentRanks : number; sources : string[] }>,
    qualityId : string,
    ranks : number,
    isBase : boolean,
    sourceName ?: string
) : void
{
    const existing = qualityMap.get(qualityId);
    if(existing)
    {
        if(isBase)
        {
            existing.baseRanks += ranks;
        }
        else
        {
            existing.attachmentRanks += ranks;
            if(sourceName && !existing.sources.includes(sourceName))
            {
                existing.sources.push(sourceName);
            }
        }
    }
    else
    {
        qualityMap.set(qualityId, {
            baseRanks: isBase ? ranks : 0,
            attachmentRanks: isBase ? 0 : ranks,
            sources: sourceName ? [ sourceName ] : [],
        });
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Description Rendering
//----------------------------------------------------------------------------------------------------------------------

/**
 * Render a mod option description from structured data.
 * Combines all structured fields (qualities, modifiers) and custom description text.
 */
export function renderModOptionDescription(
    modOption : EoteModOption,
    qualityMap : Map<string, { name : string; ranked : boolean }>
) : string
{
    const parts : string[] = [];

    // Add qualities
    if(modOption.qualities)
    {
        for(const qualityRef of modOption.qualities)
        {
            const quality = qualityMap.get(qualityRef.id);
            if(quality)
            {
                let text = quality.name;
                if(quality.ranked && qualityRef.ranks)
                {
                    text += ` ${ qualityRef.ranks }`;
                }
                else if(quality.ranked)
                {
                    text += ' 1';
                }
                parts.push(text);
            }
        }
    }

    // Add damage modifier
    if(modOption.damageModifier !== undefined)
    {
        const sign = modOption.damageModifier > 0 ? '+' : '';
        parts.push(`${ sign }${ modOption.damageModifier } Damage`);
    }

    // Add critical modifier
    if(modOption.criticalModifier !== undefined)
    {
        const sign = modOption.criticalModifier > 0 ? '+' : '';
        parts.push(`${ sign }${ modOption.criticalModifier } Critical`);
    }

    // Add encumbrance modifier
    if(modOption.encumbranceModifier !== undefined)
    {
        const sign = modOption.encumbranceModifier > 0 ? '+' : '';
        parts.push(`${ sign }${ modOption.encumbranceModifier } Encumbrance`);
    }

    // Add defense modifier
    if(modOption.defenseModifier !== undefined)
    {
        const sign = modOption.defenseModifier > 0 ? '+' : '';
        parts.push(`${ sign }${ modOption.defenseModifier } Defense`);
    }

    // Add soak modifier
    if(modOption.soakModifier !== undefined)
    {
        const sign = modOption.soakModifier > 0 ? '+' : '';
        parts.push(`${ sign }${ modOption.soakModifier } Soak`);
    }

    // Add custom description text at the end
    if(modOption.description)
    {
        parts.push(modOption.description);
    }

    return parts.length > 0 ? parts.join(', ') : '';
}

/**
 * Get a human-readable description for a mod option or base modifier.
 * Accepts either quality supplements or a pre-built quality map.
 */
export function getModDescription(
    modOption : EoteModOption,
    qualities : BaseQuality[] | Map<string, { name : string; ranked : boolean }>
) : string
{
    // Convert qualities array to map if needed
    let qualityMap : Map<string, { name : string; ranked : boolean }>;
    if(Array.isArray(qualities))
    {
        qualityMap = new Map();
        for(const quality of qualities)
        {
            if(quality.id)
            {
                qualityMap.set(quality.id, { name: quality.name, ranked: quality.ranked });
            }
        }
    }
    else
    {
        qualityMap = qualities;
    }

    return renderModOptionDescription(modOption, qualityMap);
}

//----------------------------------------------------------------------------------------------------------------------
// Public API
//----------------------------------------------------------------------------------------------------------------------

/**
 * Compute the total attachment-contributed qualities for a given set of attachment refs.
 * Returns a map from quality ID to total ranks from attachments.
 */
export function computeAttachmentQualities(
    attachmentRefs : EoteAttachmentRef[],
    allAttachments : EoteAttachment[]
) : Map<string, number>
{
    const result = new Map<string, number>();

    for(const ref of attachmentRefs)
    {
        const attachment = allAttachments.find((att) => att.id === ref.id);
        if(attachment)
        {
            // Add qualities from base modifier
            for(const quality of attachment.baseModifier?.qualities ?? [])
            {
                result.set(quality.id, (result.get(quality.id) ?? 0) + (quality.ranks ?? 1));
            }

            // Add qualities from activated mods
            for(const modIndex of ref.activatedMods ?? [])
            {
                for(const quality of attachment.modOptions[modIndex]?.qualities ?? [])
                {
                    result.set(quality.id, (result.get(quality.id) ?? 0) + (quality.ranks ?? 1));
                }
            }
        }
    }

    return result;
}

/**
 * Compute which attachments contribute to each quality.
 * Returns a map from quality ID to array of attachment names that contribute that quality.
 */
export function computeAttachmentSources(
    attachmentRefs : EoteAttachmentRef[],
    allAttachments : EoteAttachment[]
) : Map<string, string[]>
{
    const sources = new Map<string, string[]>();

    function addSource(qualityId : string, attachmentName : string) : void
    {
        const existing = sources.get(qualityId) ?? [];
        if(!existing.includes(attachmentName))
        {
            sources.set(qualityId, [ ...existing, attachmentName ]);
        }
    }

    for(const ref of attachmentRefs)
    {
        const attachment = allAttachments.find((att) => att.id === ref.id);
        if(attachment)
        {
            // Add qualities from base modifier
            for(const quality of attachment.baseModifier?.qualities ?? [])
            {
                addSource(quality.id, attachment.name);
            }

            // Add qualities from activated mods
            for(const modIndex of ref.activatedMods ?? [])
            {
                for(const quality of attachment.modOptions[modIndex]?.qualities ?? [])
                {
                    addSource(quality.id, attachment.name);
                }
            }
        }
    }

    return sources;
}

/**
 * Interface for items that have qualities and attachments (weapons, armor).
 */
interface ItemWithQualities
{
    qualities : BaseQualityRef[];
    attachments : EoteAttachmentRef[];
}

/**
 * Compute the full list of qualities for an item (weapon or armor),
 * combining base qualities with attachment contributions.
 */
function computeItemQualities(
    item : ItemWithQualities,
    allAttachments : EoteAttachment[]
) : ComputedQuality[]
{
    const qualityMap = new Map<string, { baseRanks : number; attachmentRanks : number; sources : string[] }>();

    // Add base item qualities
    for(const quality of item.qualities)
    {
        mergeQuality(qualityMap, quality.id, quality.ranks ?? 1, true);
    }

    // Add attachment contributions
    for(const ref of item.attachments)
    {
        const attachment = allAttachments.find((att) => att.id === ref.id);
        if(attachment)
        {
            // Add base qualities from the attachment base modifier
            for(const quality of attachment.baseModifier?.qualities ?? [])
            {
                mergeQuality(qualityMap, quality.id, quality.ranks ?? 1, false, attachment.name);
            }

            // Add qualities from activated mods
            for(const modIndex of ref.activatedMods ?? [])
            {
                for(const quality of attachment.modOptions[modIndex]?.qualities ?? [])
                {
                    mergeQuality(qualityMap, quality.id, quality.ranks ?? 1, false, attachment.name);
                }
            }
        }
    }

    // Convert map to array
    return Array.from(qualityMap.entries()).map(([ id, data ]) => ({
        id,
        baseRanks: data.baseRanks,
        attachmentRanks: data.attachmentRanks,
        totalRanks: data.baseRanks + data.attachmentRanks,
        sources: data.sources,
    }));
}

/**
 * Compute the full list of qualities for a weapon, combining base qualities with attachment contributions.
 */
export function computeWeaponQualities(
    weapon : EoteWeaponRef,
    allAttachments : EoteAttachment[]
) : ComputedQuality[]
{
    return computeItemQualities(weapon, allAttachments);
}

/**
 * Compute the full list of qualities for armor, combining base qualities with attachment contributions.
 */
export function computeArmorQualities(
    armor : EoteArmorRef,
    allAttachments : EoteAttachment[]
) : ComputedQuality[]
{
    return computeItemQualities(armor, allAttachments);
}

/**
 * Convert a Map<string, number> of attachment qualities to an array of BaseQualityRef for display
 */
export function attachmentQualitiesToRefs(attachmentQualities : Map<string, number>) : BaseQualityRef[]
{
    return Array.from(attachmentQualities.entries()).map(([ id, ranks ]) => ({
        id,
        ranks: ranks > 0 ? ranks : undefined,
    }));
}

/**
 * Accumulate numeric modifiers from a mod option into an accumulator object.
 */
function accumulateModifiers(
    modOption : EoteModOption,
    acc : Record<string, number>,
    keys : (keyof EoteModOption)[]
) : void
{
    for(const key of keys)
    {
        const value = modOption[key];
        if(typeof value === 'number')
        {
            acc[key] = (acc[key] ?? 0) + value;
        }
    }
}

/**
 * Collect all numeric modifiers from attachments for given modifier keys.
 */
function collectAttachmentModifiers(
    attachmentRefs : EoteAttachmentRef[],
    allAttachments : EoteAttachment[],
    keys : (keyof EoteModOption)[]
) : Record<string, number>
{
    const result : Record<string, number> = {};

    for(const ref of attachmentRefs)
    {
        const attachment = allAttachments.find((att) => att.id === ref.id);
        if(attachment)
        {
            // Add base modifiers
            if(attachment.baseModifier)
            {
                accumulateModifiers(attachment.baseModifier, result, keys);
            }

            // Add modifiers from activated mods
            for(const modIndex of ref.activatedMods ?? [])
            {
                const modOption = attachment.modOptions[modIndex];
                if(modOption)
                {
                    accumulateModifiers(modOption, result, keys);
                }
            }
        }
    }

    return result;
}

/**
 * Compute weapon stats including attachment modifiers
 */
export function computeWeaponStats(
    weapon : EoteWeaponRef,
    allAttachments : EoteAttachment[]
) : ComputedWeaponStats
{
    const modifiers = collectAttachmentModifiers(
        weapon.attachments,
        allAttachments,
        [ 'damageModifier', 'criticalModifier', 'encumbranceModifier' ]
    );

    return {
        damage: weapon.damage,
        damageModifier: modifiers.damageModifier ?? 0,
        critical: weapon.criticalRating,
        criticalModifier: modifiers.criticalModifier ?? 0,
        encumbrance: weapon.encumbrance,
        encumbranceModifier: modifiers.encumbranceModifier ?? 0,
    };
}

/**
 * Compute armor stats including attachment modifiers
 */
export function computeArmorStats(
    armor : EoteArmorRef,
    allAttachments : EoteAttachment[]
) : ComputedArmorStats
{
    const modifiers = collectAttachmentModifiers(
        armor.attachments,
        allAttachments,
        [ 'defenseModifier', 'soakModifier', 'encumbranceModifier' ]
    );

    return {
        defense: armor.defense,
        defenseModifier: modifiers.defenseModifier ?? 0,
        soak: armor.soak,
        soakModifier: modifiers.soakModifier ?? 0,
        encumbrance: armor.encumbrance,
        encumbranceModifier: modifiers.encumbranceModifier ?? 0,
    };
}

//----------------------------------------------------------------------------------------------------------------------
