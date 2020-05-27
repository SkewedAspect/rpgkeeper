//----------------------------------------------------------------------------------------------------------------------
// SupplementEngine
//----------------------------------------------------------------------------------------------------------------------

const _ = require('lodash');

// Utilities
const { camelCaseKeys, snakeCaseKeys } = require('../../utils/misc');

// Logging
const logger = require('trivial-logging').loggerFor(module);

//----------------------------------------------------------------------------------------------------------------------

class SupplementEngine
{
    constructor()
    {
        // Processing functions for going from a Model to the database
        this.$toDatabaseFuncs = {};

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

    async $validateSupplementPath(data, suppDef, systemPrefix, account)
    {
        // FIXME: This is a circular dependency, and I hate it.
        const suppMan = require('../managers/supplement');

        let supplements = _.get(data, suppDef.path, []);

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
                ids = supplements.map((supp) => supp.id);
            } // end if

            // Filter the supplements
            const filtered = (await suppMan.filterSupplementsByPermissions(ids, suppDef.type, systemPrefix, account))
                .map((obj) => obj.id);

            supplements = supplements.filter((supp) =>
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
    } // end $validateSupplementPath

    //------------------------------------------------------------------------------------------------------------------

    async validateCharacter(character, supplementPaths, account)
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
                    const suppParents = _.get(character.details, suppDef.list, []);
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

    toDatabase(supp, type)
    {
        const processFunc = this.$toDatabaseFuncs[type] || (() => supp);
        supp = processFunc(supp);
        return snakeCaseKeys(supp);
    } // end toDatabase

    fromDatabase(supp, type)
    {
        const processFunc = this.$fromDatabaseFuncs[type] || (() => supp);
        supp = processFunc(supp);

        // Common processing
        supp.official = !!supp.official;

        return camelCaseKeys(supp);
    } // end fromDatabase
} // end SupplementEngine

//----------------------------------------------------------------------------------------------------------------------

module.exports = new SupplementEngine();

//----------------------------------------------------------------------------------------------------------------------
