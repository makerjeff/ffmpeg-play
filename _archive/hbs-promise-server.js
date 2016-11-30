/** ======================
 *  Handlebars Promises ==
 *  ======================
 * Created by jeffersonwu on 11/26/16.
 *
 * Serves an Express/Handlebars Promise.
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
    res.setHeader('X-Powered-By', 'Sugar and spice.');
    next();
});

// --- basic logger ---
app.use(function(req, res, next){
    console.log(new Date() + ' ' + req.method + ' ' + req.url + ' ');
    next();
});

// ============= INTERNAL ROUTES ==============
app.get('/', function(req,res){
    res.render('promises');
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