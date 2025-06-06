//----------------------------------------------------------------------------------------------------------------------
// Custom errors
//----------------------------------------------------------------------------------------------------------------------

export class AppError extends Error
{
    public code : string;
    public statusCode : number;

    constructor(message : string, code ?: string, name ?: string)
    {
        // Calling parent constructor of base Error class.
        super(message);

        // Saving class name in the property of our custom error as a shortcut.
        this.name = name ?? this.constructor.name;

        // Capturing stack trace, excluding constructor call from it.
        if(Error.captureStackTrace)
        {
            Error.captureStackTrace(this, this.constructor);
        }

        // Set a code property to allow the error to be easily identified. This is in keeping with current nodejs.
        this.code = code ? code : 'ERR_APPLICATION_ERROR';

        // A status code for returning via rest.
        this.statusCode = 500;
    }

    static fromJSON({ name, message, code } : { name : string, message : string, code : string }) : AppError
    {
        return new AppError(message, code, name);
    }

    toJSON() : Record<string, unknown>
    {
        return { name: this.name, message: this.message, code: this.code };
    }
}

//----------------------------------------------------------------------------------------------------------------------

export class NotFoundError extends AppError
{
    constructor(message : string)
    {
        super(message, 'ERR_NOT_FOUND');

        this.statusCode = 404;
    }
}

//----------------------------------------------------------------------------------------------------------------------

export class NotImplementedError extends AppError
{
    constructor(api : string)
    {
        super(`'${ api }' is not implemented.`, 'ERR_NOT_IMPLEMENTED');

        this.statusCode = 403;
    }
}

//----------------------------------------------------------------------------------------------------------------------

export class DuplicateSupplementError extends AppError
{
    public supplement : string;

    constructor(supplement : string)
    {
        super(`A supplement with the same name, scope, and owner already exists.`, 'ERR_DUPLICATE_SUPPLEMENT');

        this.statusCode = 422;
        this.supplement = supplement;
    }

    toJSON() : Record<string, unknown>
    {
        return {
            ...super.toJSON(),
            supplement: this.supplement,
        };
    }
}

//----------------------------------------------------------------------------------------------------------------------

export class MultipleResultsError extends AppError
{
    constructor(thing : string)
    {
        super(`More than one ${ thing } returned. This should not be possible.`, 'ERR_MULTIPLE_RESULTS');

        this.statusCode = 422;
    }
}

//----------------------------------------------------------------------------------------------------------------------

export class DecoderError extends AppError
{
    constructor(reason : string)
    {
        super(reason, 'ERR_DECODE_FAILED');

        this.statusCode = 422;
    }
}

//----------------------------------------------------------------------------------------------------------------------

export class MissingDecoderError extends AppError
{
    constructor(thing : string)
    {
        super(`Missing decoder for '${ thing }.`, 'ERR_MISSING_DECODER');

        this.statusCode = 501;
    }
}

//----------------------------------------------------------------------------------------------------------------------

export class NotAuthorizedError extends AppError
{
    public operation : string;
    public thing : string;

    constructor(operation : string, thing : string)
    {
        super(`You are not authorized to ${ operation } '${ thing }.`, 'ERR_NOT_AUTHORIZED');

        this.statusCode = 403;
        this.operation = operation;
        this.thing = thing;
    }

    toJSON() : Record<string, unknown>
    {
        return {
            ...super.toJSON(),
            operation: this.operation,
            thing: this.thing,
        };
    }
}

//----------------------------------------------------------------------------------------------------------------------
