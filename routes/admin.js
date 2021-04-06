var express = require('express');
let router = express.Router();

const admin = require('../controllers/admin');
const {isAdmin,isLoggedIn} = require('../middleware/hasAuth');

router.get('/',isLoggedIn,isAdmin,admin.getIndex);

module.exports = router;