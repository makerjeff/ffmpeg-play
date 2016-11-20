/**
 * Created by jefferson.wu on 11/20/16.
 */

const chalk = require('chalk');
const clear = require('clear');

const fs = require('fs');
const child_process = require('child_process');
const exec = child_process.exec;

var fileArray = fs.readdirSync(process.cwd() + '/video_source/to_process/');

