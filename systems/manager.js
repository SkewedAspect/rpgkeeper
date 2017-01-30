//----------------------------------------------------------------------------------------------------------------------
// SystemManager
//
// @module
//----------------------------------------------------------------------------------------------------------------------

const _ = require('lodash');

const routeUtils = require('../server/routes/utils');
const promisify = routeUtils.promisify;
const ensureAuthenticated = routeUtils.ensureAuthenticated;

const baseModels = require('../server/models');

// Systems
const Risus = require('./risus/system');
const Generic = require('./generic/system');
const EdgeOfTheEmpire = require('./eote/system');

//----------------------------------------------------------------------------------------------------------------------

class SystemManager
{
    constructor()
    {
        this.systems = [
            Generic,
            Risus,
            EdgeOfTheEmpire
        ];

        _.each(this.systems, (system) => system.init(this));
    } // end constructor

    get(id)
    {
        return _.find(this.systems, { id });
    } // end get

    buildGeneralEndpoints(router, models)
    {
        router.get('/character/:charID', promisify((req, resp) =>
        {
            return models.Character.get(req.params.charID)
                .catch(models.errors.DocumentNotFound, (error) =>
                {
                    resp.status(404).json({
                        human: "Character not found.",
                        message: error.message,
                        stack: error.stack
                    });
                });
        }));

        router.put('/character/:charID', ensureAuthenticated, promisify((request, response) =>
        {
            const update = _.merge({}, _.omit(request.body, 'id'), { owner: request.user.email });

            return baseModels.BaseCharacter.get(request.params.charID)
                .then((baseChar) =>
                {
                    return models.Character.get(request.params.charID)
                        .then((character) =>
                        {
                            if(baseChar.owner == request.user.email)
                            {
                                _.merge(character, update);
                                return character.save();
                            }
                            else
                            {
                                response.status(403).json({
                                    type: 'NotAuthorized',
                                    message: `You are not authorized to update system character '${ request.params.charID }'.`
                                });
                            } // end if
                        })
                })
                .catch(models.errors.DocumentNotFound, (error) =>
                {
                    response.status(404).json({
                        human: "Character not found.",
                        message: error.message,
                        stack: error.stack
                    });
                })
                .catch((error) =>
                {
                    response.status(500).json({
                        human: "Cannot save character.",
                        message: error.message,
                        stack: error.stack
                    });
                });
        }));
    } // end buildGeneralEndpoints
} // end SystemManager

//----------------------------------------------------------------------------------------------------------------------

module.exports = new SystemManager();

//----------------------------------------------------------------------------------------------------------------------