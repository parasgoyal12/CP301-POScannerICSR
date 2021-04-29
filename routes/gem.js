var express = require('express');
var router = express.Router();
let gemPage = require('../controllers/gem');
let {isLoggedIn} = require("../middleware/hasAuth");

router.get('/',gemPage.home);
router.get('/uploadPage',isLoggedIn,gemPage.uploadPage);
router.post('/submitGemUploadPage',isLoggedIn,gemPage.submitGemUploadPage);
module.exports = router;