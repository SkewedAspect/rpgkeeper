// ---------------------------------------------------------------------------------------------------------------------
// Custom Errors
// ---------------------------------------------------------------------------------------------------------------------

interface JSONErrorObject
{
    name : string;
    code : string;
    message : string;
}

// ---------------------------------------------------------------------------------------------------------------------

export class JSONAbleError extends Error
{
    public code : string;

    constructor(message : string, code : string)
    {
        super(message);
        this.code = code;
    }

    toJSON() : JSONErrorObject
    {
        return {
            name: this.constructor.name,
            code: this.code,
            message: this.message,
        };
    }
}

// ---------------------------------------------------------------------------------------------------------------------

export class InvalidCharacterError extends JSONAbleError
{
    charID : string | null;

    constructor(charID : string | null, errorMsg : string)
    {
        super(`Invalid Character: ${ errorMsg }`, 'invalid-char');
        this.charID = charID;
    }

    toJSON() : JSONErrorObject & { charID : string | null }
    {
        return {
            ...super.toJSON(),
            charID: this.charID,
        };
    }
}

// ---------------------------------------------------------------------------------------------------------------------

export class CharacterSaveError extends JSONAbleError
{
    charID : string | null;

    constructor(charID : string | null, errorMsg : string)
    {
        super(`Failed to save character: ${ errorMsg }`, 'char-save');
        this.charID = charID;
    }

    toJSON() : JSONErrorObject & { charID : string | null }
    {
        return {
            ...super.toJSON(),
            charID: this.charID,
        };
    }
}

// ---------------------------------------------------------------------------------------------------------------------
