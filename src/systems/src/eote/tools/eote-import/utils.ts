//----------------------------------------------------------------------------------------------------------------------
// Utility Functions for EotE Import
//----------------------------------------------------------------------------------------------------------------------

import type { XmlSource } from './types.ts';

//----------------------------------------------------------------------------------------------------------------------
// Array Helpers
//----------------------------------------------------------------------------------------------------------------------

/**
 * Ensure a value is an array (XML parser sometimes returns single item instead of array)
 */
export function ensureArray<T>(value : T | T[] | undefined) : T[]
{
    if(value === undefined || value === null)
    {
        return [];
    }

    if(Array.isArray(value))
    {
        return value;
    }

    return [ value ];
}

//----------------------------------------------------------------------------------------------------------------------
// Slug Generation
//----------------------------------------------------------------------------------------------------------------------

/**
 * Convert a name to a URL-safe slug
 */
export function slugify(name : string | undefined | null) : string
{
    // Handle non-string inputs
    if(!name || typeof name !== 'string')
    {
        return 'unknown';
    }

    return name
        .toLowerCase()
        .trim()
        .replace(/['']/g, '') // Remove apostrophes
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/[\s_]+/g, '-') // Replace spaces/underscores with hyphens
        .replace(/-+/g, '-') // Collapse multiple hyphens
        .replace(/^-|-$/g, ''); // Trim leading/trailing hyphens
}

/**
 * Generate an ID for a supplement item
 */
export function generateId(type : string, name : string) : string
{
    return `eote-${ type }-${ slugify(name) }`;
}

//----------------------------------------------------------------------------------------------------------------------
// Source Book Abbreviation Mapping
//----------------------------------------------------------------------------------------------------------------------

/**
 * Map source book names to internal abbreviations
 * These are the common EotE/AoR/FaD sourcebooks
 * Format matches existing data: E-CRB, A-CRB, F-CRB for core books
 */
export const SOURCE_ABBREVIATIONS : Record<string, string> = {
    // Core Rulebooks
    'Edge of the Empire Core Rulebook': 'E-CRB',
    'Age of Rebellion Core Rulebook': 'A-CRB',
    'Force and Destiny Core Rulebook': 'F-CRB',

    // Edge of the Empire supplements
    'Enter the Unknown': 'EtU',
    'Dangerous Covenants': 'DC',
    'Far Horizons': 'FH',
    'Fly Casual': 'FC',
    'Lords of Nal Hutta': 'LoNH',
    'Special Modifications': 'SM',
    'No Disintegrations': 'ND',
    'Suns of Fortune': 'SoF',
    'Jewel of Yavin': 'JoY',

    // Age of Rebellion supplements
    'Stay on Target': 'SoT',
    'Desperate Allies': 'DA',
    'Forged in Battle': 'FiB',
    'Lead by Example': 'LbE',
    'Fully Operational': 'FO',
    'Cyphers and Masks': 'CaM',
    'Onslaught at Arda I': 'OaA',
    'Friends Like These': 'FLT',
    'Strongholds of Resistance': 'SoR',

    // Force and Destiny supplements
    'Keeping the Peace': 'KtP',
    'Savage Spirits': 'SS',
    'Endless Vigil': 'EV',
    'Disciples of Harmony': 'DoH',
    'Unlimited Power': 'UP',
    'Knights of Fate': 'KoF',
    'Chronicles of the Gatekeeper': 'CotG',
    'Ghosts of Dathomir': 'GoD',
    'Nexus of Power': 'NoP',

    // Beginner Games
    'Edge of the Empire Beginner Game': 'E-BG',
    'Age of Rebellion Beginner Game': 'A-BG',
    'Force and Destiny Beginner Game': 'F-BG',

    // Era sourcebooks
    'Rise of the Separatists': 'RotS',
    'Collapse of the Republic': 'CotR',

    // Universal supplements
    'Allies and Adversaries': 'AaA',
    'Gadgets and Gear': 'GaG',
    'Starships and Speeders': 'SaS',

    // Dawn of Rebellion
    'Dawn of Rebellion': 'DoR',
};

/**
 * Get abbreviation from source name
 */
export function getSourceAbbreviation(sourceName : string) : string
{
    // Try direct match
    if(SOURCE_ABBREVIATIONS[sourceName])
    {
        return SOURCE_ABBREVIATIONS[sourceName];
    }

    // Try partial match
    for(const [ key, abbr ] of Object.entries(SOURCE_ABBREVIATIONS))
    {
        if(sourceName.includes(key) || key.includes(sourceName))
        {
            return abbr;
        }
    }

    // Default: use first letters or truncate
    return sourceName.slice(0, 10);
}

//----------------------------------------------------------------------------------------------------------------------
// Skill Key Mapping
//----------------------------------------------------------------------------------------------------------------------

/**
 * Map XML skill keys to readable skill names
 * These use the official skill names from the source books
 */
