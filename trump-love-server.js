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
const videoDb       = require('./models/video-db');
const trumpQuotes   = require('./models/trumpQuotes-db');



// =========================
// CONFIGURATION ===========
// =========================
const port          = process.env.PORT || 3000;

// -- handlebars setup --
const handlebars    = hbsModule.create({defaultLayout: 'main'});
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

app.get('/video', function(req, res){
    res.render('video', {data: 'some data.'});
});

// ---- API Routes ----
// TODO: get these on to an external file
app.get('/api/', function(req,res){
    res.send('API');
});

app.get('/api/:query', function(req,res){
    res.send('API: "' + req.params.query + '"');
    console.log('"' + req.params.query + '"');
});


// ---- Writing Data Routes ----
//NOTE: this should be sent as a post, not as a GET request.  Default browser
// URL encoding only encodes URI, not the component.  "encodeURIComponent()" is needed to escape "?".


// get word list
app.get('/words', function(req,res){

    //var words = videoDb.getAvailableVideos();
    //TODO: figure out this error.
    res.send(words.toString());
    //console.log(words);
});


// ---- first manual test log route ----
app.post('/trump', function(req,res){

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



