//----------------------------------------------------------------------------------------------------------------------
// Routes for news
//
// @module news.js
//----------------------------------------------------------------------------------------------------------------------

const fs = require('fs');
const path = require('path');

const _ = require('lodash');
const express = require('express');
const Promise = require('bluebird');
const fastmatter = require('fastmatter');

const routeUtils = require('./utils');

//----------------------------------------------------------------------------------------------------------------------

const readDirAsync = Promise.promisify(fs.readdir);
const readFileAsync = Promise.promisify(fs.readFile);

const router = express.Router();
const promisify = routeUtils.promisify;

//----------------------------------------------------------------------------------------------------------------------

//TODO: We need a better new system.

router.get('/', (request, response) =>
{
    routeUtils.interceptHTML(response, promisify(() =>
    {
        const newsPath = path.resolve(__dirname + '/../news');

        return readDirAsync(newsPath)
            .then((files) =>
            {
                const filePromises = [];
                _.each(files, (fileName) =>
                {
                    const filePath = path.join(newsPath, fileName);

                    filePromises.push(readFileAsync(filePath, { encoding: 'utf8' })
                            .then((file) =>
                            {
                                const data = fastmatter(file);

                                // Parse as a date
                                data.attributes.date = new Date(data.attributes.date);
                                data.attributes.filename = fileName;

                                return data;
                            }));
                });

                return Promise.all(filePromises)
                    .then((news) =>
                    {
                        response.json(_.sortBy(news, 'date').reverse());
                    });
            })
            .catch((err) =>
            {
                console.error('error:', err.stack);
                response.status(500).json({ error: err.message, stack: err.stack });
            });
    }));
});

//----------------------------------------------------------------------------------------------------------------------

module.exports = router;

//----------------------------------------------------------------------------------------------------------------------