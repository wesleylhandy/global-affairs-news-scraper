const methodOverride = require("method-override");
const express = require("express");

// Requiring our Note and Article models
//var Note = require("./models/Note.js"); //not being used here
var Article = require("../models/Article.js");

//define callback function to send data to the browser
function sendData(res, err, data) {
    if (err) {
        console.log(err);
        res.json(err);
    } else {
        res.send(data);
    }
}

module.exports = function(app, hbs) {

        //call new router object
    const router = express.Router();
    
    router.use(methodOverride("_method"));

    // this will serve the main index.html
    router.get("/", function(req, res) {

        res.render('index');

    });

    router.get("/articles", function(req, res){

        //render a page with all the articles, sorted by votes
        Article.find({}).sort({votes: -1}).exec(function(err, articles) {
            if(err) {
                res.json(err);
            } else {
                res.render('articles', {articles});
            }
        });

    });

    //render a page with only favorited articles
    router.get("/favorites", function(req, res){

        Article.getFavorites().then((articles)=>{

            res.render('favorites', {favorites: articles});
        });

    });

    //handle an upvote
    router.put("/article/upvote/:id", function(req, res){

        Article.upVote(req.params.id).then((success)=>{
            res.redirect("/articles");
        }).catch((err)=>{
            res.json(err);
        });

    });

    //handle a downvote
    router.put("/article/downvote/:id", function(req, res){

        Article.downVote(req.params.id).then((success)=>{
            res.redirect("/articles");
        }).catch((err)=>{
            res.json(err);
        });

    });

    //add article to favorites --browswer will handle updating view
    router.put("/article/favorite/:id", function(req, res){

        Article.favorite(req.params.id, res);

    });

    //remove article from favorites --browswer will handle updating view
    router.put('/article/unfavorite/:id', function(req, res){

        Article.unfavorite(req.params.id, res);

    });

    //delete an article
    router.delete("/article/delete/:id", function(req, res){

        Article.where({_id: req.params.id})
            .findOneAndRemove({
                new:true
            }, function(err,data){
                sendData(res, err, data);
            }
        });


    });
        
    app.use("/", router);
}