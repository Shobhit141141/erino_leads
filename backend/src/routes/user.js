const express = require('express');
const { getAllUsers, getUserById, updateUser, deleteUser, userNameAlreadyTaken } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, getAllUsers);
router.get('/:id', authMiddleware, getUserById);
router.put('/:id', authMiddleware, updateUser);
router.delete('/:id', authMiddleware, deleteUser);
router.post('/check-username', userNameAlreadyTaken);
module.exports = router;
