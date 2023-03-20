//----------------------------------------------------------------------------------------------------------------------
// EotEManager
//----------------------------------------------------------------------------------------------------------------------

import { XOR } from 'ts-essentials';

// Interfaces
import * as Models from '../../../../common/interfaces/systems/eote';
import { Reference, Supplement } from '../../../../common/interfaces/systems/supplements';

// Stores
import { useEoteStore } from '../../stores/systems/eote';
import { useGenesysStore } from '../../stores/systems/genesys';
import { InvalidCharacterError } from '../../error';

// Resource Access
import suppRA from '../../resource-access/supplement';

//----------------------------------------------------------------------------------------------------------------------

type EoteSystemMode = 'eote' | 'genesys';
type SuppTypes = 'abilities' | 'armors' | 'attachments' | 'forcepowers' | 'gear' | 'qualities'
    | 'talents' | 'weapons' | 'motivations' | 'references';

type Ability = Models.EoteAbility | Models.GenesysAbility;
type Armor = Models.EoteArmor | Models.GenesysArmor;
type Attachment = XOR<Models.EoteAttachment, Models.GenesysAttachment>;
type Gear = Models.EoteGear | Models.GenesysGear;
type Quality = Models.EoteQuality | Models.GenesysQuality;
type Talent = Models.EoteTalent | Models.GenesysTalent;
type Weapon = Models.EoteWeapon | Models.GenesysWeapon;

type ForcePower = Models.EoteForcePower;
type Motivation = Models.GenesysMotivation;

//----------------------------------------------------------------------------------------------------------------------

class EotEManager
{
    mode : EoteSystemMode = 'eote';

    /* eslint-disable id-length */
    readonly rangeEnum = {
        en: 'Engaged',
        s: 'Short',
        m: 'Medium',
        l: 'Long',
        ex: 'Extreme'
    };

    readonly activationEnum = {
        p: 'Passive',
        ai: 'Active (Incidental)',
        aio: 'Active (Incidental, Out of Turn)',
        am: 'Active (Maneuver)',
        aa: 'Active (Action)'
    };
    /* eslint-enable id-length */

    //------------------------------------------------------------------------------------------------------------------
    // Properties
    //------------------------------------------------------------------------------------------------------------------

    get abilities() : Ability[]
    {
        const store = this.mode === 'eote' ? useEoteStore() : useGenesysStore();
        return store.abilities;
    }

    get armors() : Armor[]
    {
        const store = this.mode === 'eote' ? useEoteStore() : useGenesysStore();
        return store.armors;
    }

    get attachments() : Attachment[]
    {
        const store = this.mode === 'eote' ? useEoteStore() : useGenesysStore();
        return store.attachments;
    }

    get gear() : Gear[]
    {
        const store = this.mode === 'eote' ? useEoteStore() : useGenesysStore();
        return store.gear;
    }

    get qualities() : Quality[]
    {
        const store = this.mode === 'eote' ? useEoteStore() : useGenesysStore();
        return store.qualities;
    }

    get talents() : Talent[]
    {
        const store = this.mode === 'eote' ? useEoteStore() : useGenesysStore();
        return store.talents;
    }

    get weapons() : Weapon[]
    {
        const store = this.mode === 'eote' ? useEoteStore() : useGenesysStore();
        return store.weapons;
    }

    get references() : Reference[]
    {
        const store = this.mode === 'eote' ? useEoteStore() : useGenesysStore();
        return store.references;
    }

    // EotE Specific
    get forcePowers() : ForcePower[]
    {
        if(this.mode === 'eote')
        {
            const store = useEoteStore();
            return store.forcePowers;
        }

        return [];
    }

    // Genesys Specific
    get motivations() : Motivation[]
    {
        if(this.mode === 'genesys')
        {
            const store = useGenesysStore();
            return store.motivations;
        }

        return [];
    }

    //------------------------------------------------------------------------------------------------------------------
    // Public API
    //------------------------------------------------------------------------------------------------------------------

    async load(character) : Promise<void>
    {
        if(![ 'eote', 'genesys' ].includes(character.system))
        {
            throw new InvalidCharacterError(character.id, 'Invalid character system for EotE/Genesys system.');
        }

        // Set the mode
        this.mode = character.system;

        // Pick the right store to load
        const store = this.mode === 'eote' ? useEoteStore() : useGenesysStore();
        store.load();
    }

    async addSup<Supp extends Supplement = Supplement>(type : SuppTypes, supp : Supp) : Promise<Supp>
    {
        const newSupp = await suppRA.add<Supp>(this.mode, type, supp);

        // Note: The code repetition is caused by TypeScript not limiting `type` correctly.
        if(this.mode === 'eote')
        {
            const store = useEoteStore();
            if(type === 'motivations')
            {
                throw new Error(`Cannot add motivations when mode is 'eote'.`);
            }

            store.add(type, newSupp);
        }
        else
        {
            const store = useGenesysStore();
            if(type === 'forcepowers')
            {
                throw new Error(`Cannot add motivations when mode is 'genesys'.`);
            }

            store.add(type, newSupp);
        }

        return newSupp;
    }

    async editSup<Supp extends Supplement = Supplement>(type : SuppTypes, supp : Supp) : Promise<Supp>
    {
        const newSupp = await suppRA.update<Supp>(this.mode, type, supp);

        // Note: The code repetition is caused by TypeScript not limiting `type` correctly.
        if(this.mode === 'eote')
        {
            const store = useEoteStore();
            if(type === 'motivations')
            {
                throw new Error(`Cannot update motivations when mode is 'eote'.`);
            }

            store.update(type, newSupp);
        }
        else
        {
            const store = useGenesysStore();
            if(type === 'forcepowers')
            {
                throw new Error(`Cannot update motivations when mode is 'genesys'.`);
            }

            store.update(type, newSupp);
        }

        return newSupp;
    }

    async delSup(type : SuppTypes, supp : { id : string }) : Promise<void>
    {
        if(supp.id)
        {
            // ToDo: convert supplements to have id be a string.
            await suppRA.delete(this.mode, type, `${ supp.id }`);

            // Note: The code repetition is caused by TypeScript not limiting `type` correctly.
            if(this.mode === 'eote')
            {
                const store = useEoteStore();
                if(type === 'motivations')
                {
                    throw new Error(`Cannot delete motivations when mode is 'eote'.`);
                }

                store.remove(type, supp);
            }
            else
            {
                const store = useGenesysStore();
                if(type === 'forcepowers')
                {
                    throw new Error(`Cannot delete motivations when mode is 'genesys'.`);
                }

                store.remove(type, supp);
            }
        }
    }
}

//----------------------------------------------------------------------------------------------------------------------

export default new EotEManager();

//----------------------------------------------------------------------------------------------------------------------