export const SKILL_KEY_MAP : Record<string, string> = {
    // Combat Skills
    BRAWL: 'Brawl',
    GUNN: 'Gunnery',
    LTSABER: 'Lightsaber',
    MELEE: 'Melee',
    RANGHVY: 'Ranged (Heavy)',
    RANGLT: 'Ranged (Light)',

    // General Skills
    ASTRO: 'Astrogation',
    ATHL: 'Athletics',
    CHARM: 'Charm',
    COERC: 'Coercion',
    COMP: 'Computers',
    COOL: 'Cool',
    COORD: 'Coordination',
    DECEP: 'Deception',
    DISC: 'Discipline',
    EDU: 'Education',
    LEAD: 'Leadership',
    LORE: 'Lore',
    MECH: 'Mechanics',
    MED: 'Medicine',
    NEGOT: 'Negotiation',
    PERC: 'Perception',
    PILOTPL: 'Piloting (Planetary)',
    PILOTSP: 'Piloting (Space)',
    RESIL: 'Resilience',
    SKUL: 'Skulduggery',
    STEAL: 'Stealth',
    STRWISE: 'Streetwise',
    SURV: 'Survival',
    VIGIL: 'Vigilance',
    CORE: 'Core Worlds',
    OUT: 'Outer Rim',
    UND: 'Underworld',
    XENOL: 'Xenology',
    WARF: 'Warfare',
};

/**
 * Map skill key to skill name
 */
export function mapSkillKey(key : string) : string
{
    return SKILL_KEY_MAP[key] ?? key;
}

//----------------------------------------------------------------------------------------------------------------------
// Quality Key Mapping
//----------------------------------------------------------------------------------------------------------------------

/**
 * Map XML quality keys to slugified quality IDs
 */
export const QUALITY_KEY_MAP : Record<string, string> = {
    ACCURATE: 'accurate',
    AUTOFIRE: 'auto-fire',
    BLAST: 'blast',
    BREACH: 'breach',
    BURN: 'burn',
    CONCEAL: 'concussive',
    CORTOSIS: 'cortosis',
    CRIT: 'critical',
    CUMBERSOME: 'cumbersome',
    DEFENSIVE: 'defensive',
    DEFLECT: 'deflection',
    DISORIENT: 'disorient',
    ENSNARE: 'ensnare',
    GUIDED: 'guided',
    IONSRJ: 'ion',
    KNOCKDOWN: 'knockdown',
    LIMITEDAMMO: 'limited-ammo',
    LINKED: 'linked',
    PIERCE: 'pierce',
    PREPARE: 'prepare',
    REINFORCED: 'reinforced',
    SLOWFIRING: 'slow-firing',
    STUNDAMAGE: 'stun-damage',
    STUNSETTING: 'stun-setting',
    SUNDER: 'sunder',
    SUPERIOR: 'superior',
    TRACTOR: 'tractor',
    UNWIELDY: 'unwieldy',
    VICIOUS: 'vicious',
};

/**
 * Map quality key to quality ID
 */
export function mapQualityKey(key : string | undefined) : string
{
    // Handle undefined or non-string keys
    if(!key || typeof key !== 'string')
    {
        return 'eote-quality-unknown';
    }

    const mapped = QUALITY_KEY_MAP[key];
    if(mapped)
    {
        return `eote-quality-${ mapped }`;
    }

    // Convert unknown keys to slugified format
    return `eote-quality-${ slugify(key) }`;
}

//----------------------------------------------------------------------------------------------------------------------
// Range Mapping
//----------------------------------------------------------------------------------------------------------------------

/**
 * Internal range type (matches existing EotE schema)
 */
export type InternalRange = 'en' | 's' | 'm' | 'l' | 'ex';

/**
 * Map XML range values to internal format
 */
export const RANGE_MAP : Record<string, InternalRange> = {
    wrEngaged: 'en',
    wrShort: 's',
    wrMedium: 'm',
    wrLong: 'l',
    wrExtreme: 'ex',
    Engaged: 'en',
    Short: 's',
    Medium: 'm',
    Long: 'l',
    Extreme: 'ex',
};

/**
 * Convert XML range to internal format
 */
export function mapRange(rangeValue : string) : InternalRange
{
    return RANGE_MAP[rangeValue] ?? 's';
}

//----------------------------------------------------------------------------------------------------------------------
// Activation Mapping
//----------------------------------------------------------------------------------------------------------------------

/**
 * Internal activation type (matches existing EotE schema)
 */
export type InternalActivation = 'p' | 'ai' | 'aio' | 'am' | 'aa';

/**
 * Map XML activation values to internal format
 */
export const ACTIVATION_MAP : Record<string, InternalActivation> = {
    'taPassive': 'p',
    'taIncidental': 'ai',
    'taIncidentalOOT': 'aio',
    'taManeuver': 'am',
    'taAction': 'aa',
    'Passive': 'p',
    'Incidental': 'ai',
    'Incidental (Out of Turn)': 'aio',
    'Maneuver': 'am',
    'Action': 'aa',
};

