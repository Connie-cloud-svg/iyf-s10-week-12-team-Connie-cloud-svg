const User = require("../models/user.model");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/generateTokens");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: "User exists" });

  const user = await User.create({ name, email, password });

  res.status(201).json({
    user,
    accessToken: generateAccessToken(user),
    refreshToken: generateRefreshToken(user),
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const match = await user.comparePassword(password);
  if (!match) return res.status(401).json({ message: "Invalid credentials" });

  res.json({
    user,
    accessToken: generateAccessToken(user),
    refreshToken: generateRefreshToken(user),
  });
};

const logoutUser = async (req, res) => {
  res.json({ message: "Logout handled on client" });
};

const refreshToken = async (req, res) => {
  const { token } = req.body;

  const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  const user = await User.findById(decoded.id);

  if (!user) return res.status(401).json({ message: "Invalid user" });

  res.json({
    accessToken: generateAccessToken(user),
  });
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  refreshToken,
};