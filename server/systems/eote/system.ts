//----------------------------------------------------------------------------------------------------------------------
// Edge of the Empire System
//----------------------------------------------------------------------------------------------------------------------

// BaseClass
import { BaseSystem, SupportStatus } from '../base';

// Defaults
import defaults from './defaults';

// Logger
import logging from 'trivial-logging';
const logger = logging.loggerFor(module);

//----------------------------------------------------------------------------------------------------------------------
// System definition
//----------------------------------------------------------------------------------------------------------------------

class GenesysSystem extends BaseSystem
{
    constructor()
    {
        const id = 'genesys';
        const name = 'Genesys';
        const description = 'Genesys is a role playing system designed for flexibility and adaptability, specifically tooled to work with any setting imaginable.';
        const suppPaths = [
            // FIXME: Currently does not support single objects, only arrays of them!
            // { path: 'motivations.strength', type: 'motivation' },
            // { path: 'motivations.flaw', type: 'motivation' },
            // { path: 'motivations.desire', type: 'motivation' },
            // { path: 'motivations.fear', type: 'motivation' },
            { path: 'talents', type: 'talent' },
            { path: 'abilities', type: 'ability' },
            { path: 'gear', type: 'gear' },
            { path: 'armor.attachments', type: 'attachment' },
            { path: 'armor.qualities', type: 'quality' },
            { list: 'weapons', path: 'attachments', type: 'attachment' },
            { list: 'weapons', path: 'qualities', type: 'quality' }
        ];

        super(id, name, description, defaults.genesys.character, suppPaths, SupportStatus.PublicBeta);

        logger.info(`Loaded '${ name }' system.`);
    } // end constructor
} // end GenesysSystem

class EOTESystem extends BaseSystem
{
    constructor()
    {
        const id = 'eote';
        const name = 'Edge of the Empire';
        const description = "A system designed for Fantasy Flight's Edge of the Empire (and associated) RPGs.";
        const suppPaths = [
            { path: 'force.powers', type: 'force_power' },
            { path: 'talents', type: 'talent' },
            { path: 'abilities', type: 'ability' },
            { path: 'gear', type: 'gear' },
            { path: 'armor.attachments', type: 'attachment' },
            { path: 'armor.qualities', type: 'quality' },
            { list: 'weapons', path: 'attachments', type: 'attachment' },
            { list: 'weapons', path: 'qualities', type: 'quality' }
        ];

        super(id, name, description, defaults.eote.character, suppPaths, SupportStatus.PublicBeta);

        logger.info(`Loaded '${ name }' system.`);
    } // end constructor
} // end EOTESystem

//----------------------------------------------------------------------------------------------------------------------

export const Genesys = new GenesysSystem();
export const EdgeOfTheEmpire = new EOTESystem();

//----------------------------------------------------------------------------------------------------------------------
