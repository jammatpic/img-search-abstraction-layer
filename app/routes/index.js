"use strict";
var ImgHandler = require(process.cwd() + "/app/controllers/imgHandler.js");

module.exports = function(app, db) {
    var imgHandler = new ImgHandler(db);

    // serves index page
    app.route("/")
        .get(function(req, res) {
            res.sendFile(process.cwd() + "/public/index.html");
        });
};
