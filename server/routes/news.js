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
                                    var titleRe = /^(?:#(.*)|(.*)\n=+)\n+/;
                                    var match = titleRe.exec(file);

                                    var body = file.slice(match.index + match[0].length);

                                    // Parse filename as date
                                    var year = fileName.substr(0, 4);
                                    var month = fileName.substr(4, 2);
                                    var day = fileName.substr(6, 2);

                                    return { title: match[1] || match[2], body: body, date: new Date([month, day, year].join('/')) };
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