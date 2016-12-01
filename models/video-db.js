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

const textSanitizer = require('../modules/textSanitizer-node');

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
// EXPORT METHODS =============
// ============================


// NEW VERSION
module.exports.generateVideoSync2 = function(inputStr) {
    // -------------------------------
    // PROCESS INPUT STRING ----------
    // -------------------------------
    var status;
    var fileHash = shortid.generate();
    var inputString = inputStr.toLowerCase();
    var cleanText = textSanitizer.getSanitizedString(inputString);
    var inputArray = cleanText.split(' ');
    var filelistString = '';

    //TODO: CHECKWORDAVAILABILITY HERE.

    //build filelist data
    inputArray.forEach(function(elem, ind, arr){
        filelistString = filelistString + " file '" + configObject.libraryFolder + elem + ".mp4'\n";
    });

    // -------------------------------
    // WRITE FILE-LIST ---------------
    // -------------------------------
    fs.writeFile(configObject.tempFolder + fileHash + '.txt', filelistString, {encoding:'utf8'},
    function (err) {
        if(err) {
            console.log(chalk.red('Error writing text file.'));
        } else {
            //use a readFile check before concat
            fs.readFile(configObject.tempFolder + fileHash + '.txt', function(err, data){
                if(err){
                    console.log(chalk.red('Error reading text file.'));
                } else {
                    concatVideoFile(configObject.tempFolder + fileHash + '.txt', configObject.outputFolder + getFileName(cleanText));
                }
            });
        }
    });


    // TODO: continue working here tonight (NOV 30th 2016)
    // =============================================================================================

    //var dummyStatus = 'completed';


    var outputStatus;
    // status object
    // available statuses 'completed', 'failed', 'rejected' (include a rejected payload), maybe move to error ##'s?


    switch(dummyStatus) {
        case 'completed':
            outputStatus = {status: 'completed', payload: {videoUrl: getFileName(inputString)}};
            break;
        case 'failed':
            outputStatus = {status: 'failed', payload: {errorObject: {data1: 'one', data2: 'two'}}};
            break;
        case 'rejected':
            outputStatus = {status: 'rejected', payload: {rejectedArr: ['word1', 'word2', 'word3']}};
            break;
        default:
            outputStatus = {nothing: 'Not implemented yet.'};

    }

    return outputStatus;

    // ==============================================================================================

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

    return availData;   //TODO: return promise instead of actual object.
};

/**
 * Get Available Videos SYNC.
 * @returns {Array.<T>|*|{PSEUDO, CHILD, ID, TAG, CLASS, ATTR, POS}}
 */
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

/**
 * Concatenate videos using FFMPEG.
 * @param relFilePath   File path.
 * @param outputFileName    Output file name.
 */
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

    var cleanText = textSanitizer.getSanitizedString(inputStr);
    var inputArray = cleanText.toLowerCase().split(' ');

    return inputArray.join('_') + '.mp4';
}

//check DB for available word.


/**
 * Compare two arrays and check for availability.
 * @param inputArr  User input words array.
 * @param library   Library array to compare to.
 * @returns {{inputCount: *, libraryCount: *, rejectCount: Number, foundWords: Array, rejectedWords: Array}}    An object with information.
 */
function checkWordAvailability(inputArr, library) {

    // found words
    var foundArr = [];
    // rejected words
    var rejectedArr = [];
    
    inputArr.forEach(function(elem, ind, arr){
        if(library.includes(elem)) {
            foundArr.push(elem);
        } else {
            rejectedArr.push(elem);
        }
    });

    // return data.
    return {
        inputCount: inputArr.length,
        libraryCount: library.length,
        rejectCount: rejectedArr.length,
        foundWords: foundArr,
        rejectedWords: rejectedArr
    };

}


