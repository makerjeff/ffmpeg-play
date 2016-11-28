/**
 * Created by jefferson.wu on 11/28/16.
 */

const fs = require('fs');

var passwordFile = fs.readFileSync(process.cwd() + '/password.txt', {encoding:'utf8'});

module.exports.credentials = {
    'secret':'thisisasecret',
    'password':passwordFile
};