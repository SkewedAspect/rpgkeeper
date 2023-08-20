//----------------------------------------------------------------------------------------------------------------------
// Character
//----------------------------------------------------------------------------------------------------------------------

export type SystemDetails = Record<string, unknown>;

export interface CharacterOptions<Details extends SystemDetails = SystemDetails> {
    id : string | null;
    system : string;
    name : string;
    description ?: string;
    portrait ?: string;
    thumbnail ?: string;
    color ?: string;
    campaign ?: string;
    accountID : string;
    noteID : string;
    details : Details
}

//----------------------------------------------------------------------------------------------------------------------
