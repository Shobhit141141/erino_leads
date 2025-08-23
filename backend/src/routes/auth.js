const express = require('express');
const { register, login, logout } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', authMiddleware, logout);
router.get('/me', authMiddleware, (req, res) => {
  res.json(req.user);
});
module.exports = router;
