const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const passport = require('passport');
const session = require('express-session');
const users = require('../controllers/users');

router.route('/register')
    .get(users.renderRegister)
    .post(users.register);

router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', {failureFlash: true,failureRedirect: '/login' }), users.login);
// authenticate: authenticate('google', 'local', 'twitter')
router.get('/logout', users.logout);

module.exports = router;
