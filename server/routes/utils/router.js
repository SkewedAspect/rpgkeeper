//----------------------------------------------------------------------------------------------------------------------
// Utilities to make express routes use less boilerplate.
//----------------------------------------------------------------------------------------------------------------------

const fs = require('fs');
const path = require('path');

//----------------------------------------------------------------------------------------------------------------------

// Basic request logging
function buildBasicRequestLogger(logger)
{
    return (request, response, next) =>
    {
        logger.debug(`${ request.method } '${ request.url }'`);
        next();
    }; // end loggerFunc
} // end buildBasicRequestLogger

// Basic error logging
function buildBasicErrorLogger(logger)
{
    return (error, request, response, next) =>
    {
        logger.child({
            request: {
                id: request.id,
                method: request.method,
                url: request.url,
                body: request.body,
                query: request.query
            }
        }).error(`${ request.method } ${ response.statusCode } '${ request.url }': Error encountered: \n${ error.stack }`, error);

        next(error);
    }; // end loggerFunc
} // end buildBasicErrorLogger

function buildErrorHandler(logger)
{
    function apiErrorHandler(error, request, response, next)
    {
        let errorJSON = {};
        if(typeof error.toJSON == 'function')
        {
            errorJSON = error.toJSON();
        }
        else
        {
            errorJSON = {
                name: error.constructor.name,
                message: error.message,
                code: error.code,
                error: error
            };
        } // end if

        response.status(500).json(errorJSON);
    } // end apiErrorHandler

    if(logger)
    {
        return (error, request, response, next) =>
        {
            buildBasicErrorLogger(logger)(error, request, response, () =>
            {
                apiErrorHandler(error, request, response, next);
            });
        };
    }
    else
    {
        return apiErrorHandler;
    } // end if
} // end buildErrorHandler

// Serve index
function serveIndex(request, response)
{
    response.setHeader("Content-Type", "text/html");
    fs.createReadStream(path.resolve(__dirname, '..', '..', '..', 'dist', 'index.html')).pipe(response);
} // end serveIndex

// Either serve 'index.html', or run json handler
function interceptHTML(response, jsonHandler, skipAuthCheck)
{
    response.format({
        html: serveIndex,
        json: (request, response) => {

            if(!skipAuthCheck || request.isAuthenticated())
            {
                jsonHandler(request, response);
            }
            else
            {
                response.status(401).json({
                    name: 'NotAuthorized',
                    message: `Not authorized.`
                });
            } // end if
        }
    });
} // end interceptHTML

function ensureAuthenticated(request, response, next)
{
    if(request.isAuthenticated())
    {
        next();
    }
    else
    {
        response.status(401).json({
            name: 'NotAuthorized',
            message: `Not authorized.`
        });
    } // end if
} // end ensureAuthenticated

//TODO: Remove usages of this in favor of `wrapAsync` and `errorHandler`.
function promisify(handler)
{
    return (request, response) =>
    {
        handler(request, response)
            .then((results) =>
            {
                if(!response.finished)
                {
                    response.json(results);
                } // end if
            })
            .catch((error) =>
            {
                console.error(error.stack || error.message);

                response.status(500).json({
                    name: error.constructor.name,
                    message: error.message,
                    error: error
                });
            });
    };
} // end promisify

function wrapAsync(handler)
{
    return function(req, res, next)
    {
        // Make sure to `.catch()` any errors and pass them along to the `next()` middleware in the chain
        handler(req, res, next).catch(next);
    };
} // ebd wrapAsync

//----------------------------------------------------------------------------------------------------------------------

module.exports = {
    requestLogger: buildBasicRequestLogger,
    errorLogger: buildBasicErrorLogger,
    errorHandler: buildErrorHandler,
    interceptHTML,
    serveIndex,
    ensureAuthenticated,
    promisify,
    wrapAsync
}; // end exports

//----------------------------------------------------------------------------------------------------------------------
