const User = require('../models/user.model');

const getMyProfile = async (req, res) => {
  try {
    res.status(200).json(req.user);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateMyProfile = async (req, res) => {
  try {
    
    const allowedFields = ['name', 'bio', 'skills', 'courses', 'cohort', 'profilePhoto', 'linkedIn'];
    const updates = {};

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(updatedUser);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
   
    const users = await User.find().select('name bio skills cohort profilePhoto');
    res.status(200).json(users);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    
    const user = await User.findById(req.params.id).select('name bio skills cohort profilePhoto');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getMyProfile, updateMyProfile, getAllUsers, getUserById };