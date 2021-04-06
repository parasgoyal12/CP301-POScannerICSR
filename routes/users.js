var express = require('express');
var router = express.Router();
var users = require('../controllers/users');

/* GET users listing. */
router.get('/login',users.getLoginPage);
router.post('/login', users.login);
router.get('/logout',users.logout);
router.get('/register',users.getRegisterPage);
router.post('/register',users.register);
module.exports = router;
