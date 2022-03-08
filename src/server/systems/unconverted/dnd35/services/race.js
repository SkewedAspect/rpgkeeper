//----------------------------------------------------------------------------------------------------------------------
// RaceService
//----------------------------------------------------------------------------------------------------------------------

import $http from 'axios';

//----------------------------------------------------------------------------------------------------------------------

class RaceService
{
    constructor()
    {
        this._races = {};
    }

    get(raceID, reload)
    {
        const race = this._races[raceID];
        if(reload || !race)
        {
            return $http.get(`/systems/dnd35/races/${ raceID }`)
                .then((response) =>
                {
                    this._races[raceID] = response.data;

                    return response.data;
                })
                .catch((error) =>
                {
                    if(error.status == 404)
                    {
                        console.error(`Race with id '${ raceID }' not found.`);
                    }
                    else
                    {
                        console.error('Error getting race:', error);
                    }
                });
        }
        else
        {
            return Promise.resolve(race);
        }
    }
}

//----------------------------------------------------------------------------------------------------------------------

export default new RaceService();

//----------------------------------------------------------------------------------------------------------------------
