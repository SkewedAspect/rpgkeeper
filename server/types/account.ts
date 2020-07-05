// ---------------------------------------------------------------------------------------------------------------------
// account.ts
// ---------------------------------------------------------------------------------------------------------------------

export interface Role {
    roleID : number;
    name : string;
    permissions : string[];
}

export interface Account {
    id : string;
    // eslint-disable-next-line camelcase
    account_id : number;
    email : string;
    name : string;
    avatar : string;
    permissions : string[];
    groups ?: string[]
    settings : Record<string, unknown>;
    created : Date;
}

// ---------------------------------------------------------------------------------------------------------------------
