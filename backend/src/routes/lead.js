const express = require('express');
const {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
  bulkDelete,
  bulkCreateLeads,
} = require('../controllers/leadController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, createLead);
router.post('/bulk', authMiddleware, bulkCreateLeads);
router.get('/', authMiddleware, getLeads);
router.get('/:id', authMiddleware, getLeadById);
router.put('/:id', authMiddleware, updateLead);
router.delete('/:id', authMiddleware, deleteLead);
router.delete('/', authMiddleware, bulkDelete);

module.exports = router;
