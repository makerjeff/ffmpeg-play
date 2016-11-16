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
const db            = require('./models/pseudo-db');



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
    res.setHeader('X-Powered-By', '180 Core Technologies');
    next();
});

app.use(function(req,res,next){
    console.log(req.method + ' ' + req.url + ' ' + req.hostname);
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

// TODO: get these on to an external file
app.get('/api/', function(req,res){
    res.send('API');
});

app.get('/api/:query', function(req,res){
    res.send('API: "' + req.params.query + '"');
    console.log('"' + req.params.query + '"');
});


//NOTE: this should be sent as a post, not as a GET request.  Default browser
// URL encoding only encodes URI, not the component.  "encodeURIComponent()" is needed to escape "?".
app.get('/data/writedata/:data', function(req,res){
    res.send('Writing Data: "' + req.params.data + '"');
    console.log('Writing Data: "' + req.params.data + '"');

    db.writeData(req.params.data);

});

app.get('/data/log/', function(req, res){

    db.logFileNames();

    res.send('Data inputted.');
});


// ---- data post proto ----
app.post('/post', function(req,res){
    console.log(req.body.datum);

    res.json({status: 'working', data: 'data you posted: ' + req.body.datum});

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
        console.log(chalk.green('Listening on localhost:' + port));
    }
});



