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
processArrayOfFiles(fileArray);


// ========
// FUNCTION
// ========
function processArrayOfFiles(array) {
    clear();
    console.log('## File List: ##');
    array.forEach(function(elem, ind, arr){
        console.log(chalk.green(elem));
    });


}