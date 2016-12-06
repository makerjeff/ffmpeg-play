/** HBS PROMISE VIDEO SERVER
 * Created by jefferson.wu on 12/2/16.
 */

// =========== MODULES =============
const express       = require('express');
const app           = express();
const hbsModule     = require('express-handlebars');
const http          = require('http').Server(app);

const clear         = require('clear');
const chalk         = require('chalk');

const fs            = require('fs');
const child_process = require('child_process');

const bodyParser    = require('body-parser');
const cookieParser  = require('cookie-parser');

const port          = process.env.PORT || 3000;
const handlebars    = hbsModule.create({defaultLayout: 'main'});

// =========== CONFIGURATION ===========
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// =========== MIDDLEWARE ============

// --- enable body parser ---
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// --- silly headers ---
app.use(function(req, res, next){
    res.setHeader('X-Powered-By', 'Sugar and spice, v0.0.1');
    next();
});

// --- basic logger ---
app.use(function(req, res, next){
    console.log(new Date() + ' ' + req.method + ' ' + req.url + ' ');
    next();
});

// ============= INTERNAL ROUTES ==============

// --- default route ---
app.get('/', function(req,res){
    res.render('promisevideo');
});

// --- balloon generator route ---
app.get('/balloons', function(req, res){
    res.render('promisevideoballoons');
});

// --- get video route ---
app.get('/veedeeoh', function(req, res){

    //TODO: NOTE: Then-ing should be done at this level.
    getVideoPromise().then(function(val){
        console.log(val);
        res.json(val);

    }).catch(function(reason){
        console.log(reason);
        res.json(reason);
    });
});


// ============= CATCH-ALL MIDDLEWARE =============
// static files
app.use(express.static('public/'));

// 404
app.use(function(req, res, next){
    res.status(404);
    res.render('404');
});

// 500
app.use(function(req, res, next){
    res.status(500);
    res.render('500');
});


// =============== START SERVER ==============
http.listen(port, function(err){
    if(err){
        console.log(Error('Error: ' + err));
    } else {
        clear();
        console.log(chalk.green('Server started on port ' + port));
    }
});


// =================================
// internal functions ==============
// =================================

function getVideoPromise(){
    return new Promise(function(resolve, reject){

        setTimeout(function(){
            var number = Math.floor(Math.random() * 100);

            if (number > 50) {
                resolve({status: 'completed', payload: {videoUrl: 'a_video_file.mp4'}});
            } else {
                reject({status: 'rejected', payload: {rejectedArr: ['rejected','words', 'to', 'show']}});
            }
        }, 2000);

    });
}

function readDirPromise(){
    var decision = 0;

    return new Promise(function(resolve, reject){
        if(decision === 0) {
            resolve({status: 'completed', payload: 'a completed payload' });
        }
        else if(decision === 1) {
            reject({status: 'rejected', payload: 'rejected payload.'})
        }
    });
}