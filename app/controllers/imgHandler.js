"use strict";

function imgHandler(db) {
    var images = db.collection("images");

    // called when user wants to shorten a link
    this.getShortURL = function(req, res) {
        res.end("test");
    };
};

module.exports = imgHandler;
