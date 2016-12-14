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
    console.log(noExtFileName);


});
