// ---------------------------------------------------------------------------------------------------------------------
// character.ts
// ---------------------------------------------------------------------------------------------------------------------

export interface CharacterDetails {
    [ key : string ] : unknown;
}

export interface Character {
    id : string;
    system : string;
    name : string;
    description : string;
    portrait : string;
    thumbnail : string;
    color : string;
    details : CharacterDetails;
    // eslint-disable-next-line camelcase
    note_id : number;
    // eslint-disable-next-line camelcase
    account_id : number;
    campaign : string;
    created : Date;
}

// ---------------------------------------------------------------------------------------------------------------------
