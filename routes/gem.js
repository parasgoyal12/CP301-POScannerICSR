var express = require('express');
var router = express.Router();
let gemPage = require('../controllers/gem');
let {isLoggedIn} = require("../middleware/hasAuth");

router.get('/',gemPage.home);
router.get('/uploadPage',isLoggedIn,gemPage.uploadPage);
router.post('/submitGemUploadPage',isLoggedIn,gemPage.submitGemUploadPage);
router.get('/gemConfirmationPage/:id',isLoggedIn,gemPage.getGemConfirmationPage);
router.post('/gemConfirmationPage/:id',isLoggedIn,gemPage.submitGemConfirmationPage);
module.exports = router;