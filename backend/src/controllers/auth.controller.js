const User = require("../models/user.model");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/generateTokens");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
     
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide all fields" });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "User exists" });

    const user = await User.create({ name, email, password });
    const { password: _, ...safeUser } = user.toObject();

    const accessToken = generateAccessToken(user);
    res.status(201).json({
      user: safeUser,
      token: accessToken,
      accessToken,
      refreshToken: generateRefreshToken(user),
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide all fields" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const match = await user.comparePassword(password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const { password: __, ...safeUser } = user.toObject();
    const accessToken = generateAccessToken(user);

    res.json({
      user: safeUser,
      token: accessToken,
      accessToken,
      refreshToken: generateRefreshToken(user),
    });
  } catch (error) {
    next(error);
  }
};

const logoutUser = async (req, res) => {
  res.json({ message: "Logout handled on client" });
};

const refreshToken = async (req, res, next) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Refresh token required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(401).json({ message: "Invalid user" });

    res.json({
      accessToken: generateAccessToken(user),
    });
  } catch (error) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  refreshToken,
};