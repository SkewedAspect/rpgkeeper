// ---------------------------------------------------------------------------------------------------------------------
// Express Validation Tools
// ---------------------------------------------------------------------------------------------------------------------

import { z } from 'zod';
import { fromError } from 'zod-validation-error';
import { NextFunction, Request, Response } from 'express';

// ---------------------------------------------------------------------------------------------------------------------

interface ProcessRequestSchema
{
    params ?: z.ZodObject<any>;
    query ?: z.ZodObject<any>;
    body ?: z.ZodObject<any>;

}

export function processRequest(schema : ProcessRequestSchema) : any
{
    return async function(req : Request, res : Response, next : NextFunction) : Promise<void>
    {
        const errors : any[] = [];

        // Process the params, query, and body of the request, replacing them with the validated values.
        try
        {
            if(schema.params)
            {
                const paramResults = schema.params.safeParse(req.params);
                if(paramResults.success)
                {
                    req.params = paramResults.data as typeof req.params;
                }
                else
                {
                    errors.push({ type: 'Params', errors: paramResults.error });
                }
            }

            // Express 5.x has req.query as getter only, so we have to do some shenanigans to modify it
            if(schema.query)
            {
                // Parse the query parameters
                const queryResults = schema.query.safeParse(req.query);

                if(queryResults.success)
                {
                    // Delete all existing properties from req.query
                    for(const key in req.query)
                    {
                        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
                        delete req.query[key];
                    }

                    // Copy the validated properties to req.query
                    for(const key in queryResults.data)
                    {
                        req.query[key] = queryResults.data[key] as typeof req.query[typeof key];
                    }
                }
                else
                {
                    errors.push({ type: 'Query', errors: queryResults.error });
                }
            }

            if(schema.body)
            {
                const bodyResults = schema.body.safeParse(req.body);
                if(bodyResults.success)
                {
                    req.body = bodyResults.data;
                }
                else
                {
                    errors.push({ type: 'Body', errors: bodyResults.error });
                }
            }

            if(errors.length > 0)
            {
                next(errors);
            }
            else
            {
                next();
            }
        }
        catch (err)
        {
            next(err);
        }
    };
}

export function validationErrorHandler(err : any, req : Request, res : Response, next : NextFunction) : void
{
    if(Array.isArray(err))
    {
        const errors = err.map((errObj) =>
        {
            return {
                ...errObj,
                errors: fromError(errObj.errors),
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
                errors,
            });

            // Return to not call next
            return;
        }
    }

    next(err);
}

// ---------------------------------------------------------------------------------------------------------------------
