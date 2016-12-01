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

console.log(checkForAvailability(dummyArray, noExtData));

// =================
// FUNCTIONS =======
// =================
function checkForAvailability(inputArr, library) {

    // rejected words
    var rejectedArr = [];

    library.forEach(function(elem, ind, arr){

        //loop through input array.
        for(var i = 0; i < inputArr.length; i++) {
            //compare each word to the array.

            console.log('comparing: ' + inputArr[i] + ' to ' + elem);

            //if word does not match
            if(inputArr[i] != elem) {
                //add to rejected array
                rejectedArr.push(inputArr[i]);
            }
        }

    });

    // return data.
    return {
        inputCount: inputArr.length,
        rejectCount: rejectedArr.length,
        rejected: rejectedArr
    };

}

