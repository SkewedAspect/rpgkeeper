//----------------------------------------------------------------------------------------------------------------------
// CampaignResourceAccess
//----------------------------------------------------------------------------------------------------------------------

import axios from 'axios';

// Models
import { Campaign } from '../../../common/models';

//----------------------------------------------------------------------------------------------------------------------

class CampaignResourceAccess
{
    async list(email ?: string) : Promise<Campaign[]>
    {
        const { data } = await axios.get('/api/campaign', { params: { account: email } });
        return data;
    }

    async get(id : string) : Promise<Campaign>
    {
        const { data } = await axios.get(`/api/campaign/${ id }`);
        return data;
    }

    async create(campaign : Campaign) : Promise<Campaign>
    {
        const { data } = await axios.post('/api/campaign', campaign);
        return data;
    }

    async update(campaign : Campaign) : Promise<Campaign>
    {
        const { data } = await axios.put(`/api/campaign/${ campaign.id }`, campaign);
        return data;
    }

    // TODO: Add methods for adding and removing campaign members, notes, and characters

    async delete(id : string) : Promise<void>
    {
        await axios.delete(`/api/campaign/${ id }`);
    }
}

//----------------------------------------------------------------------------------------------------------------------

export default new CampaignResourceAccess();

//----------------------------------------------------------------------------------------------------------------------
