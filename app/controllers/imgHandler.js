"use strict";
var request = require("request");
var fs = require("fs");
var async = require("async");

function imgHandler(db) {

    var images = db.collection("images");

    // called when user wants to shorten a link
    this.get = function(req, res) {
        res.end("test");
    };

    this.getResults = function(req, res) {
        var theUrl = "https://api.cognitive.microsoft.com/bing/v5.0/images/search?q=" + req.params.searchQuery;
        var options = { url: theUrl }

        function getAPIKey(callback) {
            if (process.env.API_KEY) { // for heroku
                options = {
                    url: theUrl,
                    headers: {
                        "Ocp-Apim-Subscription-Key": process.env.API_KEY
                    }
                };
            } else { // for running locally
                fs.readFile("./config.json", "utf8", function (err, data) {
                    // reading file, getting API key, and putting it into header
                    options = {
                        url: theUrl,
                        headers: JSON.parse(data)
                    };
                });
            }
            callback();
        };

        async.series([
            // getting API key before request
            function(callback) {
                if (process.env.API_KEY) { // for heroku
                    options = {
                        url: theUrl,
                        headers: {
                            "Ocp-Apim-Subscription-Key": process.env.API_KEY
                        }
                    };
                    callback(null, options);
                } else { // for running locally
                    fs.readFile("./config.json", "utf8", function (err, data) {
                        // reading file, getting API key, and putting it into header
                        options = {
                            url: theUrl,
                            headers: JSON.parse(data)
                        };
                        callback(null, options);
                    });
                }
            }
        ], function(err, results) {
            var options = results[0]; // results are returned in an array of length 1
            // getting search results from Bing Image Search API
            request(options, function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    res.end("It worked!");
                } else {
                    console.log(JSON.stringify(response));
                    res.end("API call error.")
                }
            });
        });
    };
};




module.exports = imgHandler;
