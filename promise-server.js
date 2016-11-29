/**
 * Created by jefferson.wu on 11/29/16.
 */

var chalk = require('chalk');
var clear = require('clear');
var pdb = require('./models/promise-db');
var bodyParser = require('body-parser');

var express = require('express');
var app = express();

const hbsModule     = require('express-handlebars');

var http = require('http').Server(app);

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


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


clear();



var router = express.Router();

router.get('/', function(req, res){
    res.render('promises', {status: 'success', message: 'this is a message.'});
});


router.post('/', function(req,res){
    console.log(' / page requested. Awaiting promise. ');

    pdb.timedPromiseGen(1000, 3000).then(function(val){
        console.log(val);

        res.send(val);
    }).catch(function(reason){
        console.log(reason);
        res.send(reason);
    });
});

app.use('/promisegen', router );

app.use(express.static('public/'));



//start server on port 3000

http.listen(3000, function(err){
    if(err){
        console.log(err);
    } else {
        console.log(pdb.credentials);
    }
});