/**
 * Convert XML activation to internal format
 */
export function mapActivation(activationValue : string) : InternalActivation
{
    return ACTIVATION_MAP[activationValue] ?? 'p';
}

//----------------------------------------------------------------------------------------------------------------------
// Source/Reference Formatting
//----------------------------------------------------------------------------------------------------------------------

/**
 * Extract source string from XML Source field (can be string, object, or array)
 */
export function extractSourceName(source : string | XmlSource | XmlSource[] | undefined) : string | undefined
{
    if(!source)
    {
        return undefined;
    }

    // Handle array (XML parser makes Source an array)
    if(Array.isArray(source))
    {
        return source.length > 0 ? extractSourceName(source[0]) : undefined;
    }

    if(typeof source === 'string')
    {
        return source;
    }

    return source['#text'];
}

/**
 * Extract page number from XML Source field
 * Page is stored as @_Page attribute: <Source Page="132">Book Name</Source>
 */
export function extractPageNumber(source : string | XmlSource | XmlSource[] | undefined) : number | undefined
{
    if(!source || typeof source === 'string')
    {
        return undefined;
    }

    // Handle array (XML parser makes Source an array)
    if(Array.isArray(source))
    {
        return source.length > 0 ? extractPageNumber(source[0]) : undefined;
    }

    // Page is an XML attribute, parsed as @_Page
    if(source['@_Page'])
    {
        const page = parseInt(source['@_Page'], 10);
        return isNaN(page) ? undefined : page;
    }

    return undefined;
}

/**
 * Format a reference string from source info
 */
export function formatReference(sourceName : string | undefined, page ?: number) : string
{
    if(!sourceName)
    {
        return 'E-CRB';
    }

    const abbr = getSourceAbbreviation(sourceName);

    if(page !== undefined && page > 0)
    {
        return `${ abbr }:${ page }`;
    }

    return abbr;
}

/**
 * Extract all sources from a Sources container and format as reference strings
 * Returns empty array if no sources found
 */
export function extractAllReferences(
    source : string | XmlSource | undefined,
    sources : { Source : XmlSource | XmlSource[] } | undefined
) : string[]
{
    const refs : string[] = [];

    // Try Sources array first (preferred - contains all sources)
    if(sources?.Source)
    {
        const sourceArray = ensureArray(sources.Source);
        for(const src of sourceArray)
        {
            const name = extractSourceName(src);
            const page = extractPageNumber(src);
            if(name)
            {
                refs.push(formatReference(name, page));
            }
        }
    }

    // Fall back to single Source field if no Sources array
    if(refs.length === 0 && source)
    {
        const name = extractSourceName(source);
        const page = extractPageNumber(source);
        if(name)
        {
            refs.push(formatReference(name, page));
        }
    }

    return refs;
}

//----------------------------------------------------------------------------------------------------------------------
// Description Cleanup
//----------------------------------------------------------------------------------------------------------------------

/**
 * Clean up XML description text
 * Removes formatting tags like [H3], [P], [B], etc.
 * Optionally strips redundant title from the start of the description.
 *
 * @param description - The raw description text from XML
 * @param name - Optional item name to strip from the start of the description
 */
