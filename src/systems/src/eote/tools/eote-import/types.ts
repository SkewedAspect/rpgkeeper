//----------------------------------------------------------------------------------------------------------------------
// External XML Schema TypeScript Types
//
// These types represent the structure of data from the OggDudes-Custom-Dataset-SW repository.
// https://github.com/Septaris/OggDudes-Custom-Dataset-SW
//----------------------------------------------------------------------------------------------------------------------

//----------------------------------------------------------------------------------------------------------------------
// Common Types
//----------------------------------------------------------------------------------------------------------------------

/**
 * Source reference in XML
 * Page is an attribute: <Source Page="132">Book Name</Source>
 */
export interface XmlSource
{
    '@_Page' ?: string;
    '#text' ?: string;
}

/**
 * Quality reference in XML
 */
export interface XmlQuality
{
    Key : string;
    Count ?: number;
}

/**
 * Category in XML
 */
export interface XmlCategory
{
    Category : string | string[];
}

/**
 * Mod in XML (for base mods and added mods)
 */
export interface XmlMod
{
    Key ?: string;
    Count ?: number;
    MiscDesc ?: string;
    DieModifiers ?: unknown;
}

/**
 * Base mods container
 */
export interface XmlBaseMods
{
    Mod : XmlMod | XmlMod[];
}

/**
 * Added mods container
 */
export interface XmlAddedMods
{
    Mod : XmlMod | XmlMod[];
}

//----------------------------------------------------------------------------------------------------------------------
// Armor Types
//----------------------------------------------------------------------------------------------------------------------

/**
 * Weapon modifier for armor with built-in weapons
 */
export interface XmlWeaponModifier
{
    UnarmedName : string;
    SkillKey : string;
    Damage : number;
    Crit : number;
    Qualities ?: {
        Quality : XmlQuality | XmlQuality[];
    };
}

/**
 * Armor from XML
 */
export interface XmlArmor
{
    Key : string;
    Name : string;
    Description : string;
    Source ?: string | XmlSource;
    Sources ?: { Source : XmlSource | XmlSource[] };
    Custom ?: string;
    Categories ?: XmlCategory;
    Encumbrance ?: number;
    HP ?: number;
    Price ?: number;
    Rarity ?: number;
    Restricted ?: boolean | string;
    BaseMods ?: XmlBaseMods;
    WeaponModifiers ?: {
        WeaponModifier : XmlWeaponModifier | XmlWeaponModifier[];
    };
    Defense ?: number;
    Soak : number;
}

//----------------------------------------------------------------------------------------------------------------------
// Weapon Types
//----------------------------------------------------------------------------------------------------------------------

/**
 * Weapon from XML
 */
export interface XmlWeapon
{
    Key : string;
    Name : string;
    Description : string;
    Type : string;
    Source ?: string | XmlSource;
    Sources ?: { Source : XmlSource | XmlSource[] };
    Categories ?: XmlCategory;
    Encumbrance ?: number;
    HP ?: number;
    Price ?: number;
    Rarity ?: number;
    Restricted ?: boolean | string;
    SkillKey : string;
    Damage ?: number;
    DamageAdd ?: number;
    Crit : number;
    RangeValue : string;
    Range : string;
    Qualities ?: {
        Quality : XmlQuality | XmlQuality[];
    };
    BaseMods ?: XmlBaseMods;
}

//----------------------------------------------------------------------------------------------------------------------
// Talent Types
//----------------------------------------------------------------------------------------------------------------------

/**
 * Talent attributes in XML
 */
export interface XmlTalentAttributes
{
    SoakValue ?: number;
    WoundThreshold ?: number;
    StrainThreshold ?: number;
    DefenseMelee ?: number;
    DefenseRanged ?: number;
    ForceRating ?: number;
}

/**
 * Talent from XML
 */
