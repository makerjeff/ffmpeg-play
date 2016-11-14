/**
 * FFMPEG2
 * Created by jefferson.wu on 11/13/16.
 */

const chalk         = require('chalk');
const clear         = require('clear');

const express       = require('express');
var app = express();

const fs            = require('fs');
const child_process = require('child_process');
const exec          = child_process.exec;

// directory locations object
var videoData       = {
    inputPath: __dirname + '/video_source/to_process/',
    outputPath: __dirname + '/video_output/',
    options: '-filter:v "scale=w=1280:h=-1" ',
    outputExtension: '.mp4'
};

fs.readdir(process.cwd() + '/video_output/', function(err, files){
    console.log(files);

    fs.appendFile('file-list.txt', new Date() + ':: ' + files + '\n', {encoding: 'utf8'}, function(err){
        if(err){
            console.log(Error(err));
        } else {
            console.log('File list created.');
        }
    });
});


//TODO: add express route API

