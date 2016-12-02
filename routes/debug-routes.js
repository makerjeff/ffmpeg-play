/**
 * Created by jefferson.wu on 11/30/16.
 */

const express       = require('express');
const bodyParser    = require('body-parser');

var debugRouter = express.Router();

// ---- first manual test log route ----
// post data to the same page getter route.
debugRouter.post('/logger', function(req,res){
    db.writeData(req.body.datum);
    res.json({status: 'completed', data: 'data you posted: ' + req.body.datum});
});

// dummy facebook login data
debugRouter.get('/facebook', function(req, res){
    res.render('facebook');
});

//frontend promise play
debugRouter.get('/promises', function(req, res){
    res.render('promises');
});

// ------- experimental front-end checking ---------
debugRouter.get('/custom', function(req, res){
    res.render('customvalidity', {data: 'DEBUG: You\'re on the custom validity page.'});
});

debugRouter.get('/box2d', function(req, res){
    res.render('box2d', {data: 'Box2D experiments.'});
});

module.exports = debugRouter;