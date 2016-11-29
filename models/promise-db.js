/**
 * Created by jefferson.wu on 11/29/16.
 */

const fs        = require('fs');
const chalk     = require('chalk');

var passwordFile = fs.readFileSync(process.cwd() + '/password.txt', {encoding:'utf8'});
var signingKey = fs.readFileSync(process.cwd() + '/signingKey.txt', {encoding: 'utf8'});


module.exports.credentials = {
    'secret':'thisisasecret',
    'password':passwordFile,
    'signingkey': signingKey
};
