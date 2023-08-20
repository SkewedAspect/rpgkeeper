// ---------------------------------------------------------------------------------------------------------------------
// Eote Store
// ---------------------------------------------------------------------------------------------------------------------

import { defineStore } from 'pinia';

// Models
import * as EoteModels from '../../../../common/interfaces/systems/eote';
import { Reference, Supplement } from '../../../../common/interfaces/systems/supplements';

// Resource Access
import suppRA from '../../resource-access/supplement';

// ---------------------------------------------------------------------------------------------------------------------

type EoteSuppTypes = 'abilities' | 'armors' | 'attachments' | 'forcepowers' | 'gear' | 'qualities'
    | 'talents' | 'weapons' | 'references';

export interface EoteStoreState
{
    abilities : EoteModels.EoteAbility[];
    armors : EoteModels.EoteArmor[];
    attachments : EoteModels.EoteAttachment[];
    forcePowers : EoteModels.EoteForcePower[];
    gear : EoteModels.EoteGear[];
    qualities : EoteModels.EoteQuality[];
    talents : EoteModels.EoteTalent[];
    weapons : EoteModels.EoteWeapon[];
    references : Reference[];
}

// ---------------------------------------------------------------------------------------------------------------------

export const useEoteStore = defineStore('eote', {
    state() : EoteStoreState
    {
        return {
            abilities: [],
            armors: [],
            attachments: [],
            forcePowers: [],
            gear: [],
            qualities: [],
            talents: [],
            weapons: [],
            references: []
        };
    },
    actions: {
        async load() : Promise<void>
        {
            this.$reset();

            // Load supplements in parallel.
            const [
                abilities,
                armor,
                attachments,
                gear,
                qualities,
                talents,
                weapons,
                forcepowers,
                references
            ] = await Promise.all([
                await suppRA.list<EoteModels.EoteAbility>('eote', 'abilities'),
                await suppRA.list<EoteModels.EoteArmor>('eote', 'armor'),
                await suppRA.list<EoteModels.EoteAttachment>('eote', 'attachments'),
                await suppRA.list<EoteModels.EoteGear>('eote', 'gear'),
                await suppRA.list<EoteModels.EoteQuality>('eote', 'qualities'),
                await suppRA.list<EoteModels.EoteTalent>('eote', 'talents'),
                await suppRA.list<EoteModels.EoteWeapon>('eote', 'weapons'),
                await suppRA.list<EoteModels.EoteForcePower>('eote', 'forcepowers'),
                await suppRA.listReferences('eote')
            ]);

            this.abilities = abilities;
            this.armor = armor;
            this.attachment = attachments;
            this.gear = gear;
            this.qualities = qualities;
            this.talents = talents;
            this.weapons = weapons;
            this.forcePowers = forcepowers;
            this.references = references;
        },
        add(type : EoteSuppTypes, supp : Supplement) : void
        {
            this[type].push(supp);
        },
        update(type : EoteSuppTypes, supp : Supplement) : void
        {
            let suppIdx = this[type].findIndex((item) => `${ item.id }` === `${ supp.id }`);
            if(suppIdx === -1)
            {
                suppIdx = this[type].length;
            }

            this[type].splice(suppIdx, 1, supp);
        },
        remove(type : EoteSuppTypes, supp : { id : string }) : void
        {
            const suppIdx = this[type].findIndex((item) => `${ item.id }` === `${ supp.id }`);
            if(suppIdx !== -1)
            {
                this[type].splice(suppIdx, 1);
            }
        }
    }
});

// ---------------------------------------------------------------------------------------------------------------------
