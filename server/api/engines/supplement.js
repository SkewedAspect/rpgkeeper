//----------------------------------------------------------------------------------------------------------------------
// SupplementEngine
//----------------------------------------------------------------------------------------------------------------------

// Utilities
const { camelCaseKeys, snakeCaseKeys } = require('../../utils/misc');

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