export function cleanDescription(description : string | undefined, name ?: string) : string
{
    if(!description)
    {
        return '';
    }

    let cleaned = description
        // Remove header tags
        .replace(/\[H\d\]/gi, '')
        .replace(/\[h\d\]/gi, '')
        // Remove paragraph tags
        .replace(/\[P\]/gi, '\n\n')
        .replace(/\[p\]/gi, '\n\n')
        // Remove bold tags
        .replace(/\[B\]/gi, '**')
        .replace(/\[b\]/gi, '**')
        // Remove italic tags
        .replace(/\[I\]/gi, '_')
        .replace(/\[i\]/gi, '_')
        // Convert line breaks
        .replace(/\[BR\]/gi, '\n')
        // Convert dice symbols to HTML-like tags (matches app's dice component format)
        // Short form: [SE], [BO], etc.
        .replace(/\[SE\]/gi, '<setback></setback>')
        .replace(/\[BO\]/gi, '<boost></boost>')
        .replace(/\[AD\]/gi, '<advantage></advantage>')
        .replace(/\[TH\]/gi, '<threat></threat>')
        .replace(/\[SU\]/gi, '<success></success>')
        .replace(/\[FA\]/gi, '<failure></failure>')
        .replace(/\[TR\]/gi, '<triumph></triumph>')
        .replace(/\[DE\]/gi, '<despair></despair>')
        .replace(/\[FP\]/gi, '<forcepoint></forcepoint>')
        .replace(/\[FD\]/gi, '<force></force>')
        .replace(/\[DI\]/gi, '<difficulty></difficulty>')
        .replace(/\[CH\]/gi, '<challenge></challenge>')
        .replace(/\[AB\]/gi, '<ability></ability>')
        .replace(/\[PR\]/gi, '<proficiency></proficiency>')
        // Long form: [SETBACK], [BOOST], etc.
        .replace(/\[SETBACK\]/gi, '<setback></setback>')
        .replace(/\[BOOST\]/gi, '<boost></boost>')
        .replace(/\[ADVANTAGE\]/gi, '<advantage></advantage>')
        .replace(/\[THREAT\]/gi, '<threat></threat>')
        .replace(/\[SUCCESS\]/gi, '<success></success>')
        .replace(/\[FAILURE\]/gi, '<failure></failure>')
        .replace(/\[TRIUMPH\]/gi, '<triumph></triumph>')
        .replace(/\[DESPAIR\]/gi, '<despair></despair>')
        .replace(/\[FORCEPOINT\]/gi, '<forcepoint></forcepoint>')
        .replace(/\[FORCE\]/gi, '<force></force>')
        .replace(/\[DIFFICULTY\]/gi, '<difficulty></difficulty>')
        .replace(/\[CHALLENGE\]/gi, '<challenge></challenge>')
        .replace(/\[ABILITY\]/gi, '<ability></ability>')
        .replace(/\[PROFICIENCY\]/gi, '<proficiency></proficiency>')
        // Clean up whitespace - collapse multiple newlines to single
        .replace(/\n{2,}/g, '\n')
        .trim();

    // Strip redundant title if description starts with the item name
    if(name && cleaned.startsWith(name))
    {
        cleaned = cleaned.slice(name.length).replace(/^\n+/, '')
            .trim();
    }

    return cleaned;
}

//----------------------------------------------------------------------------------------------------------------------
// Modifier Key Translation
//----------------------------------------------------------------------------------------------------------------------

/**
 * Format type for modifier display
 */
type ModifierFormat = 'plus' | 'minus' | 'quality' | 'set' | 'custom' | 'hidden';

/**
 * Modifier key descriptions for converting XML mod keys to readable text
 * Format: key → { name: display name, format: how to format with count }
 */
