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
        var options = { url: theUrl };

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
                    var results = JSON.parse(body);
                    var resSummary = [];
                    // building result sumamry for each result, and adding åit to array
                    for (var i = 0; i < results.value.length; i++) {
                        var resultSummary = {};
                        resultSummary.url = results.value[i].contentUrl;
                        resultSummary.snippet = results.value[i].name;
                        resultSummary.thumbnail = results.value[i].thumbnailUrl;
                        resultSummary.context = results.value[i].hostPageUrl;
                        resSummary.push(resultSummary);
                    }
                    res.end(JSON.stringify(resSummary));
                } else {
                    console.log(JSON.stringify(response));
                    res.end("API call error.")
                }
            });
        });
    };
};

module.exports = imgHandler;
