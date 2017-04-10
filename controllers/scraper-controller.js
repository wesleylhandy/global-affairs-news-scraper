const express = require("express");

// Requiring Article model
var Article = require("../models/Article.js");

// Our scraping tools
const request = require("request");
const cheerio = require("cheerio");

module.exports = function(app) {

        //call new router object
    const router = express.Router();
    

    // A GET request to scrape three different world news websites
    router.get("/scrape", function(req, res) {

        var counter = 0; //counter to track number of articles

        //create three promise-based functions to return website data

        //BBC World News
        function getBBC() {

            return new Promise((resolve, reject)=>{

                // First, we grab the body of the html with request
                request("http://www.bbc.com/news/world", function(error, response, html) {

                    if(error){
                        console.log(error);
                        reject(error);
                    }
                    // Then, we load that into cheerio and save it to $ for a shorthand selector
                    var $ = cheerio.load(html);
                    
                    $("h3.title-link__title").each(function(i, element) {

                        counter++;
                        // Save an empty result object
                        var result = {};

                        // Add the text and href of every link, and save them as properties of the result object
                        result.title = $(this).find(".title-link__title-text").text();
                        result.link = "http://www.bbc.com/news/world" + $(this).parent("a").attr("href");

                        // Using our Article model, create a new entry
                        // This effectively passes the result object to the entry (and the title and link)
                        var entry = new Article(result);

                        // Now, save that entry to the db
                        entry.save(function(err, doc) {
                            // Log any errors
                            if (err) {
                                console.log(err);
                            }
                            // Or log the doc
                            else {
                                console.log(doc);
                            }
                        });

                    });
                    //after scraping and saving, resolve
                    resolve("Success");
                });
            });
        }

        //Al-Jazeera Africa News
        function getAlJazeera() {

            return new Promise((resolve, reject)=>{

                request("http://www.aljazeera.com/topics/regions/africa.html", function(error, response, html) {
                    
                    if(error){
                        console.log(error);
                        reject(error);
                    }

                    // Then, we load that into cheerio and save it to $ for a shorthand selector
                    var $ = cheerio.load(html);
                    // Now, we grab every h2 within an article tag, and do the following:
                    $(".top-feature-overlay-cont, .top-feature-sblock-wr, .topics-sec-item-cont").each(function(i, element) {

                        counter++;
                        // Save an empty result object
                        var result = {};

                        // Add the text and href of every link, and save them as properties of the result object
                        result.title = $(this).find("h2").text();
                        result.link = "http://aljazeera.com" + $(this).children("a").attr("href");

                        // Using our Article model, create a new entry
                        // This effectively passes the result object to the entry (and the title and link)
                        var entry = new Article(result);

                        // Now, save that entry to the db
                        entry.save(function(err, doc) {
                            // Log any errors
                            if (err) {
                                console.log(err);
                            }
                            // Or log the doc
                            else {
                                console.log(doc);
                            }
                        });

                    });
                    //after sracping and saving, resolve
                    resolve("Success");
                });
            });
        }

        //China Daily US-China Relations News
        function getChinaDaily(){

            return new Promise((resolve, reject)=>{

                request("http://usa.chinadaily.com.cn/us/index.html", function(error, response, html) {
                    
                    if(error){
                        console.log(error);
                        reject(error);
                    }

                    // Then, we load that into cheerio and save it to $ for a shorthand selector
                    var $ = cheerio.load(html);
                    // Now, we grab every h2 within an article tag, and do the following:
                    $(".mb10").each(function(i, element) {

                        counter++;
                        // Save an empty result object
                        var result = {};

                        // Add the text and href of every link, and save them as properties of the result object
                        result.title = $(this).find("h4").text();
                        result.link = "http://usa.chinadaily.com.cn/" + $(this).children("a").attr("href");

                        // Using our Article model, create a new entry
                        // This effectively passes the result object to the entry (and the title and link)
                        var entry = new Article(result);

                        // Now, save that entry to the db
                        entry.save(function(err, doc) {
                            // Log any errors
                            if (err) {
                                console.log(err);
                            }
                            // Or log the doc
                            else {
                                console.log(doc);
                            }
                        });

                    });
                    //after scraping and saving, resolve
                    resolve("Success");
                });
            });
        }

        let promises = [ 
            getBBC(),
            getAlJazeera(),
            getChinaDaily()
        ];

        //Once all three requests are finished, send a notice to the browser
        Promise.all(promises).then((success)=>{

            // Tell the browser that we finished scraping the text
            res.json(counter);

        }).catch((err)=>{

            // Tell the browser scraping did not work
            if(err) {
                console.log(err);
                res.json(false);
            }
        });
    });

    app.use("/", router);
}