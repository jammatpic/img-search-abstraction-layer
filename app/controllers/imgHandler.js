"use strict";
var request = require("request");
var fs = require("fs");
var async = require("async");
var url = require("url");
var querystring = require("querystring");
var moment = require("moment");

function imgHandler(db) {
    var searches = db.collection("searches");


    this.getSearchHistory = function(req, res) {
        // sending everything in collection to res
        searches.find({}, {_id: 0}).toArray(function (err, docs) {
            res.send(docs);
        });
    };

    this.getResults = function(req, res) {
        // getting search query and offset value, and using them to form API call
        var reqUrl = url.parse(req.protocol + "://" + req.get("host") + req.originalUrl);
        var theSearch = url.parse(req.params.searchQuery).pathname;
        var offset = querystring.parse(reqUrl.query).offset;
        
        if (offset === undefined) {
            offset = 0;
        }
        var theUrl = "https://api.cognitive.microsoft.com/bing/v5.0/images/search?q=" + theSearch + "&offset=" + offset;


        // adding search query to search history
        searches.insert({ term: theSearch, when: moment().format()}, function(err, data) {
            if (err) throw err;
        });

        // getting API key, searching for images, and summarising results
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
                    // sets results offset
                    var offset = 0;
                    if (req.query.hasOwnProperty("offset")) {
                        offset = req.query.offset;
                    }

                    res.end(JSON.stringify(resSummary.slice(offset, offset+10)));
                } else {
                    console.log(JSON.stringify(response));
                    res.end("API call error.");
                }
            });
        });
    };
};

module.exports = imgHandler;
