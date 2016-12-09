/**
 * Created by jefferson.wu on 12/9/16.
 */

//words.js (mongoose)
//
//     //-- grab mongoose --
// var mongoose = require('mongoose');
//
// //-- define schema --
// var userSchema = mongoose.Schema({
//     email: String,
//     password: String
// });
//
// // -- schema methods -- IF ANY
//
//
// // -- create model --
// var User = mongoose.model('User', userSchema);
//
// // -- export module --
// module.exports = User;




//TODO: pseudo-code for Module

var fs          = require('fs');
var mongoose    = require('mongoose');

var wordSchema = mongoose.Schema({
    word: String,
    counts: Number
});

/**
 * return the word and count.
 */
wordSchema.methods.getCount = function() {
    var word = this.word;
    var count = this.counts;
    console.log(word + ': ' + count);
};

/**
 * increase word count.
 */
wordSchema.methods.increment = function(){
    this.count = this.count + 1;
    console.log(this.word + ' incremented to: ' + this,count);
};



// compile model and export
var Word = mongoose.model('Word', wordSchema);

module.exports = Word;

// check if word is in DB

// if yes, run increment function (++)

// if no, add to db with value of 1.