//----------------------------------------------------------------------------------------------------------------------
// Custom errors
//
// @module error.js
//----------------------------------------------------------------------------------------------------------------------

import { BaseError } from 'make-error';

//----------------------------------------------------------------------------------------------------------------------

class NotImplementedError extends BaseError
{
    constructor(api)
    {
        super(`'${api}' is not implemented.`);
    } // end constructor
} // end NotImplemented Error

//----------------------------------------------------------------------------------------------------------------------

class LoginFailureError extends BaseError
{
    constructor(email)
    {
        super(`Failed to login with email: '${email}'.`);
        this.email = email;
    } // end constructor
} // end LoginFailureError

//----------------------------------------------------------------------------------------------------------------------

class UserExistsError extends BaseError
{
    constructor(email)
    {
        super(`A user with the email ${email} already exists.`);
        this.email = email;
    } // end constructor
} // end UserExistsError

//----------------------------------------------------------------------------------------------------------------------

class PasswordMismatchError extends BaseError
{
    constructor()
    {
        super('The supplied passwords do no match.');
    } // end constructor
} // end PasswordMismatchError

//----------------------------------------------------------------------------------------------------------------------

class CaptchaValidationError extends BaseError
{
    constructor()
    {
        super('The user failed to pass the captcha.');
    } // end constructor
} // end CaptchaValidationError

//----------------------------------------------------------------------------------------------------------------------

class TokenValidationError extends BaseError
{
    constructor(token)
    {
        super(`The reset token is invalid, or expired: '${ token }'.`);
        this.token = token;
    } // end constructor
} // end TokenValidationError

//----------------------------------------------------------------------------------------------------------------------

export default {
    NotImplemented: NotImplementedError,
    LoginFailure: LoginFailureError,
    UserExists: UserExistsError,
    PasswordMismatch: PasswordMismatchError,
    CaptchaValidation: CaptchaValidationError,
    TokenValidation: TokenValidationError
};

//----------------------------------------------------------------------------------------------------------------------