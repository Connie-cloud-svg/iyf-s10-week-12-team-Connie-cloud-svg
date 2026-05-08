// routes/userRoutes.js
// Owner: Cheryl — User Profile Routes

const express = require('express');
const router = express.Router();

// ── Using Samuel's work ──
// protect middleware — verifies JWT token and sets req.user
const { protect } = require('../middleware/auth.middleware');

// ── Cheryl's controllers ──
const {
  getMyProfile,
  updateMyProfile,
  getAllUsers,
  getUserById
} = require('../controllers/userController');

// ── Cheryl's routes ──
// IMPORTANT: /me routes must come BEFORE /:id
// Otherwise Express will treat the string "me" as an ID
router.get('/',     protect, getAllUsers);    // GET  /api/users
router.get('/me',   protect, getMyProfile);  // GET  /api/users/me
router.put('/me',   protect, updateMyProfile); // PUT  /api/users/me
router.get('/:id',  protect, getUserById);   // GET  /api/users/:id

module.exports = router;