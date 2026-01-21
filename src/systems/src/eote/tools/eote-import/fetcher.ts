//----------------------------------------------------------------------------------------------------------------------
// Repository Fetcher
//
// Handles cloning the OggDudes-Custom-Dataset-SW repository and parsing XML files
//----------------------------------------------------------------------------------------------------------------------

import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { access, readFile, readdir, rm } from 'node:fs/promises';
import { simpleGit } from 'simple-git';
import { XMLParser } from 'fast-xml-parser';

// Types
import type {
    ArmorsDocument,
    ItemAttachmentsDocument,
    ItemDescriptorsDocument,
    SkillsDocument,
    SpecializationDocument,
    TalentsDocument,
    WeaponsDocument,
    XmlArmor,
    XmlItemAttachment,
    XmlItemDescriptor,
    XmlSkill,
    XmlSpecialization,
    XmlTalent,
    XmlWeapon,
} from './types.ts';

//----------------------------------------------------------------------------------------------------------------------
// Constants
//----------------------------------------------------------------------------------------------------------------------

const REPO_URL = 'https://github.com/Septaris/OggDudes-Custom-Dataset-SW.git';
const TEMP_DIR = join(tmpdir(), 'rpgk-eote-import');
const DATA_DIR = 'DataCustom';
const SPECIALIZATIONS_DIR = 'DataCustom/Specializations';

/**
 * XML files to process
 */
export const XML_FILES = {
    armor: 'Armor.xml',
    weapons: 'Weapons.xml',
    talents: 'Talents.xml',
    attachments: 'ItemAttachments.xml',
    qualities: 'ItemDescriptors.xml',
    skills: 'Skills.xml',
    gear: 'Gear.xml',
} as const;

//----------------------------------------------------------------------------------------------------------------------
// XML Parser Configuration
//----------------------------------------------------------------------------------------------------------------------

const xmlParser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    textNodeName: '#text',
    parseAttributeValue: true,
    parseTagValue: true,
    trimValues: true,
    // Handle arrays properly
    isArray: (name, jpath) =>
    {
        // These elements should always be arrays at the root document level
        const arrayElements = [
            'Armor',
            'Weapon',
            'Talent',
            'ItemAttachment',
            'ItemDescriptor',
            'Skill',
            'Quality',
            'Category',
            'Mod',
            'Source',
            'WeaponModifier',
            'TalentRow',
        ];

        // Key should be an array only within TalentRows.TalentRow.Talents
        if(name === 'Key' && jpath.includes('TalentRows'))
        {
            return true;
        }

        return arrayElements.includes(name);
    },
});

//----------------------------------------------------------------------------------------------------------------------
// Repository Management
//----------------------------------------------------------------------------------------------------------------------

/**
 * Ensure the repository is cloned and up to date
 */
export async function ensureRepo() : Promise<string>
{
    const git = simpleGit();

    // Check if directory exists
    const exists = await access(TEMP_DIR)
        .then(() => true)
        .catch(() => false);

    if(exists)
    {
        // Check if it's a valid git repo
        const isRepo = await access(join(TEMP_DIR, '.git'))
            .then(() => true)
            .catch(() => false);

        if(isRepo)
        {
            console.info('Repository exists, pulling latest changes...');
            const repoGit = simpleGit(TEMP_DIR);
            await repoGit.pull();
            console.info('Repository updated.');
            return TEMP_DIR;
        }
        else
        {
            // Directory exists but isn't a git repo, remove it
            console.info('Removing invalid directory...');
            await rm(TEMP_DIR, { recursive: true, force: true });
        }
    }

    // Clone the repository
    console.info(`Cloning repository to ${ TEMP_DIR }...`);
    await git.clone(REPO_URL, TEMP_DIR, [ '--depth', '1' ]);
    console.info('Repository cloned.');

    return TEMP_DIR;
}

//----------------------------------------------------------------------------------------------------------------------
// XML Loading
//----------------------------------------------------------------------------------------------------------------------

/**
 * Load and parse an XML file
 */
async function loadXmlFile<T>(repoPath : string, filename : string) : Promise<T>
{
    const filePath = join(repoPath, DATA_DIR, filename);
    const content = await readFile(filePath, 'utf-8');
    return xmlParser.parse(content) as T;
}

