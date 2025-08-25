
const express = require('express');

const authRoutes = require('./auth');
const userRoutes = require('./user');
const leadRoutes = require('./lead');
const { healthz } = require('../controllers/leadController');

const router = express.Router();



router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/lead', leadRoutes);

router.get('/test', (_req, res) => {
	res.send('🟢 Server is running');
});

router.get('/healthz', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

router.use((_req, res) => {
	res.status(404).json({ message: 'Route not found' });
});

module.exports = router;
