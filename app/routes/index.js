"use strict";
var ImgHandler = require(process.cwd() + "/app/controllers/imgHandler.js");

module.exports = function(app, db) {
    var imgHandler = new ImgHandler(db);

    // serves index page
    app.route("/")
        .get(function(req, res) {
            res.sendFile(process.cwd() + "/public/index.html");
        });

    // called when looking at search history
    app.route("/latest")
        .get(imgHandler.getSearchHistory);

    // called when submitting a search query
    app.route("/imgsearch/:searchQuery")
        .get(imgHandler.getResults);
};
