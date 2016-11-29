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
const jwt           = require('jsonwebtoken');

// custom modules
const db            = require('./models/log-db');
const vdb           = require('./models/video-db');
const trumpQuotes   = require('./models/trumpQuotes-db');
const sdb           = require('./models/signin-db');

var serverVersion   = 'v0.0.2b';



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

// --- check for token ----



// ==================
// ROUTES ===========
// ==================

// --- imported routes ---
const dataRoutes = require('./routes/write-data');
app.use('/writedata', dataRoutes);







// TEMP ROUTES
app.get('/', function(req, res){
    res.render('login', {layout: 'super.handlebars'});
});

// ---- login route ----
app.get('/login', function(req, res){
    res.render('login', {layout: 'super.handlebars'});
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

// ---- API Routes ----

// get word list
app.get('/words', function(req,res){
    var data = vdb.getAvailableVideosSync();    //TODO: SEMI-SOLVED: Currently SYNC operation, need to PROMISIFY
    //console.log(data);
    console.log('words grabbed.');
    res.header("Content-Type","text/plain");
    res.send(data);
});

// ---- first manual test log route ----
// post data to the same page getter route.
app.post('/logger', function(req,res){
    db.writeData(req.body.datum);
    res.json({status: 'completed', data: 'data you posted: ' + req.body.datum});
});

// dummy facebook login data
app.get('/facebook', function(req, res){
    res.render('facebook');
});


// ==================== BASE VIDEO ROUTES =====================
// hide me soon

// GET video page
app.get('/video', function(req, res){
    res.render('video', {status:'success', message: 'You\'re on the video page.'});
});
// post data to /video
app.post('/video', function(req, res){
    var statusObject = vdb.generateVideo(req.body.datum);
    res.json(statusObject);
});



// ============== AUTHENTICATE VIDEO MAKING ROUTES ============
var videomakerRoutes = express.Router();

// ----- ROUTE CHECKER -------
videomakerRoutes.use(function(req, res, next){
    var token = req.headers['x-access-token'];

    if(token) {
        jwt.verify(token, sdb.credentials.secret, function(err, decoded){
            if(err) {
                console.log(err);
                return res.json({status: 'failed', message:'Failed to authenticate token.'});
            } else {
                //save to req object
                req.decoded = decoded;
                console.log(decoded);
                res.render('video', {status: 'success', message:'logged in.'});

                next();
            }
        });

    } else {
        //no token? return error
        //return res.status(403).send({status: 'failed', message:'No token provided.'});
        res.render('login', {layout: 'super.handlebars'});
    }
});

// ---- default / login -----
videomakerRoutes.get('/', function(req, res){
    res.render('login', {layout: 'super.handlebars'});
});

// ---- video maker -----
videomakerRoutes.get('/video', function(req, res){
    res.render('video', {status: 'success', message: 'you\'re now at the video page.'});
});

// activate routes
app.use('/vm', videomakerRoutes);



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

        // -- TEST --
        console.log(sdb.credentials);
    }
});