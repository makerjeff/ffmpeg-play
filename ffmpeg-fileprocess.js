/**
 * Created by jefferson.wu on 11/20/16.
 */

const chalk = require('chalk');
const clear = require('clear');
const junk = require('junk');
const uuid = require('node-uuid');
const shortid = require('shortid');

const fs = require('fs');
const child_process = require('child_process');
const exec = child_process.exec;




var uniqueFileName = shortid.generate();
var fileList = process.cwd() + '/video_temp/' + uniqueFileName + '.txt';
var fileArray = fs.readdirSync(process.cwd() + '/video_source/to_process/');


//debugInfo();
buildFileList(fileArray, fileList);
concatVideoFiles(fileList);

console.log(chalk.blue(uniqueFileName));




// ======================
// functions ============
// ======================

/**
 * Build the file-list that's fed to FFMPEG for concat.
 * @param dataArray File array to build filelist from (currently reading an entire directory)
 * @param file   Output file to write to.
 */
function buildFileList(dataArray, file) {
    var addToFileList = '';
    var cleanData = fileArray.filter(junk.not);

    //add to addToFileList
    cleanData.forEach(function(elem, ind, arr){
        addToFileList = addToFileList + "file '" +  elem + "'\n";
    });

    //write File
    fs.writeFile(file, addToFileList, {encoding: 'utf8'}, function(err){
        if(err) console.log('error');
    });
}

/**
 * Take a filelist and spawn child process to FFMPEG concat.
 * @param file
 */
function concatVideoFiles(file) {

    fs.readFile(file, {encoding: 'utf8'}, function(err, data){
        if(err) {
            console.log(chalk.red('error reading file.'));
        } else {
            console.log("Processing video files: " + file);
            child_process.exec('ffmpeg -f concat -i ' + 'B1RvsZxfx.txt' + ' -c copy ' + 'concat_video.mp4',
            function(error, stdout, stderr){
                if(error) {
                    console.log(Error('Error occured with child process.'));
                } else {
                    if (stderr) {
                        console.log(chalk.red('Error with child process...\n') + stderr);
                        process.exit(1);
                    } else {
                        console.log(chalk.green('Successfully generated file.'));
                        process.exit(0);
                    }
                }

            });
        }
    });
}


function debugInfo() {
    // read raw array
    console.log(fileArray);

// read filtered array
    console.log(fileArray.filter(junk.not));
}
