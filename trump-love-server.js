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
const io            = require('socket.io')(http);

// custom modules
const textSanitizer = require('./modules/textSanitizer-node');
const db            = require('./models/log-db');
const vdb           = require('./models/video-db');
const trumpQuotes   = require('./models/trumpQuotes-db');
const sdb           = require('./models/signin-db');

var serverVersion   = 'v0.0.4';
var tokenLifespan   = '1h';

var connectedClients = 0;



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

//enable socket.io
io.on('connection', function(socket){
    connectedClients++;
    console.log(chalk.blue(socket.id) + ' connected. Total: ' + connectedClients);
    io.emit('userCount', connectedClients);

    //SOCKET events here.
    socket.on('disconnect', function(){
        connectedClients--;
        console.log(chalk.red(socket.id) + ' disconnected. Total: ' + connectedClients);
        io.emit('userCount', connectedClients);
    });
});





// MIDDLEWARE

// --- enable body parser ---
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(cookieParser('cookieparserkey'));    //add in params if signed.

// --- header information ---

app.use(function(req,res,next){
    res.setHeader('X-Powered-By', trumpQuotes.getTrumpQuote() + ' ' + serverVersion);
    next();
});

// --- basic logger ---
app.use(function(req,res,next){
    console.log(new Date() + ' ' + req.method + ' ' + req.url + ' ');

    if(req.body.password) {
        console.log(' ----- Attempted password: ' + req.body.password);
    }

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
    res.cookie('lgna', 0, {signed:true});
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

//frontend promise play
app.get('/promises', function(req, res){
    res.render('promises');
});


// ==================== BASE VIDEO ROUTES =====================
// hide me soon

// GET video page
app.get('/video', function(req, res){

    //TODO: REMOVE THIS, ADD to /VM/
    jwt.verify(req.signedCookies.token, sdb.credentials.signingkey, function(err, decoded){
        if(err) {
            console.log(chalk.red(err));
            //res.render('login', {layout: 'super.handlebars'});    //redirects to login page
            res.send('Token expired! &nbsp; <b><a href="/"> LOGIN. </a></b>');
        } else {
            console.log(decoded);
            res.render('video', {status:'success', message: 'You\'re on the video page.', server: serverVersion});
        }
    });


});

// post data to /video
app.post('/video', function(req, res){
    var statusObject = vdb.generateVideoSync2(req.body.datum);
    res.json(statusObject);
});



// ============== AUTHENTICATE VIDEO MAKING ROUTES ============
var videomakerRoutes = express.Router();

// ---- default / login -----
videomakerRoutes.get('/', function(req, res){
    res.send('Hello! Welcome to the best API in Sol!');
});

// ---- video maker -----

//TODO: EXTRACT THIS AND MAKE IT GLOBAL.
videomakerRoutes.get('/data', function(req, res){

    jwt.verify(req.signedCookies.token, sdb.credentials.signingkey, function(err, decoded){
        if(err) {
            console.log(chalk.red(err));
            //res.render('login', {layout: 'super.handlebars'});    //redirects to login page
            res.send('Token expired! <a href="/">Login again </a>');
        } else {
            console.log(decoded);
            res.json({data: ['data one', 'data two', 'data three', 'data four']});
        }
    });
});

// ---- get authenticate page ----
videomakerRoutes.get('/authenticate', function(req, res){
    res.render('login', {layout: 'super.handlebars'});
});

// ---- authenticate ----
videomakerRoutes.post('/authenticate', function(req,res){
    // check credentials
    if(req.body.password == sdb.credentials.password) {

        var token = sdb.createToken(tokenLifespan);
        res.cookie('token', token, {signed:true} );
        res.json({status: 'success', message: 'password is correct!', token: token});
    } else {
        res.cookie('lgna', parseInt(req.signedCookies.lgna) + 1, {signed: true});
        res.json({status: 'fail', message: 'password is incorrect! Try again.'});
        console.log('----- Attempts made: ' + req.signedCookies.lgna);
    }
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
    res.send('404: Page not found!');
});

// 500
app.use(function(req,res,next){
    res.status(500);
    res.render('500: Server error!');
});

// ========================
// ===== START SERVER =====
// ========================

http.listen(port, function(err){
    if(err) {
        console.log(Error('Error: ' + err));
    } else {
        clear();
        console.log(chalk.green('Making America great again on port ' + port));
        console.log(chalk.black.bgYellow(' Sever version: ' + serverVersion + ' '));

        // -- TEST --
        console.log(sdb.credentials);
        console.log('Token lifespan: ' + tokenLifespan);
    }
});



// ====================
// temp functions =====
// ====================
