/** Psuedo text DB methods
 * Created by jefferson.wu on 11/14/16.
 */

const fs            = require('fs');
const child_process = require('child_process');
const dataFile      = 'file-list.txt';

//Log data debug
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

//Write data
module.exports.writeData = function(dataToWrite) {
    fs.appendFile(dataFile, '>> ' + new Date() + ':: ' + dataToWrite + '\n', function(err){
        if(err){
            console.log(Error(err));
        } else {
            console.log('Data written: ' + dataToWrite);
        }
    });
};
