/**
 * Created by jefferson.wu on 11/17/16.
 */
const fs            = require('fs');

var dataFile = 'quotes.json';
var trumpQuotesObject = {};
var trumpQuotes   = [];


fs.readFile(__dirname + '/' + dataFile, {"encoding":"utf8"},function(err, data){
    if(err){
        console.log(Error(err));
    } else {
        trumpQuotesObject = JSON.parse(data);

        trumpQuotesObject.forEach(function(elem, ind, array){
            trumpQuotes.push(decodeURIComponent(elem.quote));
            console.log(decodeURIComponent(elem.quote));
        });
    }
});

/**
 * Get random trump quote.
 * @returns {*} A random trump quote based on text file.
 */
module.exports.getTrumpQuote = function(){
    return trumpQuotes[Math.floor(Math.random()*trumpQuotes.length)];
};

module.exports.getRandomNumber = function(){
    
};