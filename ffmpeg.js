/**
 * Created by jefferson.wu on 11/13/16.
 */

const chalk = require('chalk');
const clear = require('clear');

const fs = require('fs');
const child_process = require('child_process');
const exec = child_process.exec;

var videoData = {
    inputPath: __dirname + '/video_source/to_process/',
    outputPath: __dirname + '/video_output/',
    options: '-filter:v "scale=w=1280:h=-1" ',
    outputExtension: '.mp4'
};


var fileArray = fs.readdirSync(process.cwd() + '/video_source/to_process');


// =======
// RUNTIME
// =======
convertFile();


// ========
// FUNCTION
// ========

function convertFile(){

    child_process.exec('ffmpeg -i ' + videoData.inputPath + 'IMG_0005.m4v ' + videoData.options + videoData.outputPath + 'IMG_0005' + videoData.outputExtension, function(error, stdout, stderr){

        // if there's an error launching the process...
        if(error){
            console.log(Error(error));
        } else {
            if (stderr) {
                console.log(stderr);
                process.exit(1);
            } else {
                console.log(stdout);
                process.exit(0);
            }
        }

    });
}

function processOneFile(fileName) {

    var outputFileName = fileName.split('.');
    outputFileName.splice(1,1);

    //run FFMPEG
    child_process.exec('ffmpeg -i ' + __dirname + '/video_source/to_process/' + fileName + ' ' + __dirname + '/video_output/' + outputFileName + '.mp4',

        function(err, stdout, stderr){

            if(err) {
                console.log('Error: ' + error);
                process.exit(1);
            }
            else if (stderr) {
                console.log('STDOUT: ' + stderr);
            } else {
                console.log(stdout);
                process.exit(0);
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