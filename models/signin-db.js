/**
 * Created by jefferson.wu on 11/28/16.
 */

const fs        = require('fs');
const chalk     = require('chalk');
const jwt       = require('jsonwebtoken');

var passwordFile = fs.readFileSync(process.cwd() + '/password.txt', {encoding:'utf8'});
var signingKey = fs.readFileSync(process.cwd() + '/signingkey.txt', {encoding: 'utf8'});
var dataObject = {iss:'http://localhost', datum:'this is some data.'};

/**
 * Credentials Object.
 * @type {{secret: string, password, signingkey}}
 */
module.exports.credentials = {
    'secret':'thisisasecret',
    'password':passwordFile,
    'signingkey': signingKey
};

/**
 * Create a Token.
 * @param exp   Expiration duration.
 * @returns {*} The token.
 */
module.exports.createToken = function(exp){

    var secret = fs.readFileSync(process.cwd() + '/signingkey.txt');
    var dataObject = {iss:'http://localhost', datum:'this is some data.'};
    var token = jwt.sign(dataObject, secret, {expiresIn: exp});
    console.log(token);
    return token;

};