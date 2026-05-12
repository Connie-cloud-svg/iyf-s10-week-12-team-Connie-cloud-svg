const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/auth.middleware');
const {
  getMyProfile,
  updateMyProfile,
  getAllUsers,
  getUserById
} = require('../controllers/userController');

// GET /api/users - Get all users (alumni directory)
router.get('/', protect, getAllUsers);

// GET /api/users/me - Get current user's full profile
router.get('/me', protect, getMyProfile);

// PUT /api/users/me - Update current user's profile
router.put('/me', protect, updateMyProfile);

// GET /api/users/:id - Get specific user's public profile
router.get('/:id', protect, getUserById);

module.exports = router;