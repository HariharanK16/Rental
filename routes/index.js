const express = require('express');

const router = express.Router();

const { ensureAuthenticated } = require('../config/auth');
//Welcome Page
router.get('/',(req,res) => res.render('welcome'));

//Dashboard
router.get('/dash',ensureAuthenticated, (req,res) => 
res.render('dash', {
    name: req.user.Fname 
}));

module.exports = router;