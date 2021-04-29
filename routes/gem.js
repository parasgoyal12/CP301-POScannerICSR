var express = require('express');
var router = express.Router();
let gemPage = require('../controllers/gem');

router.get('/',gemPage.home);

module.exports = router;