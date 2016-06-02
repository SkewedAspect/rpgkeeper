//----------------------------------------------------------------------------------------------------------------------
/// SystemManager
///
/// @module
//----------------------------------------------------------------------------------------------------------------------

import _ from 'lodash';

//----------------------------------------------------------------------------------------------------------------------

class SystemManager {
    constructor()
    {
        this.systems = [];
    } // end constructor

    get(id)
    {
        return _.find(this.systems, { id });
    } // end get

    register(id, name, description, router)
    {
        this.systems.push({ id, name, description, router });
        this.systems = _.uniq(this.systems, 'id');
    } // end registerSystem
    
    buildGeneralEndpoints(router, models)
    {
        router.get('/character/:charID', (req, resp) =>
        {
            models.Character.get(req.params.charID)
                .then((character) =>
                {
                    resp.json(character);
                })
                .catch(models.errors.DocumentNotFound, (error) =>
                {
                    resp.status(404).json({
                        human: "Character not found.",
                        message: error.message,
                        stack: error.stack
                    });
                });
        });

        router.put('/character/:charID', (req, resp) =>
        {
            if(req.isAuthenticated())
            {
                models.Character.get(req.params.charID)
                    .then((character) =>
                    {
                        _.assign(character, req.body);
                        character.$save().then(() => { resp.json(character); });
                    })
                    .catch(models.errors.DocumentNotFound, (error) =>
                    {
                        resp.status(404).json({
                            human: "Character not found.",
                            message: error.message,
                            stack: error.stack
                        });
                    })
                    .catch((error) =>
                    {
                        resp.status(500).json({
                            human: "Cannot save character.",
                            message: error.message,
                            stack: error.stack
                        });
                    });
            }
            else
            {
                resp.status(403).end();
            } // end if
        });
    } // end buildGeneralEndpoints
} // end SystemManager

//----------------------------------------------------------------------------------------------------------------------

export default new SystemManager();

//----------------------------------------------------------------------------------------------------------------------