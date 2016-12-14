const fs    = require('fs');
const chalk = require('chalk');
const clear = require('clear');


var files = fs.readdirSync(process.cwd() + '/repeatwords-play', {encoding: 'utf8'});

clear();
//console.log(files);


var cleanArray = [];

files.forEach(function(elem, ind, arr){

    //strip extension
    var noExtFileName = elem.split('.').shift();
    //console.log(noExtFileName);

    //look for the '_' character
    if (noExtFileName.search(/[_]/) === -1) {

        var returnObject = {word: noExtFileName, index: 'master', filename: elem};

        //console.log(returnObject);
        cleanArray.push(returnObject);
    } else {
        returnObject = { word: noExtFileName, index: noExtFileName[noExtFileName.search(/[_]/) + 1] , filename: elem};
        //console.log(returnObject);
        cleanArray.push(returnObject);
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