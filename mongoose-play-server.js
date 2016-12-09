/** HBS PROMISE VIDEO SERVER
 * Created by jefferson.wu on 12/6/16.
 * Updated on 12/7/16.
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

const mongoose      = require('mongoose');

const junk          = require('junk');

// =========== CONFIGURATION ===========

// --- handlebars ---
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// --- mongo + mongoose ---
var Word = require('./models/words-log-db');


mongoose.connect('mongodb://localhost/mongoose-play');

mongoose.connection.on('error', function(err){
    console.error('connection error: ' + err); //catch the mongo connect error
});

mongoose.connection.on('connected', function(){
    console.log('Database connected.');
});

mongoose.connection.on('disconnected', function(){
    console.log('Database connection disconnected.');
});



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
    res.render('mongoose-play');
});



app.post('/submitword', function(req, res){
    res.json({status: 'debug', payload: {message: 'This is working. '}});
});

app.post('/checkword', function(req, res){
    var wordToCheck = req.body.datum;
    console.log('word to check: ' + wordToCheck);
    res.json({status:'checked', payload: {message:'SERVER: Word submitted: ' + wordToCheck}});
});


app.post('/addword', function(req, res){
    //TODO: submit word here

    new Word({
        word: req.body.datum,
        counts: 1
    }).save();

    console.log('word added. ');
    res.json({status: 'word added', payload: {message:'DEBUG: new word added to the library.'}});


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
        console.log(chalk.green('Mongoose-play-server started on port ' + port));
    }
});


// =================================
// internal functions ==============
// =================================
