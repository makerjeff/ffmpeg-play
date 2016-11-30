/**
 * Created by jefferson.wu on 11/29/16.
 */

const fs        = require('fs');
const chalk     = require('chalk');

// var passwordFile = fs.readFileSync(process.cwd() + '/password.txt', {encoding:'utf8'});
// var signingKey = fs.readFileSync(process.cwd() + '/signingKey.txt', {encoding: 'utf8'});

var passwordFile = fs.readFile(process.cwd() + '/password.txt', {encoding: 'utf8'}, function(err, data){
    if(err){
        return 'password file not found!';
    } else {
        return data;
    }
});

var signingKey = fs.readFile(process.cwd() + '/signingkey.txt', {encoding: 'utf8'}, function(err, data){
    if(err){
        return 'signingkey file not found!';
    } else {
        return data;
    }
});


module.exports.credentials = {
    'secret':'thisisasecret',
    'password':passwordFile || 'password file not read yet.',
    'signingkey': signingKey || 'signingkey file not read yet.'
};

/**
 * Generate a Timed Promise.
 * @param range Number range.
 * @param delay Timeout delay.
 * @returns {Promise<T>|Promise}    A promise that can be fulfilled.
 */
module.exports.timedPromiseGen = function(range, delay) {
    return new Promise(function(resolve, reject){
        var num = Math.floor(Math.random() * range);

        console.log('Promise generated for ' + num + ', awaiting fulfillment.');

        setTimeout(function(){
            if(num > range/2) {
                resolve('The number ' + num + ' was greater than ' + range/2 + '. (resolved)');
            } else {
                reject('The number ' + num + ' was less than ' + range/2 + '. (rejected)');
            }
        }, delay);
    });
}
