// ---------------------------------------------------------------------------------------------------------------------
// Genesys Store
// ---------------------------------------------------------------------------------------------------------------------

import { defineStore } from 'pinia';

// Models
import type * as GenesysModels from '@rpgk/core/models/systems/eote';
import type { Supplement } from '@rpgk/core/models/systems';
import type { Reference } from '@rpgk/core/models/reference';

// Resource Access
import suppRA from '../../supplement';

// ---------------------------------------------------------------------------------------------------------------------

type GenesysSuppTypes = 'abilities' | 'armors' | 'attachments' | 'gear' | 'motivations' | 'qualities'
    | 'talents' | 'weapons' | 'references';

export interface GenesysStoreState
{
    abilities : GenesysModels.GenesysAbility[];
    armors : GenesysModels.GenesysArmor[];
    attachments : GenesysModels.GenesysAttachment[];
    gear : GenesysModels.GenesysGear[];
    motivations : GenesysModels.GenesysMotivation[];
    qualities : GenesysModels.GenesysQuality[];
    talents : GenesysModels.GenesysTalent[];
    weapons : GenesysModels.GenesysWeapon[];
    references : Reference[];
}

// ---------------------------------------------------------------------------------------------------------------------

export const useGenesysStore = defineStore('genesys', {
    state() : GenesysStoreState
    {
        return {
            abilities: [],
            armors: [],
            attachments: [],
            gear: [],
            qualities: [],
            motivations: [],
            talents: [],
            weapons: [],
            references: [],
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
                motivations,
                talents,
                weapons,
                references,
            ] = await Promise.all([
                await suppRA.list<GenesysModels.GenesysAbility>('genesys', 'abilities'),
                await suppRA.list<GenesysModels.GenesysArmor>('genesys', 'armor'),
                await suppRA.list<GenesysModels.GenesysAttachment>('genesys', 'attachments'),
                await suppRA.list<GenesysModels.GenesysGear>('genesys', 'gear'),
                await suppRA.list<GenesysModels.GenesysQuality>('genesys', 'qualities'),
                await suppRA.list<GenesysModels.GenesysMotivation>('genesys', 'motivations'),
                await suppRA.list<GenesysModels.GenesysTalent>('genesys', 'talents'),
                await suppRA.list<GenesysModels.GenesysWeapon>('genesys', 'weapons'),
                await suppRA.listReferences('genesys'),
            ]);

            this.abilities = abilities;
            this.armor = armor;
            this.attachment = attachments;
            this.gear = gear;
            this.qualities = qualities;
            this.motivations = motivations;
            this.talents = talents;
            this.weapons = weapons;
            this.references = references;
        },
        add(type : GenesysSuppTypes, supp : Supplement) : void
        {
            this[type].push(supp);
        },
        update(type : GenesysSuppTypes, supp : Supplement) : void
        {
            let suppIdx = this[type].findIndex((item) => `${ item.id }` === `${ supp.id }`);
            if(suppIdx === -1)
            {
                suppIdx = this[type].length;
            }

            this[type].splice(suppIdx, 1, supp);
        },
        remove(type : GenesysSuppTypes, supp : { id : string }) : void
        {
            const suppIdx = this[type].findIndex((item) => `${ item.id }` === `${ supp.id }`);
            if(suppIdx !== -1)
            {
                this[type].splice(suppIdx, 1);
            }
        },
    },
});

// ---------------------------------------------------------------------------------------------------------------------
