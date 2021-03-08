var express = require('express');
var router = express.Router();
let indexPage = require('../controllers/index');
let {isLoggedIn} = require("../middleware/hasAuth");

/* GET home page. */
router.get('/',indexPage.home_page);
router.get('/uploadPage',isLoggedIn,indexPage.getUploadPage);
router.get('/confirmationPage/:id',isLoggedIn,indexPage.getConfirmationPage);
router.post('/uploadPage',isLoggedIn,indexPage.submitUploadPage);
router.post('/confirmationPage/:id',isLoggedIn,indexPage.submitConfirmationPage);
router.post('/continueLater/:id',isLoggedIn,indexPage.continueLater);
router.get('/savedPOPage',isLoggedIn,indexPage.savedPOPage);
router.get('/help',indexPage.getHelpPage);
module.exports = router;