export const MODIFIER_KEY_DESCRIPTIONS : Record<string, { name : string; format : ModifierFormat }> = {
    // Damage modifiers
    DAMADD: { name: 'Damage', format: 'plus' },
    DAMSET: { name: 'Damage', format: 'set' },
    DAMSUB: { name: 'Damage', format: 'minus' },

    // Critical modifiers
    CRITSUB: { name: 'Critical', format: 'minus' },
    CRITSET: { name: 'Critical', format: 'set' },

    // Range modifiers
    RANGEADD: { name: 'Range Band', format: 'plus' },
    RANGESUB: { name: 'Range Band', format: 'minus' },

    // Quality modifiers (add quality with rating)
    PIERCE: { name: 'Pierce', format: 'quality' },
    BREACH: { name: 'Breach', format: 'quality' },
    VICIOUS: { name: 'Vicious', format: 'quality' },
    ACCURATE: { name: 'Accurate', format: 'quality' },
    BLAST: { name: 'Blast', format: 'quality' },
    STUNDAMAGE: { name: 'Stun Damage', format: 'quality' },
    STUNSETTING: { name: 'Stun Setting', format: 'quality' },
    AUTOFIRE: { name: 'Auto-fire', format: 'quality' },
    BURN: { name: 'Burn', format: 'quality' },
    CONCUSSIVE: { name: 'Concussive', format: 'quality' },
    CORTOSIS: { name: 'Cortosis', format: 'quality' },
    CUMBERSOME: { name: 'Cumbersome', format: 'quality' },
    DEFENSIVE: { name: 'Defensive', format: 'quality' },
    DEFLECTION: { name: 'Deflection', format: 'quality' },
    DISORIENT: { name: 'Disorient', format: 'quality' },
    ENSNARE: { name: 'Ensnare', format: 'quality' },
    GUIDED: { name: 'Guided', format: 'quality' },
    ION: { name: 'Ion', format: 'quality' },
    KNOCKDOWN: { name: 'Knockdown', format: 'quality' },
    LIMITEDAMMO: { name: 'Limited Ammo', format: 'quality' },
    LINKED: { name: 'Linked', format: 'quality' },
    PREPARE: { name: 'Prepare', format: 'quality' },
    SLOWFIRING: { name: 'Slow-Firing', format: 'quality' },
    SUNDER: { name: 'Sunder', format: 'quality' },
    SUPERIOR: { name: 'Superior', format: 'quality' },
    TRACTOR: { name: 'Tractor', format: 'quality' },
    UNWIELDY: { name: 'Unwieldy', format: 'quality' },
    INACCURATE: { name: 'Inaccurate', format: 'quality' },
    STUN: { name: 'Stun', format: 'quality' },
    PARRY: { name: 'Parry', format: 'quality' },
    REFLECT: { name: 'Reflect', format: 'quality' },

    // Quality subtraction modifiers
    SUBQUALINACCURATE: { name: 'Inaccurate', format: 'minus' },
    SUBQUALCUMBERSOME: { name: 'Cumbersome', format: 'minus' },
    REMQUALBREACH: { name: 'Remove Breach quality', format: 'custom' },

    // Dice modifiers
    SETBACKADD: { name: 'Setback', format: 'plus' },
    SETBACKSUB: { name: 'Setback', format: 'minus' },
    BOOSTADD: { name: 'Boost', format: 'plus' },
    BOOSTSUB: { name: 'Boost', format: 'minus' },
    ADVANTAGEADD: { name: 'Advantage', format: 'plus' },
    DIFFICULTYUP: { name: 'Difficulty', format: 'plus' },
    DIFFICULTYDOWN: { name: 'Difficulty', format: 'minus' },
    DIFFICULTY: { name: 'Difficulty', format: 'plus' },
    BOOST: { name: 'Boost', format: 'plus' },
    SETBACK: { name: 'Setback', format: 'plus' },
    THRCANCEL: { name: 'Threat cancelled on successful check', format: 'custom' },

    // Defense/Soak modifiers
    DEFENSEADD: { name: 'Defense', format: 'plus' },
    DEFENSEMELEE: { name: 'Melee Defense', format: 'plus' },
    DEFENSERANGED: { name: 'Ranged Defense', format: 'plus' },
    SOAKADD: { name: 'Soak', format: 'plus' },
    DEFADD: { name: 'Defense', format: 'plus' },
    MELEEDEFADD: { name: 'Melee Defense', format: 'plus' },
    RANGEDDEFADD: { name: 'Ranged Defense', format: 'plus' },

    // Encumbrance modifiers
    ENCUMADD: { name: 'Encumbrance', format: 'plus' },
    ENCUMSUB: { name: 'Encumbrance', format: 'minus' },
    ENCADD: { name: 'Encumbrance', format: 'plus' },
    ENCSUB: { name: 'Encumbrance', format: 'minus' },
    ENCTADD: { name: 'Encumbrance Threshold', format: 'plus' },
    ENCTBRADD: { name: 'Encumbrance Threshold (Brawn)', format: 'plus' },
    SMUGENC: { name: 'Hidden Compartment Encumbrance', format: 'plus' },
    ENCCADD: { name: 'Encumbrance Capacity', format: 'plus' },
    ENCCADDSIL: { name: 'Encumbrance Capacity (per Silhouette)', format: 'plus' },

    // HP modifiers
    HPADD: { name: 'Hard Points', format: 'plus' },

    // Range/Difficulty modifiers
    DIFFSUBLONGEXT: { name: 'Difficulty at Long/Extreme Range', format: 'minus' },
    DIFFSUBNORM: { name: 'Difficulty', format: 'minus' },
    DIFFSUBLONG: { name: 'Difficulty at Long Range', format: 'minus' },
    DIFFSUBEXT: { name: 'Difficulty at Extreme Range', format: 'minus' },

    // Vehicle modifiers
    HANDLINGADD: { name: 'Handling', format: 'plus' },
    HANDLINGSUB: { name: 'Handling', format: 'minus' },
    SPEEDADD: { name: 'Speed', format: 'plus' },
    SPEEDSUB: { name: 'Speed', format: 'minus' },
    DEFZONEADD: { name: 'Defense Zone', format: 'plus' },
    SSTRAINADD: { name: 'System Strain Threshold', format: 'plus' },
    SSTTRAINSUB: { name: 'System Strain Threshold', format: 'minus' },
    SSTRAINSUB: { name: 'System Strain Threshold', format: 'minus' },
    SSTRAINADDSIL: { name: 'System Strain Threshold (per Silhouette)', format: 'plus' },
    SETSSTRAINSILCRAFT: { name: 'System Strain Threshold (×Silhouette)', format: 'set' },
    MOUNT3: { name: 'Weapon Mounts', format: 'set' },
    UPGUNN: { name: 'Upgrade Gunnery check ability dice', format: 'custom' },
    ARMORADD: { name: 'Armor', format: 'plus' },
    HULLADD: { name: 'Hull Trauma Threshold', format: 'plus' },
    HULLADDSIL: { name: 'Hull Trauma Threshold (per Silhouette)', format: 'plus' },
    SETSPEEDCRAFT: { name: 'Speed', format: 'set' },
    SETARMORCRAFT: { name: 'Armor', format: 'set' },
    SETHANDCRAFT: { name: 'Handling', format: 'set' },
    SETHAND: { name: 'Handling', format: 'set' },
    SETDEFFORECRAFT: { name: 'Fore Defense', format: 'set' },
    SETDEFAFTCRAFT: { name: 'Aft Defense', format: 'set' },
    SETDEFPORTCRAFT: { name: 'Port Defense', format: 'set' },
    SETDEFSTARCRAFT: { name: 'Starboard Defense', format: 'set' },
    ADDDEFFORE: { name: 'Fore Defense', format: 'plus' },
    ADDDEFAFT: { name: 'Aft Defense', format: 'plus' },
    PASSADD: { name: 'Passenger Capacity', format: 'plus' },
    PASSADDSIL: { name: 'Passenger Capacity (per Silhouette)', format: 'plus' },
    CRANGEADD: { name: 'Communication Range', format: 'plus' },
    ADDALT50: { name: 'Altitude', format: 'plus' },
    SILHADD: { name: 'Silhouette', format: 'plus' },

    // Hyperdrive modifiers
    HYPERDRIVEADD4: { name: 'Add Class 4 Hyperdrive', format: 'custom' },
    HYPERDRIVEADD8: { name: 'Add Class 8 Hyperdrive', format: 'custom' },
    HYPERDRIVESUB: { name: 'Hyperdrive Class', format: 'minus' },

    // Talent-based modifiers (with descriptions of what they grant)
    SNIPSHOT: { name: 'Gain Sniper Shot (increase range at cost of difficulty)', format: 'custom' },
    QUICKDR: { name: 'Gain Quick Draw (draw/holster as incidental)', format: 'custom' },
    PRECAIM: { name: 'Gain Precise Aim (reduce target\'s melee defense)', format: 'custom' },
    TRUEAIM: { name: 'Gain True Aim (gain <boost></boost> per aim maneuver)', format: 'custom' },
    NATMAR: { name: 'Gain Natural Marksman (reroll 1 Ranged check/session)', format: 'custom' },
    QUICKST: { name: 'Gain Quick Strike (add <boost></boost> vs targets that haven\'t acted)', format: 'custom' },
    SHORTCUT: { name: 'Gain Shortcut (reduce time for route calculation)', format: 'custom' },
    TRICK: { name: 'Gain Tricky Target (upgrade difficulty vs vehicle weapons)', format: 'custom' },
    TECHAPT: { name: 'Gain Technical Aptitude (reduce time for Computer tasks)', format: 'custom' },
    MASSHAD: { name: 'Gain Master of Shadows (decrease Stealth check difficulty)', format: 'custom' },
    DEFDRI: { name: 'Gain Defensive Driving (increase defense while piloting)', format: 'custom' },
    SITAWARE: { name: 'Gain Situational Awareness (allies in short range add <boost></boost>)', format: 'custom' },
    POINTBL: { name: 'Gain Point Blank (add damage at short range or engaged)', format: 'custom' },
    RAPREC: { name: 'Gain Rapid Recovery (heal additional strain after encounter)', format: 'custom' },
    PRESSHOT: { name: 'Gain Prescient Shot (add <force></force> to Ranged checks)', format: 'custom' },
    COD: { name: 'Gain Codebreaker (remove <setback></setback> from decryption checks)', format: 'custom' },
    DEFSLI: { name: 'Gain Defensive Slicing (defend against slicing attempts)', format: 'custom' },
    STALK: { name: 'Gain Stalker (add <boost></boost> to Coordination/Stealth checks)', format: 'custom' },
    DURA: { name: 'Gain Durable (reduce Critical Injury severity)', format: 'custom' },
    PLANMAP: { name: 'Gain Full Stop (immediately bring vehicle to stop)', format: 'custom' },
    VAKSAI: { name: 'Vaksai-class starfighter modification', format: 'custom' },

    // Skill-related modifiers (add boost/upgrade to skill checks)
    VIGIL: { name: 'Add <boost></boost> to Vigilance checks', format: 'custom' },
    PERC: { name: 'Add <boost></boost> to Perception checks', format: 'custom' },
    ATHL: { name: 'Add <boost></boost> to Athletics checks', format: 'custom' },
    COORD: { name: 'Add <boost></boost> to Coordination checks', format: 'custom' },
    STEAL: { name: 'Add <boost></boost> to Stealth checks', format: 'custom' },
    COOL: { name: 'Add <boost></boost> to Cool checks', format: 'custom' },
    BRA: { name: 'Add <boost></boost> to Brawl checks', format: 'custom' },

    // Electronic warfare/systems
    ECCM: { name: 'Electronic Counter-Countermeasures system', format: 'custom' },
    TCCS: { name: 'Tactical Command & Control System', format: 'custom' },
    AEGIS: { name: 'Aegis Defense System (coordinate point defense)', format: 'custom' },
    SCOMP: { name: 'SCOMP Link (interface with computers)', format: 'custom' },

    // Equipment-specific modifiers
    HOLSTER3: { name: 'Holster (Encumbrance 3 weapon)', format: 'custom' },
    ADVADDINIT: { name: 'Add <advantage></advantage> to Initiative checks', format: 'custom' },
    ADDCRYSTNC: { name: 'Add additional crystal (no HP cost)', format: 'custom' },
    RESDOSE: { name: 'Reservoir Dose', format: 'plus' },

    // Property flags - these are programmatic indicators that typically appear alongside
    // a MiscDesc that already describes the effect. Displaying them would be redundant.
    // SEALED: ItemDescriptors says "Armor is Sealed" - the MiscDesc already explains the effect
    SEALED: { name: '', format: 'hidden' },
    HEALPLUSONE: { name: 'Medicine check heals additional wound', format: 'plus' },
    BOARDTUBETIME: { name: 'Reduce boarding tube breach time (rounds)', format: 'minus' },
    HANGERSIZE: { name: 'Hangar capacity (Silhouette)', format: 'plus' },
    HANGER: { name: 'Add hangar bay', format: 'custom' },

    // Threat/Advantage modifiers
    THRADD: { name: 'Add <threat></threat> to combat checks', format: 'custom' },
    ADVADD: { name: 'Add <advantage></advantage> to combat checks', format: 'custom' },

    // Skill change modifiers
    USERANGLT: { name: 'Use Ranged (Light) skill', format: 'custom' },
    USERANGHVY: { name: 'Use Ranged (Heavy) skill', format: 'custom' },
    USEBRAWL: { name: 'Use Brawl skill', format: 'custom' },
    USEMELEE: { name: 'Use Melee skill', format: 'custom' },
    USELTSABER: { name: 'Use Lightsaber skill', format: 'custom' },

    // Range modifiers
    RANGEREDMED: { name: 'Reduce range to Medium', format: 'custom' },
    RANGEREDSHORT: { name: 'Reduce range to Short', format: 'custom' },
    RANGEREDENG: { name: 'Reduce range to Engaged', format: 'custom' },

    // Weapon mounting
    MOUNTRANGED4: { name: 'Mount ranged weapon (Silhouette 4 or less)', format: 'custom' },
    ADDSILWEAP: { name: 'Add weapon mount (Silhouette-based)', format: 'custom' },

    // Strain modifiers
    STRAINADD: { name: 'Strain Threshold', format: 'plus' },
    STRAINSUB: { name: 'Strain Threshold', format: 'minus' },

    // Hull modifiers
    HULLSUB: { name: 'Hull Trauma Threshold', format: 'minus' },

    // Remove quality modifiers
    REMQUALION: { name: 'Remove Ion quality', format: 'custom' },
    REMQUALLIMITEDAMMO: { name: 'Remove Limited Ammo quality', format: 'custom' },
    REMQUALSUNDER: { name: 'Remove Sunder quality', format: 'custom' },
    REMQUALSTUNSETTING: { name: 'Remove Stun Setting quality', format: 'custom' },
    REMQUALCUMBERSOME: { name: 'Remove Cumbersome quality', format: 'custom' },

    // Vehicle set modifiers
    SETDEFFORE: { name: 'Set Fore Defense', format: 'custom' },
    SETDEFAFT: { name: 'Set Aft Defense', format: 'custom' },
    SETSPEED: { name: 'Set Speed', format: 'custom' },
    SETARMOR: { name: 'Set Armor', format: 'custom' },

    // Price modifiers
    PRICEHALF: { name: 'Reduce price by half', format: 'custom' },

    // Weapon system modifiers
    DAMWEAPSYSADD: { name: 'Increase weapon system damage', format: 'plus' },

    // Additional quality modifiers
    MASSIVEADD: { name: 'Massive', format: 'quality' },
    SUBQUALUNWIELDY: { name: 'Unwieldy', format: 'minus' },
    SUBQUALVICIOUS: { name: 'Vicious', format: 'minus' },
    QUALADVSUB: { name: 'Reduce quality advantage cost', format: 'custom' },

    // Additional weapon mounting
    MOUNTADDL: { name: 'Add weapon mount (Long range)', format: 'custom' },

    // Defense modifiers
    DEFSTA: { name: 'Starboard Defense', format: 'plus' },
    RANGEDEFADD: { name: 'Ranged Defense', format: 'plus' },

    // Talent modifiers
    LETHALBL: { name: 'Gain Lethal Blows (+10 to Critical)', format: 'custom' },
    BAR: { name: 'Gain Barrage (add damage per rank)', format: 'custom' },
    INTIM: { name: 'Gain Intimidating (downgrade Coercion difficulty)', format: 'custom' },

    // Skill modifiers
    SURV: { name: 'Add <boost></boost> to Survival checks', format: 'custom' },
    RESIL: { name: 'Add <boost></boost> to Resilience checks', format: 'custom' },

    // Hard point modifiers
    HPSUB: { name: 'Hard Points', format: 'minus' },
};