/**
 * Load armors from XML
 */
export async function loadArmors(repoPath : string) : Promise<XmlArmor[]>
{
    const doc = await loadXmlFile<ArmorsDocument>(repoPath, XML_FILES.armor);
    return doc.Armors?.Armor ?? [];
}

/**
 * Load weapons from XML
 */
export async function loadWeapons(repoPath : string) : Promise<XmlWeapon[]>
{
    const doc = await loadXmlFile<WeaponsDocument>(repoPath, XML_FILES.weapons);
    return doc.Weapons?.Weapon ?? [];
}

/**
 * Load talents from XML
 */
export async function loadTalents(repoPath : string) : Promise<XmlTalent[]>
{
    const doc = await loadXmlFile<TalentsDocument>(repoPath, XML_FILES.talents);
    return doc.Talents?.Talent ?? [];
}

/**
 * Load item attachments from XML
 */
export async function loadAttachments(repoPath : string) : Promise<XmlItemAttachment[]>
{
    const doc = await loadXmlFile<ItemAttachmentsDocument>(repoPath, XML_FILES.attachments);
    return doc.ItemAttachments?.ItemAttachment ?? [];
}

/**
 * Load item descriptors (qualities) from XML
 */
export async function loadQualities(repoPath : string) : Promise<XmlItemDescriptor[]>
{
    const doc = await loadXmlFile<ItemDescriptorsDocument>(repoPath, XML_FILES.qualities);
    return doc.ItemDescriptors?.ItemDescriptor ?? [];
}

/**
 * Load skills from XML
 */
export async function loadSkills(repoPath : string) : Promise<XmlSkill[]>
{
    const doc = await loadXmlFile<SkillsDocument>(repoPath, XML_FILES.skills);
    return doc.Skills?.Skill ?? [];
}

/**
 * Load all specializations from the Specializations directory
 */
export async function loadSpecializations(repoPath : string) : Promise<XmlSpecialization[]>
{
    const specDir = join(repoPath, SPECIALIZATIONS_DIR);
    const files = await readdir(specDir);
    const xmlFiles = files.filter((file) => file.endsWith('.xml'));

    const parseResults = await Promise.all(
        xmlFiles.map(async (file) =>
        {
            const filePath = join(specDir, file);
            const content = await readFile(filePath, 'utf-8');
            const doc = xmlParser.parse(content) as SpecializationDocument;
            return doc.Specialization ?? null;
        })
    );

    return parseResults.filter((spec) : spec is XmlSpecialization => spec !== null);
}

//----------------------------------------------------------------------------------------------------------------------
// Exported Interface
//----------------------------------------------------------------------------------------------------------------------

/**
 * All loaded data from the repository
 */
export interface LoadedData
{
    armors : XmlArmor[];
    weapons : XmlWeapon[];
    talents : XmlTalent[];
    attachments : XmlItemAttachment[];
    qualities : XmlItemDescriptor[];
    skills : XmlSkill[];
    specializations : XmlSpecialization[];
}

/**
 * Fetch repository and load all data
 */
export async function fetchAndLoadData() : Promise<LoadedData>
{
    const repoPath = await ensureRepo();

    console.info('\nLoading XML files...');

    const armors = await loadArmors(repoPath);
    console.info(`  - Loaded ${ armors.length } armors`);

    const weapons = await loadWeapons(repoPath);
    console.info(`  - Loaded ${ weapons.length } weapons`);

    const talents = await loadTalents(repoPath);
    console.info(`  - Loaded ${ talents.length } talents`);

    const attachments = await loadAttachments(repoPath);
    console.info(`  - Loaded ${ attachments.length } attachments`);

    const qualities = await loadQualities(repoPath);
    console.info(`  - Loaded ${ qualities.length } qualities`);

    const skills = await loadSkills(repoPath);
    console.info(`  - Loaded ${ skills.length } skills`);

    const specializations = await loadSpecializations(repoPath);
    console.info(`  - Loaded ${ specializations.length } specializations`);

    return { armors, weapons, talents, attachments, qualities, skills, specializations };
}

//----------------------------------------------------------------------------------------------------------------------
