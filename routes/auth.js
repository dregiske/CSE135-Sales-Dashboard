const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');

router.get('/login', authController.showLogin);
router.post('/login', authController.handleLogin);

router.get('/signup', authController.showSignup);
router.post('/signup', authController.handleSignup);

router.get('/logout', authController.handleLogout);

module.exports = router;
