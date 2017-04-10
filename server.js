// Dependencies
var express = require("express");
const exphbs = require("express-handlebars");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
const path = require('path');

// Our scraping tools
var request = require("request");
var cheerio = require("cheerio");
// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;


// Initialize Express
var app = express();
// Specify the port.
var port = process.env.PORT || 3000;

// Make public a static dir
app.use(express.static(__dirname + '/public'));

var hbs = exphbs.create({
    defaultLayout: 'main',

    layoutsDir: __dirname + '/views/layouts/',
    partialsDir: __dirname + '/views/partials/'
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.set('port', port);

// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// Database configuration with mongoose
mongoose.connect("mongodb://heroku_c5mv746k:5tvkkints4qgk3eqj0n3rkfi7u@ds157980.mlab.com:57980/heroku_c5mv746k");
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
    console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
    console.log("Mongoose connection successful.");
});

require("./controllers/scraper-controller.js")(app);
require("./controllers/note-controller.js")(app);
require("./controllers/article-controller.js")(app, hbs);


// Listen on port 3000
app.listen(port, function() {
    console.log(`App running on ${port}`);
});