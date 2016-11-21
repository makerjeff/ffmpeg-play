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

// --- header information ---

app.use(function(req,res,next){
    res.setHeader('X-Powered-By', trumpQuotes.getTrumpQuote());
    next();
});

// --- basic logger ---
app.use(function(req,res,next){
    console.log(new Date() + ' ' + req.method + ' ' + req.url + ' ');
    next();
});

// --- post submissions ---
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


// ==================
// ROUTES ===========
// ==================

// --- imported routes ---
const dataRoutes = require('./routes/write-data');
app.use('/writedata', dataRoutes);



// TEMP ROUTES
app.get('/', function(req, res){
    res.render('index', {data: 'some data.'});
});

app.get('/logger', function(req, res){
    res.render('logger', {data: 'some data.'});
});

app.get('/player', function(req, res){
    res.render('player', {data: {message:'You\'re on the Player page, but you need to pass in a query string.'}});
});

app.get('/player/:video', function(req,res){
    
    var qArray = req.params.video.split(' ');

    res.render('player', {data: {message:'Properly formatted!', video: 'http://www.youtube.com/' + qArray.join('_') + '.mp4'}});
});

//debug current directory
app.get('/cwd', function(req,res){
    console.log(vdb.getLocalDirectory());         //return the ROOT project directory.
    res.send('Requested Data: ' + vdb.getLocalDirectory());
});

app.get('/cwdall', function(req,res){
    console.log(vdb.getAllDirectories());
    res.setHeader('Content-Type', 'application/json');
    res.send('Requested Data: \n ' + JSON.stringify(vdb.getAllDirectories()));
});
// ---- API Routes ----



// ---- Writing Data Routes ----
//NOTE: this should be sent as a post, not as a GET request.  Default browser
// URL encoding only encodes URI, not the component.  "encodeURIComponent()" is needed to escape "?".


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



