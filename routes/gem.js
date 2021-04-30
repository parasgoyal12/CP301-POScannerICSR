var express = require('express');
var router = express.Router();
let gemPage = require('../controllers/gem');
let {isLoggedIn} = require("../middleware/hasAuth");

router.get('/',gemPage.home);
router.get('/uploadPage',isLoggedIn,gemPage.uploadPage);
router.post('/submitGemUploadPage',isLoggedIn,gemPage.submitGemUploadPage);
router.get('/gemConfirmationPage/:id',isLoggedIn,gemPage.getGemConfirmationPage);
router.post('/gemConfirmationPage/:id',isLoggedIn,gemPage.submitGemConfirmationPage);
router.get('/gemSavedPOPage',isLoggedIn,gemPage.gemSavedPOPage);
router.post('/continueLater/:id',isLoggedIn,gemPage.continueLater);
router.get('/deleteSaved/:id',gemPage.deleteSaved);

module.exports = router;