/**
 * Keys with fixed numeric values built into the key name
 * These are separate from the count parameter and represent fixed modifiers
 */
const FIXED_NUMERIC_KEYS : Record<string, { baseName : string; value : number; format : 'plus' | 'minus' | 'set' }> = {
    // Speed modifiers
    SPEEDADD2: { baseName: 'Speed', value: 2, format: 'plus' },
    SPEEDSUB2: { baseName: 'Speed', value: 2, format: 'minus' },

    // Passenger modifiers
    PASSADD2: { baseName: 'Passenger Capacity', value: 2, format: 'plus' },
    PASSADD10: { baseName: 'Passenger Capacity', value: 10, format: 'plus' },

    // Hull modifiers
    HULLADD3: { baseName: 'Hull Trauma Threshold', value: 3, format: 'plus' },

    // Hard point modifiers
    HPADD2: { baseName: 'Hard Points', value: 2, format: 'plus' },

    // Encumbrance modifiers
    ENCSUB2: { baseName: 'Encumbrance', value: 2, format: 'minus' },
    ENCTADD3: { baseName: 'Encumbrance Threshold', value: 3, format: 'plus' },
    ENCCADD100: { baseName: 'Encumbrance Capacity', value: 100, format: 'plus' },

    // Hyperdrive modifiers (value is class improvement)
    HYPERDRIVESUB5: { baseName: 'Hyperdrive Class', value: 5, format: 'minus' },

    // Price modifiers
    PRICE20000: { baseName: 'Price', value: 20000, format: 'plus' },

    // Silhouette modifiers
    SILHADD10: { baseName: 'Silhouette', value: 10, format: 'plus' },

    // System strain modifiers
    SSTRAINSUB2: { baseName: 'System Strain Threshold', value: 2, format: 'minus' },
};

