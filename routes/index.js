var express = require('express');
var router = express.Router();
let indexPage = require('../controllers/index');
let {isLoggedIn} = require("../middleware/hasAuth");

/* GET home page. */
router.get('/',indexPage.home_page);
router.get('/uploadPage',isLoggedIn,indexPage.getUploadPage);
router.post('/uploadPage',isLoggedIn,indexPage.submitUploadPage);
module.exports = router;
