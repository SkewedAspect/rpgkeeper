//----------------------------------------------------------------------------------------------------------------------
// Account
//----------------------------------------------------------------------------------------------------------------------

export interface AccountSettings 
{
    colorMode ?: 'light' | 'dark' | 'auto';
}

export interface AccountOptions 
{
    id : string;
    email : string;
    name ?: string;
    avatar ?: string;
    permissions ?: string[];
    groups ?: string[];
    settings ?: AccountSettings;
}

// FIXME: Once Models are removed, `AccountOptions` should be named 'Account'.
export type Account = AccountOptions;

export type NewAccount = Omit<Account, 'id'>;

//----------------------------------------------------------------------------------------------------------------------
