//----------------------------------------------------------------------------------------------------------------------
// Custom errors
//----------------------------------------------------------------------------------------------------------------------

class AppError extends Error
{
    constructor (message, code, name)
    {
        // Calling parent constructor of base Error class.
        super(message);

        // Saving class name in the property of our custom error as a shortcut.
        this.name = name || this.constructor.name;

        // Capturing stack trace, excluding constructor call from it.
        if(Error.captureStackTrace)
        {
            Error.captureStackTrace(this, this.constructor);
        } // end if

        // Set a code property to allow the error to be easily identified. This is in keeping with current nodejs.
        this.code = !!code ? code : 'ERR_APPLICATION_ERROR';

        // A status code for returning via rest.
        this.statusCode = 500;
    } // end constructor

    static fromJSON({ name, message, code })
    {
        return new AppError(message, code, name);
    } // end fromJSON

    toJSON()
    {
        return { name: this.name, message: this.message, code: this.code };
    } // end toJSON
} // end AppError

//----------------------------------------------------------------------------------------------------------------------

class NotFoundError extends AppError
{
    constructor(message)
    {
        super(message, 'ERR_NOT_FOUND');

        this.statusCode = 404;
    } // end constructor
} // end NotFoundError

//----------------------------------------------------------------------------------------------------------------------

class NotImplementedError extends AppError
{
    constructor(api)
    {
        super(`'${api}' is not implemented.`, 'ERR_NOT_IMPLEMENTED');

        this.statusCode = 403;
    } // end constructor
} // end NotImplemented Error

//----------------------------------------------------------------------------------------------------------------------

class MultipleResultsError extends AppError
{
    constructor(thing)
    {
        super(`More than one ${ thing } returned. This should not be possible.`, 'ERR_MULTIPLE_RESULTS');

        this.statusCode = 422;
    } // end constructor
} // end MultipleResultsError

//----------------------------------------------------------------------------------------------------------------------

class ValidationError extends AppError
{
    constructor(prop, reason)
    {
        super(`Validation failed for '${ prop }': ${ reason }.`, 'ERR_VALIDATION_FAILED');

        this.statusCode = 422;
    } // end constructor
} // end ValidationError

//----------------------------------------------------------------------------------------------------------------------

class AjvValidationError extends AppError
{
    constructor(errors)
    {
        let errorMessage = `ValidationError: ${ errors[0].error.trim() }.`;
        if(errors[0].suggestion)
        {
            errorMessage += ` ${ errors[0].suggestion }`;
        } // end of

        super(errorMessage, 'ERR_VALIDATION_FAILED');

        this.errors = errors;
        this.statusCode = 422;
    } // end constructor

    toJSON()
    {
        return {
            name: this.name,
            message: this.message,
            code: this.code,
            validationErrors: this.errors
        };
    } // end toJSON
} // end AjvValidationError

//----------------------------------------------------------------------------------------------------------------------

module.exports = {
    AppError,
    NotFoundError,
    NotImplementedError,
    MultipleResultsError,
    ValidationError,
    AjvValidationError
};

//----------------------------------------------------------------------------------------------------------------------
