var express = require('express');
let router = express.Router();

const admin = require('../controllers/admin');
const {isAdmin,isLoggedIn} = require('../middleware/hasAuth');

router.get('/',isLoggedIn,isAdmin,admin.getIndex);
router.get('/registeredUsers',isLoggedIn,isAdmin,admin.getRegUsers);
router.get('/deleteUser/:id',isLoggedIn,isAdmin,admin.deleteUser);

router.get('/updateUser/:id',isLoggedIn,isAdmin,admin.getUserToUpdate);
router.post('/updateUser/:id',isLoggedIn,isAdmin,admin.updateUser);
module.exports = router;