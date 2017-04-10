const methodOverride = require("method-override");
const express = require("express");

// Requiring our Note and Article models
var Note = require("../models/Note.js"); //not being used here
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

module.exports = function(app) {

        //call new router object
    const router = express.Router();
    
    router.use(methodOverride("_method"));

    router.get('/notes/:id', function(req, res){

        Article.findOne({
            _id: req.params.id
        }).populate("notes").exec(function(err, data) {
            sendData(res, err, data);
        });

    })

    // add a note to the article
    router.post("/note/add/:id", function(req, res) {

        var newNote = new Note(req.body);
        // Save the new note to mongoose
        newNote.save(function(error, note) {
            // Send any errors to the browser
            if (error) {
                res.send(error);
            }
            // Otherwise
            else {
                // Find our user and push the new note id into the User's notes array
                Article.findOneAndUpdate({
                    _id: req.params.id
                }, {
                    $push: {
                        notes: note._id
                    }
                }, {
                    new: true
                }, function(err, data) {
                    sendData(res, err, data);
                });

            }
        });

    });

    //update title and content of note on a given article
    router.put("/note/update/:id", function(req, res){

    });

    //delete a given note
    router.delete("/note/delete/:id", function(req, res){

    });
        

}