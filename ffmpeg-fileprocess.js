/**
 * Created by jefferson.wu on 11/20/16.
 */

const chalk = require('chalk');
const clear = require('clear');
const junk = require('junk');
const uuid = require('node-uuid');

const fs = require('fs');
const child_process = require('child_process');
const exec = child_process.exec;




var uuidFileName = uuid.v1();
var fileList = process.cwd() + '/video_temp/' + uuidFileName + '.txt';
var fileArray = fs.readdirSync(process.cwd() + '/video_source/to_process/');


//debugInfo();
buildFileList(fileArray, fileList);

console.log(uuid.v1());



function buildFileList(dataArray, file) {
    var addToFileList = '';

    var cleanData = fileArray.filter(junk.not);

    //add to addToFileList
    cleanData.forEach(function(elem, ind, arr){

        addToFileList = addToFileList + "file '" +  elem + "'\n";

        // fs.appendFile(file, "file '" + elem + "'\n", {encoding: 'utf8'}, function(err){
        //     if(err){
        //         console.log(err);
        //     } else {
        //         console.log('writeFile ' + elem + ' OK');
        //     }
        // });
    });

    //write File
    fs.writeFile(file, addToFileList, {encoding: 'utf8'}, function(err){
        if(err) console.log('error');
    } );
}


function debugInfo() {
    // read raw array
    console.log(fileArray);

// read filtered array
    console.log(fileArray.filter(junk.not));
}