/**
 * Format a modifier value based on its format type
 */
function formatModifierValue(name : string, count : number, format : string) : string | null
{
    switch (format)
    {
        case 'plus':
            return count >= 0 ? `+${ count } ${ name }` : `${ count } ${ name }`;
        case 'minus':
            return `-${ count } ${ name }`;
        case 'quality':
            return count > 0 ? `${ name } ${ count }` : name;
        case 'set':
            return `${ name } set to ${ count }`;
        case 'hidden':
            // Hidden modifiers are internal flags that shouldn't be displayed
            return null;
        case 'custom':
        default:
            return name;
    }
}

/**
 * Translate a modifier key and count to readable text
 * Returns null for hidden modifiers that shouldn't be displayed
 */
export function translateModifierKey(key : string, count = 1) : string | null
{
    // First check for exact match in standard descriptions
    const descriptor = MODIFIER_KEY_DESCRIPTIONS[key];
    if(descriptor)
    {
        return formatModifierValue(descriptor.name, count, descriptor.format);
    }

    // Check for fixed numeric keys (like SPEEDADD2, PASSADD10, etc.)
    const fixedKey = FIXED_NUMERIC_KEYS[key];
    if(fixedKey)
    {
        // For fixed keys, the value is built into the key, count is how many times it can be taken
        return formatModifierValue(fixedKey.baseName, fixedKey.value, fixedKey.format);
    }

    // Handle negative counts for unknown keys (likely quality reductions)
    if(count < 0)
    {
        return `${ count } ${ key }`;
    }

    // Default: return key with count if > 1
    return count > 1 ? `${ key } ${ count }` : key;
}

