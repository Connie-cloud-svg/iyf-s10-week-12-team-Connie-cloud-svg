const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/auth.middleware');
const {
  getAllOpportunities,
  getOpportunityById,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity
} = require('../controllers/opportunity.controller');

router.get('/', protect, getAllOpportunities);
router.get('/:id', protect, getOpportunityById);
router.post('/', protect, createOpportunity);
router.put('/:id', protect, updateOpportunity);
router.delete('/:id', protect, deleteOpportunity);

module.exports = router;