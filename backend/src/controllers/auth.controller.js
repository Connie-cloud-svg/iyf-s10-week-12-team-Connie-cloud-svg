const { login } = require("../../authController");
const User = require("../models/user.model");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/generateTokens");
const jwt = require("jsonwebtoken");

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePassword = (password) => password && password.length >= 8;


const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
     
    const missing = [];
    if (!name?.trim()) missing.push({ field: "name", message: "Name is required" });
    if(!email?.trim()) missing.push({ field: "email", message: "Email is required" });
    if(!password) missing.push({ field: "password", message: "Password is required" });

    if (missing.length > 0 ) {
      return res.status(400).json({ message: missing.length === 1 ? 
        missing[0].message: "Multiple fields are missing",
        errors: missing
      });
    }

    const trimmedEmail = email.toLowerCase().trim();
    const trimmedName = name.trim();

    if (!validateEmail(trimmedEmail)) {
      return res.status(400).json({ 
        field: "email",
        message: "Please enter a valid email address e.g(yourname@gmail.com)"
      });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({ 
        field: "password",
        message: "Password must be at least 8 characters long"
      });
    }
    
    const exists = await user.findOne({ email: trimmedEmail });
    if (exists) {
      return res,status(409).json({
        message: "An account with this email already exists",
        action: "login",
        hint: "Try logging in or use the forgot password option"
      });
    }

    const user = await User.create({
      name: trimmedName,
      email: trimmedEmail,
      password
    });

    const { password: _, ...safeUser } = user.toObject();

    const accesToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return res.status(201).json({
      message: "Account created succesfully",
      user: safeUser,
      token: accesToken,
      accesToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const missing = [];
    if (!email?.trim()) missing.push({ field: "email", message: "Email is required" });
    if (!password) missing.push({ field: "password", message: "Password is required" });

    if (missing.length > 0) {
      return res.status(400).json({
        message: missing.length === 1 
          ? missing[0].message 
          : "Please provide both email and password",
        errors: missing,
      });
    }

    const trimmedEmail = email.toLowerCase().trim();

    if (!validateEmail(trimmedEmail)) {
      return res.status(400).json({
        field: "email",
        message: "Please enter a valid email address",
      });
    }

    const user = await User.findOne({ email: trimmedEmail }).select("+password");
    
    
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
        hint: "Double-check your credentials or create a new account",
      });
    }

    const match = await user.comparePassword(password);
    if (!match) {
      return res.status(401).json({
        message: "Invalid email or password",
        hint: "Double-check your credentials or reset your password",
      });
    }

    const { password: __, ...safeUser } = user.toObject();
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.json({
      message: "Welcome back",
      user: safeUser,
      token: accessToken,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

const logoutUser = async (req, res) => {
  res.json({ 
    message: "Logged out successfully",
    hint: "Please remove tokens from your client storage" 
  });
};

const refreshToken = async (req, res, next) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        field: "token",
        message: "Refresh token is required",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
      return res.status(401).json({
        message: "Session expired",
        hint: "Please log in again",
      });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        message: "User no longer exists",
        hint: "This account may have been deleted",
      });
    }

    res.json({
      message: "Session refreshed",
      accessToken: generateAccessToken(user),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  refreshToken,
};