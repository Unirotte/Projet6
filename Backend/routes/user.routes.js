const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/users.controller');

router.post('/login', userCtrl.login);
router.post('/signup', userCtrl.signup); //appel la signup pour crée un nouveau compte / crée une route API 

module.exports = router;
