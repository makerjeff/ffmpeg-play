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

// ============================
// CONFIGURATION ==============
// ============================

var configObject = {
    libraryFolder: process.cwd() + '/video_source/',
    tempFolder: process.cwd() + '/video_temp/',
    outputFolder: process.cwd() + '/video_output/',
    outputExtension: '.mp4'
};

// ============================
// RUNTIME ====================
// ============================

// NOT FOR MODULES

// ============================
// EXPORT METHODS =============
// ============================
module.exports.generateVideo = function(inputStr) {
    var fileHash = shortid.generate();
    var inputString = inputStr.toLowerCase();
    var inputArray = inputString.split(' ');
    var filelistString = '';

    inputArray.forEach(function(elem,ind,arr){
        filelistString = filelistString + "file '" + elem + ".mp4'\n";
    });
};


module.exports.getLocalDirectory = function(){
    console.log(process.cwd());
    return process.cwd();
};

module.exports.getAllDirectories = function() {
    return configObject;
};

module.exports.getAvailableVideosSync = function() {
    return ['dummy', 'file', 'data', 'to', 'be', 'replaced', 'by', 'fileread'];
};
// ============================
// INTERNAL FUNCTIONS =========
// ============================

function concatVideoFile(relFilePath, outputFileName) {

}

function getFileName(inputStr) {
    var inputArray = inputString.toLowerCase().split(' ');
    return inputArray.join('_') + '.mp4';
}



