const fs    = require('fs');
const chalk = require('chalk');
const clear = require('clear');


var files = fs.readdirSync(process.cwd() + '/repeatwords-play', {encoding: 'utf8'});

clear();
//console.log(files);


var cleanArray = [];

files.forEach(function(elem, ind, arr){

    //SCHEMA
    // var wordObject = {
    //     word: 'word',   //elem.split('.').shift();
    //     files: ['word.mp4', 'word_1.mp4', 'word_2.mp4']
    // };

    var regexp = /[_]/;     // regex to find '_' marker.

    // strip extension
    var noExtFileName = elem.split('.').shift();

    // check to see if the '_' exists in the file name
    if (noExtFileName.search(regexp) === -1) {
        //if the marker exists it's a SLAVE
        cleanArray.push({word: noExtFileName, files: elem});
    } else {
        // if no marker, it's a MASTER
        cleanArray.push({ word: noExtFileName, index: noExtFileName[noExtFileName.search(regexp) + 1] , filename: elem});
    }

});

// --- output ---
cleanArray.forEach(function(elem, ind, arr){
    if(elem.index === 'master') {
        console.dir(elem);
    } else {
        //console.dir(elem);
    }
});

//TODO: add duplicates to master word