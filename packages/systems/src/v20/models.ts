//----------------------------------------------------------------------------------------------------------------------
// Vampire: The Masquerade 20th Anniversary Edition Models
//----------------------------------------------------------------------------------------------------------------------

export interface V20SystemDetails
{
    nature : string;
    demeanor : string;
    concept : string;
    clan : string;
    generation : number;
    sire : string;

    // Attributes - Physical
    strength : number;
    dexterity : number;
    stamina : number;

    // Attributes - Social
    charisma : number;
    manipulation : number;
    appearance : number;

    // Attributes - Mental
    perception : number;
    intelligence : number;
    wits : number;

    // TODO: Add Abilities (Talents, Skills, Knowledges)
    // TODO: Add Advantages (Disciplines, Backgrounds, Virtues)
    // TODO: Add Other traits (Humanity, Willpower, Blood Pool)
}

//----------------------------------------------------------------------------------------------------------------------