/**
 * Format a single mod option (always uses value of 1 for numeric mods)
 * This is used for attachment mod options where each mod is listed separately
 */
function formatSingleMod(name : string, format : string) : string | null
{
    switch (format)
    {
        case 'plus':
            return `+1 ${ name }`;
        case 'minus':
            return `-1 ${ name }`;
        case 'quality':
            return `${ name } +1`;
        case 'hidden':
            return null;
        case 'set':
        case 'custom':
        default:
            return name;
    }
}

/**
 * Translate a modifier key to a single mod option text.
 * Unlike translateModifierKey, this always produces a single mod entry
 * (e.g., "+1 Damage" instead of "+2 Damage" when count is 2).
 * The count is handled by repeating the mod in the array.
 * Returns null for hidden modifiers that shouldn't be displayed.
 */
export function translateModifierKeyForMod(key : string) : string | null
{
    // First check for exact match in standard descriptions
    const descriptor = MODIFIER_KEY_DESCRIPTIONS[key];
    if(descriptor)
    {
        return formatSingleMod(descriptor.name, descriptor.format);
    }

    // Check for fixed numeric keys (like SPEEDADD2, PASSADD10, etc.)
    const fixedKey = FIXED_NUMERIC_KEYS[key];
    if(fixedKey)
    {
        // For fixed keys, use the built-in value
        return formatModifierValue(fixedKey.baseName, fixedKey.value, fixedKey.format);
    }

    // Default: return key as-is
    return key;
}

//----------------------------------------------------------------------------------------------------------------------
