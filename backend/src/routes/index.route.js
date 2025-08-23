
const express = require('express');
const authRoutes = require('./auth');
const userRoutes = require('./user');
const leadRoutes = require('./lead');

const router = express.Router();


router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/lead', leadRoutes);

router.get('/test', (req, res) => {
	res.send('Welcome to the API');
});

router.use((req, res) => {
	res.status(404).json({ message: 'Route not found' });
});

module.exports = router;