export interface XmlTalent
{
    Key : string;
    Name : string;
    Description : string;
    Source ?: string | XmlSource;
    Sources ?: { Source : XmlSource | XmlSource[] };
    Ranked ?: boolean | string;
    ActivationValue : string;
    Activation : string;
    ForceTalent ?: boolean | string;
    Attributes ?: XmlTalentAttributes;
    SkillChoice ?: {
        TypeValue : string;
        Type : string;
        SkillCount ?: number;
    };
}

//----------------------------------------------------------------------------------------------------------------------
// Item Attachment Types
//----------------------------------------------------------------------------------------------------------------------

/**
 * Item attachment from XML
 */
export interface XmlItemAttachment
{
    Key : string;
    Name : string;
    Description ?: string;
    Type ?: string;
    Source ?: string | XmlSource;
    Sources ?: { Source : XmlSource | XmlSource[] };
    Price ?: number;
    Rarity ?: number;
    HP ?: number;
    BaseMods ?: XmlBaseMods;
    AddedMods ?: XmlAddedMods;
    CategoryLimit ?: XmlCategory;
    TypeLimit ?: { Type : string | string[] };
    ItemLimit ?: { Item : string | string[] };
}

//----------------------------------------------------------------------------------------------------------------------
// Skill Types
//----------------------------------------------------------------------------------------------------------------------

/**
 * Skill from XML
 */
export interface XmlSkill
{
    Key : string;
    Name : string;
    Description : string;
    TypeValue : string;
    Type : string;
    CharKey : string;
}

//----------------------------------------------------------------------------------------------------------------------
// Quality Types (Item Descriptors)
//----------------------------------------------------------------------------------------------------------------------

/**
 * Item descriptor (quality) from XML
 */
export interface XmlItemDescriptor
{
    Key : string;
    Name : string;
    Description : string;
    Source ?: string | XmlSource;
    Sources ?: { Source : XmlSource | XmlSource[] };
    ModDesc ?: string;
    QualityType ?: string;
    /** Only present and true for actual weapon/armor qualities, absent for mods */
    IsQuality ?: boolean;
    /** Only present on active qualities that require advantage/triumph to activate */
    IsActiveQuality ?: boolean;
}

//----------------------------------------------------------------------------------------------------------------------
// Root Document Types
//----------------------------------------------------------------------------------------------------------------------

/**
 * Armors XML document
 */
export interface ArmorsDocument
{
    Armors : {
        Armor : XmlArmor[];
    };
}

/**
 * Weapons XML document
 */
export interface WeaponsDocument
{
    Weapons : {
        Weapon : XmlWeapon[];
    };
}

/**
 * Talents XML document
 */
export interface TalentsDocument
{
    Talents : {
        Talent : XmlTalent[];
    };
}

/**
 * Item Attachments XML document
 */
export interface ItemAttachmentsDocument
{
    ItemAttachments : {
        ItemAttachment : XmlItemAttachment[];
    };
}

/**
 * Skills XML document
 */
export interface SkillsDocument
{
    Skills : {
        Skill : XmlSkill[];
    };
}

/**
 * Item Descriptors (Qualities) XML document
 */
export interface ItemDescriptorsDocument
{
    ItemDescriptors : {
        ItemDescriptor : XmlItemDescriptor[];
    };
}

//----------------------------------------------------------------------------------------------------------------------
// Specialization Types (Talent Trees)
//----------------------------------------------------------------------------------------------------------------------

/**
 * Talent row in a specialization tree
 */
export interface XmlTalentRow
{
    Index ?: number;
    Cost : number;
    Talents : {
        Key : string | string[];
    };
}

/**
 * Specialization (talent tree) from XML
 */
export interface XmlSpecialization
{
    Key : string;
    Name : string;
    Description ?: string;
    Source ?: string | XmlSource;
    Sources ?: { Source : XmlSource | XmlSource[] };
    CareerSkills ?: {
        Key : string | string[];
    };
    TalentRows : {
        TalentRow : XmlTalentRow | XmlTalentRow[];
    };
}

/**
 * Specialization XML document
 */
export interface SpecializationDocument
{
    Specialization : XmlSpecialization;
}

//----------------------------------------------------------------------------------------------------------------------
