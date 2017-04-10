// Require mongoose
var mongoose = require("mongoose");

//require express to use res function on article methods
const express = require("express");
// Create Schema class
var Schema = mongoose.Schema;

// Create article schema
var ArticleSchema = new Schema({
  // title is a required string
  title: {
    type: String,
    required: true
  },
  // link is a required string
  link: {
    type: String,
    required: true,
    unique: true
  },
  favorited: {
    type: Boolean,
    default: false
  },
  votes: {
    type: Number,
    default: 0
  },
  // This only saves one note's ObjectId, ref refers to the Note model
  notes: [{
    type: Schema.Types.ObjectId,
    ref: "Note"
  }]
});

// Create the Article model with the ArticleSchema
var Article = mongoose.model("Article", ArticleSchema);

Article.removeOldArticles = function() {

  return new Promise((resolve, reject)=>{

    Article.deleteMany({
      favorited: false
    }, function(err) {
      if (err) {
        reject(err)
      } else {
        resolve('Success');
      }
    });

  });

}

Article.upVote = function(id) {
  
  return new Promise((resolve, reject)=>{
    Article.findOneAndUpdate({
      _id: id
    }, { 
      $inc: { 
        votes: 1 
        }
      }, {
        new: true
      }, function(err, data) {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(data);
        }
    });
  })
}

Article.downVote = function(id) {
    
  return new Promise((resolve, reject)=>{
    Article.findOneAndUpdate({
      _id: id
    }, { 
      $inc: { 
        votes: -1 }
      }, {
        new: true
      }, function(err, data) {
        if(err) {
          console.log(err);
          reject(err);
        } else {
          resolve(data);
        }
    });
  });
}

Article.favorite = function(id) {

  return new Promise((resolve, reject)=>{
    Article.findOneAndUpdate({
      _id: id
    }, { 
      favorited: true
    }, {
      new: true
    }, function(err, data) {
      if (err){
        console.log(err);
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

Article.unfavorite = function(id) {

  return new Promise((resolve, reject)=>{
    Article.findOneAndUpdate({
      _id: id
    }, { 
      favorited: false
    }, {
      new: true
    }, function(err, data) {
      if (err){
        console.log(err);
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

Article.getFavorites = function() {

  return new Promise((resolve, reject)=>{
    Article.find({
      favorited: true
    }, function(err, data){
      if(err) {
        console.log(err);
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}



// Export the model
module.exports = Article;