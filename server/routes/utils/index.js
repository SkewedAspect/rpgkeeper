//----------------------------------------------------------------------------------------------------------------------
// Router utils
//----------------------------------------------------------------------------------------------------------------------

const {
    requestLogger,
    errorLogger,
    errorHandler,
    interceptHTML,
    serveIndex,
    ensureAuthenticated,
    promisify,
    wrapAsync
} = require('./router');

const { parseQuery, filterByQuery } = require('./query');

//----------------------------------------------------------------------------------------------------------------------

module.exports = {
    requestLogger,
    errorLogger,
    errorHandler,
    interceptHTML,
    serveIndex,
    ensureAuthenticated,
    promisify,
    wrapAsync,

    parseQuery,
    filterByQuery
}; // end exports

//----------------------------------------------------------------------------------------------------------------------
