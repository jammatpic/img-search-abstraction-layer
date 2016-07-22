"use strict";
var express = require("express"),
    routes = require("./app/routes/index.js"),
    mongo = require("mongodb").MongoClient;
var app = express();

mongo.connect(process.env.Mongo_URI || "mongodb://localhost:27017/us-db", function(err, db) {
    if (err) {
        throw new Error("Database failed to connect!");
    } else {
        console.log("MongoDB successfully connected.")
    }

    app.use('/public', express.static(process.cwd() + '/public'));

    // routes connections
    routes(app, db);

    app.listen(process.env.PORT || 3000, function() {
        console.log('Listening!');
    });
});
