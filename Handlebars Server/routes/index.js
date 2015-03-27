var express = require('express');
var reports = require('../modules/Reporting/reporting');
var router = express.Router();

//require module
///Get objects from module

/* GET home page. */
router.get('/', function(req, res, next) {
//Pass to page

    res.render('index', { title: 'Test' });
});


module.exports = router;
