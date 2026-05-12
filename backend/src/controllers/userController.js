const User = require('../models/user.model');

// @desc    Get current user's full profile
// @route   GET /api/users/me
// @access  Private
const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update current user's profile
// @route   PUT /api/users/me
// @access  Private
const updateMyProfile = async (req, res) => {
  try {
    // Only allow these profile fields to be updated
    const allowedFields = ['name', 'bio', 'skills', 'courses', 'cohort', 'profilePhoto', 'linkedIn'];
    const updates = {};

    // Only include fields that were actually provided in req.body
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // Explicitly block email/password/role updates through this endpoint
    delete updates.email;
    delete updates.password;
    delete updates.role;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all users (public directory)
// @route   GET /api/users
// @access  Private
const getAllUsers = async (req, res) => {
  try {
    // Return only public fields — never email or password
    const users = await User.find().select('name bio skills cohort profilePhoto linkedIn');

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get user by ID (public profile)
// @route   GET /api/users/:id
// @access  Private
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('name bio skills cohort profilePhoto linkedIn');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    // Handle invalid ObjectId format
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getMyProfile,
  updateMyProfile,
  getAllUsers,
  getUserById
};