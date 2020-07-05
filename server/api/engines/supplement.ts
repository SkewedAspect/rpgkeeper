//----------------------------------------------------------------------------------------------------------------------
// SupplementEngine
//----------------------------------------------------------------------------------------------------------------------

import _ from 'lodash';

// Utilities
import { camelCaseKeys, snakeCaseKeys } from '../../utils/misc';
import { Character, CharacterDetails } from '../../types/character';
import { Supplement, SupplementValidationPath } from '../../types/supplements';
import { Account } from '../../models/account';

// Logging
import logging from 'trivial-logging';
const logger = logging.loggerFor(module);

//----------------------------------------------------------------------------------------------------------------------

export interface DataMungingFunction {
    (data : Record<string, unknown>) : Record<string, unknown>
}

//----------------------------------------------------------------------------------------------------------------------

class SupplementEngine
{
    private $toDatabaseFuncs : Record<string, DataMungingFunction> = {};
    private $fromDatabaseFuncs : Record<string, DataMungingFunction> = {};

    constructor()
    {
        // Processing functions for going from the database to a Model
        this.$fromDatabaseFuncs = {
            quality(quality)
            {
                return {
                    ...quality,
                    passive: !!quality.passive,
                    ranked: !!quality.ranked
                };
            }
        };
    } // end constructor

    //------------------------------------------------------------------------------------------------------------------

    async $validateSupplementPath(data : CharacterDetails, suppDef : SupplementValidationPath, systemPrefix : string, account : Account) : Promise<boolean>
    {
        // FIXME: This is a circular dependency, and I hate it.
        const suppMan = (await import('../managers/supplement')).default;

        let supplements = _.get(data, suppDef.path, []) as Supplement | Supplement[] | number[];

        // Handle the case of the path pointing to a single supplement.
        if(supplements && !Array.isArray(supplements))
        {
            supplements = [ supplements ];
        } // end if

        // If we have any (since this could be a data delta, or a new data) then filter
        if(supplements && supplements.length > 0)
        {
            let ids = supplements;

            // Handle the supplements being arrays of objects with property `id`
            if(_.get(supplements[0], 'id') !== undefined)
            {
                ids = (supplements as Supplement[]).map((supp) => supp.id) as number[];
            } // end if

            // Filter the supplements
            const filtered = (await suppMan.filterSupplementsByPermissions(ids, suppDef.type, systemPrefix, account))
                .map((obj) => obj.id);

            supplements = (supplements as Supplement[]).filter((supp) =>
            {
                if(_.isObject(supp))
                {
                    return filtered.includes(supp.id);
                }
                else
                {
                    return filtered.includes(supp);
                } // end if
            });

            // Set the path to the now filtered results
            _.set(data, suppDef.path, supplements);

            // Return true if we filtered something out.
            return ids.length !== filtered.length;
        } // end if

        return false;
    } // end $validateSupplementPath

    //------------------------------------------------------------------------------------------------------------------

    async validateCharacter(character : Character, supplementPaths : SupplementValidationPath[], account : Account) : Promise<{ character : Character, filtered : boolean }>
    {
        // Validate all supplement paths
        let results = await Promise.all(supplementPaths
            .map((suppDef) =>
            {
                const errLog = (err) => logger.warn(`Error validating supplement path '${ JSON.stringify(suppDef) }':`, err.stack);
                if(suppDef.list)
                {
                    // If we have a list of objects that contain supplements, we have to get the list of those objects,
                    // and then iterate over that list, passing in that object instead of the full character.
                    const suppParents = _.get(character.details, suppDef.list, []) as Record<string, unknown>[];
                    return Promise.all(suppParents
                        .map((parent) => this.$validateSupplementPath(parent, suppDef, character.system, account)
                            .catch(errLog)));
                }
                else
                {
                    return this.$validateSupplementPath(character.details, suppDef, character.system, account).catch(errLog);
                } // end if
            }));

        // Filter results to just truthy values
        results = _.flatten(results);
        results = _.compact(results);

        // We return the character
        return { character, filtered: results.length > 0 };
    } // end validateCharacter

    toDatabase(supp : Supplement, type : string) : Record<string, unknown>
    {
        const processFunc = this.$toDatabaseFuncs[type] || (() => supp);
        supp = processFunc(supp) as Supplement;
        return snakeCaseKeys(supp);
    } // end toDatabase

    fromDatabase(supp : Supplement, type : string) : Record<string, unknown>
    {
        const processFunc = this.$fromDatabaseFuncs[type] || (() => supp);
        supp = processFunc(supp) as Supplement;

        // Common processing
        // FIXME: sqlite often returns booleans as ints. We need to clean that up, and that's what this does.
        if(typeof supp.official !== 'boolean')
        {
            supp.official = !!supp.official;
        } // end if

        if(typeof supp.owner !== 'number')
        {
            supp.owner = supp.owner ? parseInt(supp.owner) : undefined;
        } // end if

        return camelCaseKeys(supp);
    } // end fromDatabase
} // end SupplementEngine

//----------------------------------------------------------------------------------------------------------------------

export default new SupplementEngine();

//----------------------------------------------------------------------------------------------------------------------
