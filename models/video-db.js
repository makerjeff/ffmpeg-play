/** Video DB Module v3
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

//synchronous file grab
var wordLibrary = getWordLibrary();

//TODO: getBadWordsLibrary()

var badwords = require('../models/badwords-library');
console.log(badwords);

// ============================
// EXPORT METHODS =============
// ============================
//TODO: work here.
module.exports.generateVideoPromise = function (inputStr) {
    //process input string.

    var tempStatus; // ???
    var fileHash = shortid.generate();
    var cleanText = textSanitizer.getSanitizedString(inputStr.toLowerCase());
    var inputArray = cleanText.split(' ');
    var filelistString = '';

    var dummyStatus;    //output status object
    var outputSwitch;   //needed?

    // -- check word availability --
    var yayOrNay = checkWordAvailability(inputArray, wordLibrary, badwords);

    if(yayOrNay.notFoundWords.length > 0 || yayOrNay.badWords.length > 0) {
        outputSwitch = 2;   //reject
    } else {
        outputSwitch = 0;   //resolve
        makeVideoSync (inputArray, fileHash, filelistString, cleanText);
    }

    // --- output status ---
    switch (outputSwitch) {
        case 0:
            console.log(chalk.green('checker: completed'));
            return {status: 'completed', payload:{videoUrl:getFileName(inputStr)}};
            break;
        case 1:
            console.log(chalk.red('checker: failed'));
            return {status: 'failed', payload: 'MS: Failed error message.'};
            break;
        case 2:
            console.log(chalk.yellow('checker: rejected'));
            return {status: 'rejected', payload: yayOrNay };
            break;
        default:
            console.log(chalk.blue('checker: defaulted'));
            return {status: 'defaulted', payload: 'MS: DEFAULT-FACED.'};
    }
    

};

/**
 * Generate video Sync 2.
 * @param inputStr  Input a string to be processed.
 * @returns {*} return a status object.
 */
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

    // ---------------------------------------------------------
    // auto switch: 0=completed, 1=failed, 2=rejected ---
    var outputSwitch;

    //TODO: CHECKWORDAVAILABILITY HERE.
    var yayOrNay = checkWordAvailability(inputArray, wordLibrary, badwords);
    console.log(yayOrNay);

    if (yayOrNay.notFoundWords.length > 0 || yayOrNay.badWords.length > 0) {
        outputSwitch = 2;   //rejected
    } else {
        outputSwitch = 0;   //
        makeVideoSync(inputArray, fileHash, filelistString, cleanText);

    }

    // -----------------------------
    // OUTPUT STATUS -------------V-

    console.log('outputSwitch: ' + outputSwitch);

    switch (outputSwitch) {
        case 0:
            console.log(chalk.green('checker: completed'));
            dummyStatus = {status: 'completed', payload:{videoUrl:getFileName(inputStr)}};
            break;
        case 1:
            console.log(chalk.red('checker: failed'));
            dummyStatus = {status: 'failed', payload: 'MS: Failed error message.'};
            break;
        case 2:
            console.log(chalk.yellow('checker: rejected'));
            dummyStatus = {status: 'rejected', payload: yayOrNay };
            break;
        default:
            console.log(chalk.blue('checker: defaulted'));
            dummyStatus = {status: 'defaulted', payload: 'MS: DEFAULT-FACED.'};
    }

    return dummyStatus;
    // OUTPUT -----------------------^-
    // --------------------------------


};

module.exports.getWordLibraryPromise = getWordLibraryPromise;

// ============================
// INTERNAL FUNCTIONS =========
// ============================

//TODO: need to clean this up.
/**
 * Make Video (Sync)
 * @param inputArray    The inputArray to check.
 * @param fileHash      Hash for filelist filename generation.
 * @param filelistString    The finished file list string to output.
 * @param cleanText     Clean text to concat video files with.
 */
function makeVideoSync(inputArray, fileHash, filelistString, cleanText) {
    // --- build filelist file ---
    inputArray.forEach(function(elem, ind, arr){
        filelistString = filelistString + " file '" + configObject.libraryFolder + elem + ".mp4'\n";
    });


    // --- write file list ---
    fs.writeFile(configObject.tempFolder + fileHash + '.txt', filelistString, {encoding:'utf8'},
        function (err) {
            if(err) {
                console.log(chalk.red('Error writing text file.'));
            } else {

                // --- check file list ---
                fs.readFile(configObject.tempFolder + fileHash + '.txt', function(err, data){
                    if(err){
                        console.log(chalk.red('Error reading text file.'));
                    } else {

                        // --- if text file exists, concat video. ---
                        concatVideoFile(configObject.tempFolder + fileHash + '.txt', configObject.outputFolder + getFileName(cleanText));
                    }
                });
            }
        });
}


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
            statusData = {status:'failed', payload: {message:'Video generation error on the server (video-db).'}}
        } else {
            if(stderr){
                console.log(chalk.green('Successful Video Generation (but stderr)'));
                //TODO: replace placeholder with actual file name.
                statusData = {status: 'completed', payload: {message:'Video successfully generated on the server. (video-db)', videoUrl: outputFileName}};
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
 * @param badLibrary Library of bad words to compare to.
 * @returns {{inputCount: *, libraryCount: *, rejectCount: Number, foundWords: Array, rejectedWords: Array}}    An object with information.
 */
function checkWordAvailability(inputArr, library, badLibrary) {

    var foundArr = [];          // found words array
    var notFoundArr = [];       // not found words array
    var badArr = [];

    // sort through input text.
    inputArr.forEach(function(elem, ind, arr){

        //if badword
        if(badLibrary.includes(elem)){
            badArr.push(elem);
        } else {
            // if found
            if(library.includes(elem)) {
                foundArr.push(elem)
            } else {
                // not found
                notFoundArr.push(elem);
            }
        }

    });

    // return object.
    return {
        inputCount: inputArr.length,
        libraryCount: library.length,
        foundWords: foundArr,
        notFoundWords: notFoundArr,
        badWords: badArr
    }
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

/**
 * Get the words library as a Promise, using the new utility library that stripsArrayExtensions.
 * @returns {Promise<T>|Promise}
 */
function getWordLibraryPromise(){

    return new Promise(function(resolve, reject){

        // async logic goes here.
        fs.readdir(process.cwd() + '/video_source', {encoding: 'utf8'}, function( err, files){
            if (err) {
                reject({status: 'failed', payload: {message: ' Error reading file directory. '}});
            } else {

                resolve({
                    status: 'completed',
                    payload: {fileArr: stripArrayExtensions(files.filter(junk.not))}
                });
            }
        });
    });
}



// =====================
// UTILITY FUNCTIONS ===

/**
 * Strips away the file name extensions in the array, to be used on the front-end.
 * @param dirtyArr  Raw array with extensions.
 * @returns {Array} Clean array with no extensions.
 */
function stripArrayExtensions(dirtyArr) {
    var cleanArray = [];
    dirtyArr.forEach(function(elem, ind, arr){
        cleanArray.push(elem.split('.').shift());
    });
    return cleanArray;
}