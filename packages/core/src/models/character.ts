//----------------------------------------------------------------------------------------------------------------------
// Character
//----------------------------------------------------------------------------------------------------------------------

export type SystemDetails = object;

/**
 * Base character interface. The `id` is optional for new characters that haven't been saved yet.
 */
export interface Character<Details extends SystemDetails = SystemDetails>
{
    id ?: string;
    system : string;
    name : string;
    description ?: string;
    portrait ?: string;
    thumbnail ?: string;
    color ?: string;
    campaign ?: string;
    accountID : string;
    noteID : string;
    details : Details;
    created : number;
    updated : number;
}

/**
 * A character that has been persisted to the database. The `id` is guaranteed to exist.
 */
export interface SavedCharacter<Details extends SystemDetails = SystemDetails>
    extends Omit<Character<Details>, 'id'>
{
    id : string;
}

//----------------------------------------------------------------------------------------------------------------------
