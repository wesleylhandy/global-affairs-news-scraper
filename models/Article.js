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
    required: true
  },
  favorite: {
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

ArticleSchema.methods.upVote = function(id) {
  
  return new Promise((resolve, reject)=>{
    this.findOneAndUpdate({
      _id: id
    }, update: { 
      $inc: { 
        votes: 1 }
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

ArticleSchema.methods.downVote = function(id) {
    
  return new Promise((resolve, reject)=>{
    this.findOneAndUpdate({
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

ArticleSchema.methods.favorite = function(id, res) {
  this.findOneAndUpdate({
    _id: id
  }, { 
    favorite: true
  }, {
    new: true
  }, function(err, data) {
    if (err){
      console.log(err);
      res.send(err);
    } else {
      res.send(data);
    }
  });
}

ArticleSchema.methods.unfavorite = function(id, res) {
  this.findOneAndUpdate({
    _id: id
  }, { 
    favorite: false
  }, {
    new: true
  }, function(err, data) {
    if (err){
      console.log(err);
      res.send(err);
    } else {
      res.send(data);
    }
  });
}

ArticleSchema.methods.getFavorites = function() {

  return new Promise((resolve, reject)=>{
    this.find({
      favorite: true
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

// Create the Article model with the ArticleSchema
var Article = mongoose.model("Article", ArticleSchema);

// Export the model
module.exports = Article;