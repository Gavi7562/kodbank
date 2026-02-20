const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyToken = require('../utils/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/balance', verifyToken, authController.getBalance);
router.get('/verify', verifyToken, (req, res) => {
    res.json({ message: 'Authenticated', user: req.user });
});

module.exports = router;
