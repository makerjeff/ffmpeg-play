/** Video DB Module:
 * Get File names, etc.
 * Created by jefferson.wu on 11/14/16.
 */

const chalk         = require('chalk');
const fs            = require('fs');
const child_process = require('child_process');
const dataFile      = 'file-list.txt';

//TODO: dummy video array to be replaced by folder scanner.
var videosArray     = ['A.mp4', 'B.mp4', 'C.mp4', 'D.mp4', 'E.mp4', 'F.mp4', 'G.mp4', 'H.mp4', 'I.mp4'];


/**
 * Get all the video files from the source folder.
 * @param folder    The top level folder to search.
 * @returns {string[]}  Returns a String array of all the file names.
 */
module.exports.getSourceVideoNames = function(folder) {
    return videosArray;
};

