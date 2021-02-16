var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/uploadPage', function(req, res, next) {
  console.log(req.user);
  res.render('uploadPage', { title: 'Upload Page' });
});

module.exports = router;
