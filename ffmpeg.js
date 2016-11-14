/**
 * Created by jefferson.wu on 11/13/16.
 */

const chalk = require('chalk');
const clear = require('clear');

const fs = require('fs');
const ffmpeg = require('ffmpeg');
const child_process = require('child_process');
const exec = child_process.exec;

var inputFile = __dirname + '/video_source/IMG_0003.m4v';
var outputFile = __dirname + '/video_output/node_output.mp4';

var cmd = 'ffmpeg -i ' + inputFile + ' ' + outputFile;

var fileArray = fs.readdirSync(process.cwd() + '/video_source/to_process');

var inputFileName = process.argv[2];


// run FFMPEG
// child_process.exec(cmd, function(error, stdout, stderr){
//     if(error) console.log('Error: ' + error);
//
//     console.log(stdout);
//     process.exit();
// });

// =======
// RUNTIME
// =======
//processArrayOfFiles(fileArray);
processOneFile('IMG_0005.m4v');


// ========
// FUNCTION
// ========

function processOneFile(fileName) {

    var outputFileName = fileName.split('.');
    outputFileName.splice(1,1);

    //run FFMPEG
    child_process.exec('ffmpeg -i ' + __dirname + '/video_source/to_process/' + fileName + ' ' + __dirname + '/video_output/' + outputFileName + '.mp4',

        function(err, stdout, stderr){

            if(err) {
                console.log('Error: ' + error);
            }
            else if (stderr) {
                console.log('STDOUT: ' + stderr);
            } else {
                console.log(stdout);
            }
    });
}
/**
 * Process files to MP4
 * @param array Input Array.
 */
function processArrayOfFiles(array) {

    array.forEach(function(elem, ind, arr){

        var outputFileName = elem.split('.');
        outputFileName.splice(1,1);

        console.log("Processing " + elem + '... ');
        child_process.exec('ffmpeg -i ' + __dirname + '/video_source/to_process/' + elem + ' ' + outputFileName + '.mp4', function(error, stdout, stderr){
            if(error) console.log('Error: ' + error);

            console.log(stdout);
        });
    });

    process.exit();


    //debugInfo(array);
}

/**
 * Debug info
 * @param array Input array.
 */
function debugInfo(array) {
    clear();
    console.log(chalk.yellow('## File List: ##'));
    array.forEach(function(elem, ind, arr){
        console.log('- ' + chalk.green(elem));
    });
}