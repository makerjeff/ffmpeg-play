/**
 * Created by jefferson.wu on 11/30/16.
 */

// ================
// MODULES ========
// ================
const fs        = require('fs');
const junk      = require('junk');
const chalk     = require('chalk');
const clear     = require('clear');

var humanString = process.argv[2];      //string to compare
var database    = fs.readdirSync(process.cwd() + '/video_source/');
var cleandata   = database.filter(junk.not);
var noExtData   = [];

var dummyArray = ['amazing', 'america', 'sexy', 'king', 'rapist'];


// ================
// RUNTIME ========
// ================

clear();
// remove the extension of each file.
cleandata.forEach(function(elem, ind, arr){
    noExtData.push(elem.split('.').shift());
});

//console.log(checkWordAvailability(dummyArray, noExtData));
console.log(checkWordAvailability(dummyArray, noExtData).rejectedWords);

// =================
// FUNCTIONS =======
// =================
function checkWordAvailability(inputArr, library) {

    // found words
    var foundArr = [];
    // rejected words
    var rejectedArr = [];


    inputArr.forEach(function(elem, ind, arr){
        if(library.includes(elem)) {
            foundArr.push(elem);
        } else {
            rejectedArr.push(elem);
        }
    });
    
    // return data.
    return {
        inputCount: inputArr.length,
        libraryCount: library.length,
        rejectCount: rejectedArr.length,
        foundWords: foundArr,
        rejectedWords: rejectedArr
    };

}

