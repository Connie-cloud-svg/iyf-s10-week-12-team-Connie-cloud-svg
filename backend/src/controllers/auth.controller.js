const User = require("../models/user.model");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../utils/generateTokens");
const { AppError } = require("../middleware/error.middleware");

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePassword = (password) => password && password.length >= 8;

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Field-level validation
    const errors = [];
    if (!name?.trim()) errors.push({ field: "name", message: "Name is required" });
    if (!email?.trim()) errors.push({ field: "email", message: "Email is required" });
    if (!password) errors.push({ field: "password", message: "Password is required" });

    if (errors.length > 0) {
      throw new AppError(
        errors.length === 1 ? errors[0].message : "Multiple fields are missing",
        400,
        errors
      );
    }

    const trimmedEmail = email.toLowerCase().trim();
    const trimmedName = name.trim();

    if (!validateEmail(trimmedEmail)) {
      throw new AppError(
        "Please enter a valid email address (e.g., yourname@gmail.com)",
        400,
        [{ field: "email", message: "Invalid email format" }]
      );
    }

    if (!validatePassword(password)) {
      throw new AppError(
        "Password must be at least 8 characters long",
        400,
        [{ field: "password", message: "Password too short" }]
      );
    }

    const exists = await User.findOne({ email: trimmedEmail });
    if (exists) {
      throw new AppError(
        "An account with this email already exists",
        409,
        [{ field: "email", message: "Email already registered" }],
        "Try logging in or use the forgot password option"
      );
    }

    const user = await User.create({
      name: trimmedName,
      email: trimmedEmail,
      password,
    });

    const { password: _, ...safeUser } = user.toObject();

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      user: safeUser,
      token: accessToken,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const errors = [];
    if (!email?.trim()) errors.push({ field: "email", message: "Email is required" });
    if (!password) errors.push({ field: "password", message: "Password is required" });

    if (errors.length > 0) {
      throw new AppError(
        errors.length === 1 ? errors[0].message : "Please provide both email and password",
        400,
        errors
      );
    }

    const trimmedEmail = email.toLowerCase().trim();

    if (!validateEmail(trimmedEmail)) {
      throw new AppError(
        "Please enter a valid email address",
        400,
        [{ field: "email", message: "Invalid email format" }]
      );
    }

    const user = await User.findOne({ email: trimmedEmail }).select("+password");

    // Unified error to prevent user enumeration
    if (!user) {
      throw new AppError(
        "Invalid email or password",
        401,
        null,
        "Double-check your credentials or create a new account"
      );
    }

    const match = await user.comparePassword(password);
    if (!match) {
      throw new AppError(
        "Invalid email or password",
        401,
        null,
        "Double-check your credentials or reset your password"
      );
    }

    const { password: __, ...safeUser } = user.toObject();
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.status(200).json({
      success: true,
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

// @desc    Logout user (client-side token removal)
// @route   POST /api/auth/logout
// @access  Private
const logoutUser = async (req, res, next) => {
  try {
    // Optional: If implementing server-side token blacklisting, add here
    // await TokenBlacklist.create({ token: req.token, expiresAt: ... });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
      hint: "Please remove tokens from your client storage",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public (requires valid refresh token)
const refreshToken = async (req, res, next) => {
  try {
    const { token } = req.body;

    if (!token) {
      throw new AppError(
        "Refresh token is required",
        400,
        [{ field: "token", message: "Token missing" }]
      );
    }

    let decoded;
    try {
      decoded = verifyRefreshToken(token);
    } catch (err) {
      throw new AppError(
        "Session expired",
        401,
        null,
        "Please log in again"
      );
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      throw new AppError(
        "User no longer exists",
        401,
        null,
        "This account may have been deleted"
      );
    }

    // Token versioning check (invalidate on password change)
    if (user.tokenVersion !== decoded.tokenVersion) {
      throw new AppError(
        "Token revoked",
        401,
        null,
        "Your session was invalidated due to a security change. Please log in again."
      );
    }

    const accessToken = generateAccessToken(user);

    res.status(200).json({
      success: true,
      message: "Session refreshed",
      accessToken,
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