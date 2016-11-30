/** Video DB Module v2
 * Get File names, etc.
 * Created by jefferson.wu on 11/21/16.
 */
// ============================
// MODULES ====================
// ============================
const chalk         = require('chalk');
const fs            = require('fs');
const child_process = require('child_process');
const shortid       = require('shortid');
const junk          = require('junk');

// ============================
// CONFIGURATION ==============
// ============================

var configObject = {
    libraryFolder: process.cwd() + '/video_source/',
    tempFolder: process.cwd() + '/video_temp/',
    outputFolder: process.cwd() + '/public/videos/',
    outputExtension: '.mp4'
};

// ============================
// RUNTIME ====================
// ============================

// NOT FOR MODULES

// ============================
// EXPORT METHODS =============
// ============================

//TODO: PROMISIFY THIS.
module.exports.generateVideo = function(inputStr) {

    // -------------------------
    // PROCESS INPUT STRING ----
    // -------------------------

    var status;
    var fileHash = shortid.generate();
    var inputString = inputStr.toLowerCase();
    var inputArray = inputString.split(' ');

    if(inputArray[0] === '') {
        inputArray.splice(0,1);
    }

    var filelistString = '';

    inputArray.forEach(function(elem,ind,arr){
        filelistString = filelistString + "file '" + configObject.libraryFolder + elem + ".mp4'\n";
    });

    // --------------------------
    // WRITE FILE-LIST ----------
    // --------------------------
    fs.writeFile(configObject.tempFolder + fileHash + '.txt', filelistString, {encoding:'utf8'},
    function(err){
        if (err) {
            console.log(chalk.red('Error writing text file.'));
        } else {

            //using a readFile to check if the file exists before concat.
            fs.readFile(configObject.tempFolder + fileHash + '.txt', function(err, data){
                if(err){
                    console.log('Error reading generated text file.');
                } else {
                    concatVideoFile(configObject.tempFolder + fileHash + '.txt', configObject.outputFolder + getFileName(inputString));
                }
            });
        }
    });

    var dataObject = {
        status: 'complete',
        videoUrl: getFileName(inputString)
    };

    return dataObject;
};

/**
 * DEBUG: Get local directory.
 * @returns {*|String} Node process.cwd();
 */
module.exports.getLocalDirectory = function(){
    console.log(process.cwd());
    return process.cwd();
};

/**
 * Gets the configObject of video-db.
 * @returns {{libraryFolder: string, tempFolder: string, outputFolder: string, outputExtension: string}} Config Object.
 */
module.exports.getAllDirectories = function() {
    return configObject;
};

/**
 * Get Available Videos ASYNC (TODO: promisify)
 */
module.exports.getAvailableVideos = function() {

    var availData;

    fs.readdir(configObject.libraryFolder, function(err, files){

        if(err){
            console.log(Error('Error occured: ' + err));
        } else {
            //console.log(files);
            availData = files;
        }
    });

    return availData;
};


module.exports.getAvailableVideosSync = function() {
    var data;
    var cleandata;
    data = fs.readdirSync(configObject.libraryFolder);
    cleandata = data.filter(junk.not);
    return cleandata;
};
// ============================
// INTERNAL FUNCTIONS =========
// ============================

function concatVideoFile(relFilePath, outputFileName) {

    var statusData;

    //debug
    console.log(relFilePath);
    console.log(outputFileName);


    child_process.exec('ffmpeg -y -f concat -safe 0 -i ' + relFilePath + ' -c copy ' + outputFileName, {encoding: 'utf8'},
    function(err, stdout, stderr){
        if(err) {
            console.log(chalk.red('Error generating video file. ' +  err));
        } else {
            if(stderr){
                console.log('Successful Video Generation (but stderr)');
            } else {
                console.log(stdout + ' Success Message.');
            }
        }
    });


}

/**
 * Get the file name from an input string.
 * @param inputStr   String that the user has inputted.
 * @returns {string}    Returns a file name complete with .mp4 extension.
 */
function getFileName(inputStr) {
    var inputArray = inputStr.toLowerCase().split(' ');

    if(inputArray[0] === '') {
        inputArray.splice(0,1);
    }

    return inputArray.join('_') + '.mp4';
}



