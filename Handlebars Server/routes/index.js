var express = require('express');
var router = express.Router();

function getProfile (id) {
 return {title: "user " + id};
}

//rewuire module
///Get obejcts from module

/* GET home page. */
router.get('/', function(req, res, next) {
//Pass to page
  res.render('index', { title: 'Test' });
});
 

//Eg use get arguments from URL
router.get('/user', function(req, res, next) {
//Pass to page
  res.render('index', getProfile(req.query.id));
});



module.exports = router;
