/**
 * Experimenting with the Clusters
 * Created by jefferson.wu on 11/15/16.
 */

var os              = require('os');
var cluster         = require('cluster');
var chalk           = require('chalk');
var clear           = require('clear');



var express = require('express');
var app = express();

app.get('/', function(req,res){
    res.send('Hello from solo worker');
    console.log(chalk.yellow('>> ' + new Date()) + ': Request made.');
});

//start server
app.listen(3000, function(){
    console.log('Server running!');
});


