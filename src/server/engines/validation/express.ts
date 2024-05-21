// ---------------------------------------------------------------------------------------------------------------------
// Express Validation Tools
// ---------------------------------------------------------------------------------------------------------------------

import { Request, Response, NextFunction } from 'express';

import { fromError } from 'zod-validation-error';

// ---------------------------------------------------------------------------------------------------------------------

export function validationErrorHandler(err : any, req : Request, res : Response, next : NextFunction) : void
{
    if(Array.isArray(err))
    {
        const errors = err.map((errObj) =>
        {
            return {
                ...errObj,
                errors: fromError(errObj.errors)
            };
        });

        if(errors.length > 0)
        {
            const errorMsg = errors.map((errObj) =>
            {
                return `${ errObj.type }: ${ errObj.errors.toString() }`;
            });

            res.status(422).json({
                message: `Request Validation Failed: ${ errorMsg.join('\n') }`,
                errors
            });

            // Return to not call next
            return;
        }
    }

    next(err);
}

// ---------------------------------------------------------------------------------------------------------------------
