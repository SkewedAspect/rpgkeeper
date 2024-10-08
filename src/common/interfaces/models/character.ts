//----------------------------------------------------------------------------------------------------------------------
// Character
//----------------------------------------------------------------------------------------------------------------------

export type SystemDetails = object;

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

// FIXME: Once Models are removed, `CharacterOptions` should be named 'Character'.
export type Character<Details extends SystemDetails = SystemDetails> = CharacterOptions<Details>;

//----------------------------------------------------------------------------------------------------------------------
