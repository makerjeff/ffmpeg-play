/**
 * Experimenting with the Clusters
 * Created by jefferson.wu on 11/15/16.
 */

var os              = require('os');
var cluster         = require('cluster');
var chalk           = require('chalk');
var clear           = require('clear');

// run if we're on Master
if(cluster.isMaster){

    // count the CPUs
    var cpuCount = os.cpus().length;

    // create a worker for each CPU
    for (var i = 0; i < cpuCount; i ++) {
        cluster.fork();
    }


} else {
    // else, we're a Worker

    var express = require('express');
    var app = express();

    app.get('/', function(req,res){
        res.send('Hello from Worker ' + cluster.worker.id);
        console.log(chalk.yellow('>> ' + new Date()) + ': Request made on cluster # ' + chalk.blue(cluster.worker.id));
    });

    //start server
    app.listen(3000, function(){
        console.log('Worker %d running!', cluster.worker.id);
    });
}

