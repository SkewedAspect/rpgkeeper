//----------------------------------------------------------------------------------------------------------------------
// External Schema TypeScript Types
//
// These types represent the structure of data from the SilentArctic Genesys repository.
// https://github.com/SilentArctic/silentarctic.github.io
//----------------------------------------------------------------------------------------------------------------------

//----------------------------------------------------------------------------------------------------------------------
// VaryingDisplay Types (Description Format)
//----------------------------------------------------------------------------------------------------------------------

/**
 * Plain text content
 */
export type VaryingDisplayString = string;

/**
 * Advanced text content with optional formatting
 */
export interface VaryingDisplayAdvancedText
{
    type : 'text' | 'sidebar' | 'example' | 'read-aloud' | 'codeblock';
    title ?: string;
    content : VaryingDisplayItem[];
    page ?: number;
}

/**
 * Notice container with color variants
 */
export interface VaryingDisplayNotice
{
    type : 'notice';
    variant : 'info' | 'success' | 'warn' | 'error';
    content : VaryingDisplayItem[];
}

/**
 * Quote with optional attribution
 */
export interface VaryingDisplayQuote
{
    type : 'quote';
    content : string;
    by ?: string;
}

/**
 * List of items
 */
export interface VaryingDisplayList
{
    type : 'list';
    variant ?: 'bulleted' | 'non-bulleted';
    title ?: string;
    items : VaryingDisplayItem[];
}

/**
 * Table structure
 */
export interface VaryingDisplayTable
{
    type : 'table';
    title ?: string;
    columns : { header : string; value : string }[];
    rows : Record<string, string | number>[];
    footer ?: string;
}

/**
 * A single item in varyingDisplay array
 */
export type VaryingDisplayItem
    = VaryingDisplayString
    | VaryingDisplayAdvancedText
    | VaryingDisplayNotice
    | VaryingDisplayQuote
    | VaryingDisplayList
    | VaryingDisplayTable;

/**
 * VaryingDisplay is an array of content items
 */
export type VaryingDisplay = VaryingDisplayItem[];

//----------------------------------------------------------------------------------------------------------------------
// Common Types
//----------------------------------------------------------------------------------------------------------------------

/**
 * Settings reference for which game settings an item applies to
 */
export interface SettingReference
{
    name : string;
    source ?: string;
}

/**
 * Skill reference for weapons
 */
export interface SkillReference
{
    name : string;
    source ?: string;
}

/**
 * Quality reference with optional ranks
 */
export interface QualityReference
{
    name : string;
    ranks ?: number;
    value ?: number;
    source ?: string;
}

//----------------------------------------------------------------------------------------------------------------------
// Talent Types
//----------------------------------------------------------------------------------------------------------------------

/**
 * External talent activation types
 */
export type ExternalActivation
    = 'passive'
    | 'active (incidental)'
    | 'active (incidental, out of turn)'
    | 'active (maneuver)'
    | 'active (action)';

/**
 * Talent from external source
 */
export interface ExternalTalent
{
    name : string;
    tier : 1 | 2 | 3 | 4 | 5;
    activation : ExternalActivation;
    ranked : boolean;
    description : VaryingDisplay;
    page ?: number;
    imageUrl ?: string;
    prerequisites ?: boolean | string[];
    tags ?: string[];
    settings ?: SettingReference[];
    id ?: string;
}

//----------------------------------------------------------------------------------------------------------------------
// Quality Types
//----------------------------------------------------------------------------------------------------------------------

/**
 * External quality activation types
 */
export type ExternalQualityActivation = 'active' | 'passive';

/**
 * External quality gear types
 */
export type ExternalGearType = 'any' | 'armor' | 'weapon' | 'vehicle';

/**
 * Quality from external source
 */
export interface ExternalQuality
{
    name : string;
    activation : ExternalQualityActivation;
    gearType : ExternalGearType;
    description : VaryingDisplay;
    page ?: number;
    id ?: string;
}

//----------------------------------------------------------------------------------------------------------------------
// Gear Types (Weapon, Attachment, etc.)
//----------------------------------------------------------------------------------------------------------------------

/**
 * External gear types
 */
export type ExternalGearItemType
    = 'weapon'
    | 'armor'
    | 'attachment'
    | 'gear'
    | 'implement'
    | 'treasure'
    | 'alchemy'
    | 'artifact'
    | 'magic'
    | 'mount'
    | 'cybernetic'
    | 'g-mod';

/**
 * External weapon range types
 */
export type ExternalRange = 'Engaged' | 'Short' | 'Medium' | 'Long' | 'Extreme' | 'Strategic';

/**
 * Base gear item interface
 */
export interface ExternalGearBase
{
    name : string;
    type : ExternalGearItemType;
    description : VaryingDisplay;
    price : number | 'priceless' | null;
    rarity : number | null;
    imageUrl ?: string;
    page ?: number;
    class ?: string;
    modifiers ?: string;
    settings ?: SettingReference[];
    id ?: string;
}

/**
 * Weapon from external source
 */
export interface ExternalWeapon extends ExternalGearBase
{
    type : 'weapon';
    skill : SkillReference;
    damage : string | number;
    critical : number;
    range : ExternalRange;
    encumbrance : number;
    hardPoints ?: number;
    special ?: QualityReference[];
    restricted ?: boolean;
}

/**
 * Attachment from external source
 */
export interface ExternalAttachment extends ExternalGearBase
{
    type : 'attachment';
    hardPoints : number;
    qualities ?: QualityReference[];
}

/**
 * Armor from external source
 */
export interface ExternalArmor extends ExternalGearBase
{
    type : 'armor';
    defense : number | string;
    soak : number | string;
    encumbrance : number;
    hardPoints ?: number;
    special ?: QualityReference[];
    restricted ?: boolean;
}

/**
 * Union type for all gear
 */
export type ExternalGear = ExternalWeapon | ExternalAttachment | ExternalArmor | ExternalGearBase;

//----------------------------------------------------------------------------------------------------------------------
// Ability Types
//----------------------------------------------------------------------------------------------------------------------

/**
 * Ability from external source (adversaryAbility or archetypeAbility)
 */
export interface ExternalAbility
{
    name : string;
    description : VaryingDisplay;
    tags ?: string[];
    id ?: string;
}

//----------------------------------------------------------------------------------------------------------------------
// Book Structure Types
//----------------------------------------------------------------------------------------------------------------------

/**
 * Index entry for a book
 */
export interface BookIndexEntry
{
    version : string;
    json : string;
    full : string;
    abbreviation : string;
    color : string;
    authors : string[];
    convertedBy : string[];
    url : string;
    releaseDate : string;
    originType : 'core' | 'supplement';
    module ?: boolean;
}

/**
 * Full book data structure
 */
export interface ExternalBook
{
    talent ?: ExternalTalent[];
    quality ?: ExternalQuality[];
    gear ?: ExternalGear[];
    adversaryAbility ?: ExternalAbility[];
    archetypeAbility ?: ExternalAbility[];

    // Types we skip
    adversary ?: unknown[];
    archetype ?: unknown[];
    career ?: unknown[];
    skill ?: unknown[];
    spell ?: unknown[];
    vehicle ?: unknown[];
    adventure ?: unknown[];
    rule ?: unknown[];
    setting ?: unknown[];
}

//----------------------------------------------------------------------------------------------------------------------
