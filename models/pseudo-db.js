/** Psuedo text DB methods
 * Created by jefferson.wu on 11/14/16.
 */

const fs            = require('fs');
const child_process = require('child_process');
const dataFile      = 'file-list.txt';

//Log data debug
/**
 * Log static folder names specified. (DEBUGGING).
 */
module.exports.logFileNames = function() {

    fs.readdir(process.cwd() + '/video_output/', function(err, files){
        console.log(files);
        fs.appendFile(dataFile, '>> ' + new Date() + ' :: ' + files + '\n', {encoding: 'utf8'}, function(err){
            if(err){
                console.log(Error(err));
            } else {
                console.log('File list created.');
            }
        });
    });
};


/**
 * Write passed in data to the dataFile.
 * @param dataToWrite   What data file to write to.
 */
module.exports.writeData = function(dataToWrite) {
    fs.appendFile(dataFile, '>> ' + new Date() + ':: ' + dataToWrite + '\n', function(err){
        if(err){
            console.log(Error(err));
        } else {
            console.log('Data written: ' + dataToWrite);
        }
    });
};
