"use strict";
var request = require("request");
var fs = require("fs");

function imgHandler(db) {
    var images = db.collection("images");

    // called when user wants to shorten a link
    this.get = function(req, res) {
        res.end("test");
    };

    this.getResults = function(req, res) {
        var theUrl = "https://api.cognitive.microsoft.com/bing/v5.0/images/search?q=" + req.params.searchQuery;

        fs.readFile("./config.json", "utf8", function (err, data) {
            // reading file, getting API key, and putting it into header
            var keyInfo = JSON.parse(data);
            var options = {
                url: theUrl,
                headers: keyInfo
            };

            // getting search results from Bing Image Search API
            request(options, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    res.end("It worked!");
                } else {
                    res.end("API call error.")
                }
            });
        });
    };

};

module.exports = imgHandler;
