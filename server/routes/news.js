//----------------------------------------------------------------------------------------------------------------------
// Routes for news
//
// @module news.js
//----------------------------------------------------------------------------------------------------------------------

var fs = require('fs');
var path = require('path');

var _ = require('lodash');
var express = require('express');
var Promise = require('bluebird');
var fastmatter = require('fastmatter');

var routeUtils = require('./utils');

var logger = require('omega-logger').loggerFor(module);

//----------------------------------------------------------------------------------------------------------------------

Promise.promisifyAll(fs);

var router = express.Router();

//----------------------------------------------------------------------------------------------------------------------
// Middleware
//----------------------------------------------------------------------------------------------------------------------

// Basic request logging
router.use(routeUtils.requestLogger(logger));

// Basic error logging
router.use(routeUtils.errorLogger(logger));

//----------------------------------------------------------------------------------------------------------------------
// Profiles Endpoint
//----------------------------------------------------------------------------------------------------------------------

router.get('/', function(req, resp)
{
    resp.format({
        json: function()
        {
            var newsPath = path.resolve(__dirname + '/../news');

            fs.readdirAsync(newsPath)
                .then(function(files)
                {
                    var filePromises = [];
                    _.each(files, function(fileName)
                    {
                        var filePath = path.join(newsPath, fileName);

                        filePromises.push(fs.readFileAsync(filePath, { encoding: 'utf8' })
                                .then(function(file)
                                {
                                    var data = fastmatter(file);
                                    
                                    // Parse as a date
                                    data.attributes.date = new Date(data.attributes.date);
                                    
                                    return data;
                                })
                        );
                    });

                    Promise.all(filePromises)
                        .then(function(news)
                        {
                            resp.json(_.sortBy(news, 'date').reverse());
                        });
                })
                .catch(function(err)
                {
                    console.error('error:', err.stack);
                    resp.status(500).json({ error: err.message, stack: err.stack });
                });
        },
        html: function()
        {
            routeUtils.serveIndex(req, resp);
        }
    });
});

//----------------------------------------------------------------------------------------------------------------------

module.exports = router;

//----------------------------------------------------------------------------------------------------------------------