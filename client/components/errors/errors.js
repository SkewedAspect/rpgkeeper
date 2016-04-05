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

export default {
    NotImplemented: NotImplementedError,
    LoginFailure: LoginFailureError
};

//----------------------------------------------------------------------------------------------------------------------