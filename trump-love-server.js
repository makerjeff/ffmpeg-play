/**
 * Trump Love Server
 * Created by jefferson.wu on 11/13/16.
 */

// ========================
// MODULES ================
// ========================
const express       = require('express');
const app           = express();
const http          = require('http').Server(app);
const chalk         = require('chalk');
const clear         = require('clear');
const fs            = require('fs');
const child_process = require('child_process');
const hbsModule     = require('express-handlebars');
const bodyParser    = require('body-parser');
const cookieParser  = require('cookie-parser');

// custom modules
const db            = require('./models/log-db');
const vdb           = require('./models/video-db');
const trumpQuotes   = require('./models/trumpQuotes-db');

var serverVersion   = 'v0.0.2';



// =========================
// CONFIGURATION ===========
// =========================
const port          = process.env.PORT || 3000;

// -- handlebars setup --
const handlebars    = hbsModule.create({
    defaultLayout: 'main',
    helpers: {
        section: function(name, options) {
            if(!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        }
    }
});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// -- get user IP setup --
app.enable('trust proxy');


// MIDDLEWARE

// --- enable body parser ---
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// --- header information ---

app.use(function(req,res,next){
    res.setHeader('X-Powered-By', trumpQuotes.getTrumpQuote() + ' ' + serverVersion);
    next();
});

// --- basic logger ---
app.use(function(req,res,next){
    console.log(new Date() + ' ' + req.method + ' ' + req.url + ' ');
    next();
});




// ==================
// ROUTES ===========
// ==================

// --- imported routes ---
const dataRoutes = require('./routes/write-data');
app.use('/writedata', dataRoutes);



// TEMP ROUTES
app.get('/', function(req, res){
    res.render('video', {data: 'DEBUG: You\'re on the video page'});
});

// ------- experimental front-end checking ---------
app.get('/custom', function(req, res){
    res.render('customvalidity', {data: 'DEBUG: You\'re on the custom validity page.'});
});

app.get('/logger', function(req, res){
    res.render('logger', {data: 'some data.'});
});

app.get('/box2d', function(req, res){
    res.render('box2d', {data: 'Box2D experiments.'});
});

//debug current directory
app.get('/cwd', function(req,res){
    console.log(vdb.getLocalDirectory());         //return the ROOT project directory.
    res.send('Requested Data: ' + vdb.getLocalDirectory());
});

//get all local routes
app.get('/cwdall', function(req,res){
    console.log(vdb.getAllDirectories());
    res.setHeader('Content-Type', 'application/json');
    res.send('Requested Data: \n ' + JSON.stringify(vdb.getAllDirectories()));
});
// ---- API Routes ----

// get word list
app.get('/words', function(req,res){
    var data = vdb.getAvailableVideosSync();    //TODO: SOLVED: promisify  Otherwise data isn't returning.
    console.log(data);
    res.header("Content-Type","text/plain");
    res.send(data);
});

// ---- first manual test log route ----
// post data to the same page getter route.
app.post('/logger', function(req,res){
    db.writeData(req.body.datum);
    res.json({status: 'completed', data: 'data you posted: ' + req.body.datum});
});

// post data to /video
app.post('/video', function(req, res){
    
    var statusObject = vdb.generateVideo(req.body.datum);
    res.json(statusObject);
});

// return a video after generating
app.get('/video/:filename', function(req, res){
    console.log("attempting to send video file to the front end.");
    res.sendFile(process.cwd() + '/video_output/' + req.params.filename);
});

app.get('/facebook', function(req, res){
    res.render('facebook');
});


// ========================
// CATCH ALL MIDDLEWARE ===
// ========================
//static files
app.use(express.static('public/'));

// 404
app.use(function(req,res,next){
    res.status(404);
    res.render('404');
});

// 500
app.use(function(req,res,next){
    res.status(500);
    res.render('500');
});


// ========================
// ===== START SERVER =====
// ========================

http.listen(3000, function(err){
    if(err) {
        console.log(Error('Error: ' + err));
    } else {
        clear();
        console.log(chalk.green('Making America great again locally on port ' + port));
    }
});