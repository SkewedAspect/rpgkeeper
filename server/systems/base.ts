//----------------------------------------------------------------------------------------------------------------------
// BaseSystem
//----------------------------------------------------------------------------------------------------------------------

import { SupplementValidationPath } from '../types/supplements';

//----------------------------------------------------------------------------------------------------------------------

export const enum SupportStatus
{
    InDevelopment = 'dev',
    PublicBeta = 'beta',
    Disabled = 'disabled'
}

//----------------------------------------------------------------------------------------------------------------------

export class BaseSystem
{
    public readonly id : string;
    public readonly name : string;
    public readonly description : string;
    public readonly defaults : Record<string, unknown>;
    public readonly supplementPaths : SupplementValidationPath[];
    public readonly status ?: SupportStatus;

    constructor(
        id : string,
        name : string,
        description : string,
        defaults : Record<string, unknown> = {},
        suppPaths : SupplementValidationPath[] = [],
        status ?: SupportStatus
    )
    {
        this.id = id;
        this.name = name;
        this.description = description;
        this.defaults = defaults;
        this.supplementPaths = suppPaths;
        this.status = status;
    } // end constructor

    //------------------------------------------------------------------------------------------------------------------
    // API
    //------------------------------------------------------------------------------------------------------------------

    async init() : Promise<void>
    {
        /* No work to do here! */
    } // end init

    toJSON() : Record<string, unknown>
    {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            defaults: this.defaults,
            supplementPaths: this.supplementPaths,
            status: this.status
        };
    } // end toJSON
} // end BaseSystem

//----------------------------------------------------------------------------------------------------------------------
