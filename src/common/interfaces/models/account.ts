//----------------------------------------------------------------------------------------------------------------------
// Account
//----------------------------------------------------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AccountSettings {
    // TODO: Figure out some settings...
}

export interface AccountOptions {
    id : string;
    email : string;
    name ?: string;
    avatar ?: string;
    permissions ?: string[];
    groups ?: string[];
    settings ?: AccountSettings;
}

//----------------------------------------------------------------------------------------------------------------------
