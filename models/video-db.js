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

//TODO: THIS ISNT RETURNING THE LIBRARY
var wordLibrary = getWordLibrary();


// ============================
// EXPORT METHODS =============
// ============================

// NEW VERSION
module.exports.generateVideoSync2 = function(inputStr) {
    // -------------------------------
    // PROCESS INPUT STRING ----------
    // -------------------------------
    var tempStatus;
    var fileHash = shortid.generate();
    var inputString = inputStr.toLowerCase();
    var cleanText = textSanitizer.getSanitizedString(inputString);
    var inputArray = cleanText.split(' ');
    var filelistString = '';

    var dummyStatus;

    //TODO: CHECKWORDAVAILABILITY HERE.
    var yayOrNay = checkWordAvailability(inputArray, wordLibrary);
    console.log(yayOrNay);


    // ------------------------------
    // BUILD FILE-LIST ------------V-

    // inputArray.forEach(function(elem, ind, arr){
    //     filelistString = filelistString + " file '" + configObject.libraryFolder + elem + ".mp4'\n";
    // });

    // BUILD FILE-LIST ------------^-
    //-------------------------------

    // -------------------------------
    // WRITE FILE-LIST -------------v-

    // fs.writeFile(configObject.tempFolder + fileHash + '.txt', filelistString, {encoding:'utf8'},
    // function (err) {
    //     if(err) {
    //         console.log(chalk.red('Error writing text file.'));
    //     } else {
    //         //use a readFile check before concat
    //         fs.readFile(configObject.tempFolder + fileHash + '.txt', function(err, data){
    //             if(err){
    //                 console.log(chalk.red('Error reading text file.'));
    //             } else {
    //                 tempStatus = concatVideoFile(configObject.tempFolder + fileHash + '.txt', configObject.outputFolder + getFileName(cleanText));
    //             }
    //         });
    //     }
    // });
    // WRITE FILE-LIST --------------^-
    // --------------------------------


    // TODO: continue working here tonight (NOV 30th 2016), Encapsulate Message Handling to function.
    // =============================================================================================

    // -----------------------------
    // OUTPUT STATUS -------------V-


    // ---------------------------------------------------------
    // auto switch: 0=completed, 1=failed, 2=rejected ---

    var autoSwitch;

    if (yayOrNay.rejectCount > 0) {
        autoSwitch = 2;
    } else {
        autoSwitch = 0;
    }

    switch (autoSwitch) {
        case 0:
            console.log(chalk.green('MS: completed'));
            dummyStatus = {status: 'completed', payload: 'MS: a_video_url.mp4'};
            break;
        case 1:
            console.log(chalk.red('MS: failed'));
            dummyStatus = {status: 'failed', payload: 'MS: Failed error message.'};
            break;
        case 2:
            console.log(chalk.yellow('MS: rejected'));
            dummyStatus = {status: 'rejected', payload: yayOrNay };
            break;
        default:
            console.log(chalk.blue('MS: defaulted'));
            dummyStatus = {status: 'defaulted', payload: 'MS: DEFAULT-FACED.'};
    }

    return dummyStatus;
    // OUTPUT STATUS ----------------^-
    // --------------------------------

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
    //TODO: return some kind of info to pass on to the front end.

    var statusData;

    //debug
    console.log(relFilePath);
    console.log(outputFileName);
    
    child_process.exec('ffmpeg -y -f concat -safe 0 -i ' + relFilePath + ' -c copy ' + outputFileName, {encoding: 'utf8'},
    function(err, stdout, stderr){
        if(err) {
            console.log(chalk.red('Error generating video file. ' +  err));
            statusData = {status:'failed', payload: {message:'Video generation error on the server (video-db).'}}
        } else {
            if(stderr){
                console.log(chalk.green('Successful Video Generation (but stderr)'));
                statusData = {status: 'completed', payload: {message:'Video successfully generated on the server. (video-db)'}};
            } else {
                console.log(stdout + ' Success Message.');
            }
        }
    });

    return statusData;      // << RETURN to function that called.
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

    // info check
    //console.log(library);
    
    inputArr.forEach(function(elem, ind, arr){
        if(library.includes(elem)) {
            foundArr.push(elem);
        } else {
            rejectedArr.push(elem);
        }
    });

    // return data.

    var returnObject = {
        inputCount: inputArr.length,
        libraryCount: library.length,
        rejectCount: rejectedArr.length,
        foundWords: foundArr,
        rejectedWords: rejectedArr
    };

    //console.log(returnObject);

    return returnObject;
}

/**
 * Get the word library, returned with a clean version without DS_Store. or extensions.
 * @returns {*} Clean array.
 */
function getWordLibrary(){

    var inputArr = fs.readdirSync(configObject.libraryFolder, {encoding: 'utf8'}).filter(junk.not);
    var outputArray = [];

    // strip extensions
    inputArr.forEach(function(elem, ind, arr){
        outputArray.push(elem.split('.').shift());
    });

    // output
    return outputArray;
}


