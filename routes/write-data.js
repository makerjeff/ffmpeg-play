/**
 * Created by jefferson.wu on 11/14/16.
 */

//write-data routes.  Expose the routes

var express = require('express');
var router  = express.Router();
var db      = require('../models/log-db');

// ====== DATA ROUTES ======
router.get('/debug', function(req,res){
    console.log('write something route correctly working.');
    res.send('Write something route correctly working.');
});

router.get('/:data', function(req,res) {
    db.writeData(req.params.data);
    res.send('Data written: ' + req.params.data);
});

// ====== EXPORT TO WORLD ======
module.exports = router;