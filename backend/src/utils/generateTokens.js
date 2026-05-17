const jwt = require("jsonwebtoken");

const TOKEN_CONFIG = {
  access: {
    secret: process.env.JWT_ACCESS_SECRET,
    expiresIn: process.env.JWT_ACCESS_EXPIRES || "15m",
    maxAge: 15 * 60 * 1000, // 15 minutes in ms
  },
  refresh: {
    secret: process.env.JWT_REFRESH_SECRET,
    expiresIn: process.env.JWT_REFRESH_EXPIRES || "7d",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
  },
};

const verifyEnv = () => {
  if (!process.env.JWT_ACCESS_SECRET) {
    throw new Error("JWT_ACCESS_SECRET is not defined in environment variables");
  }
  if (!process.env.JWT_REFRESH_SECRET) {
    throw new Error("JWT_REFRESH_SECRET is not defined in environment variables");
  }
};

const generateAccessToken = (user) => {
  verifyEnv();
  return jwt.sign(
    { 
      id: user._id.toString(), 
      role: user.role,
      type: "access",
    },
    TOKEN_CONFIG.access.secret,
    { 
      expiresIn: TOKEN_CONFIG.access.expiresIn,
      issuer: process.env.JWT_ISSUER || "your-app",
      audience: process.env.JWT_AUDIENCE || "your-app-users",
    }
  );
};

const generateRefreshToken = (user) => {
  verifyEnv();
  return jwt.sign(
    { 
      id: user._id.toString(),
      type: "refresh",
      tokenVersion: user.tokenVersion || 0, // For token invalidation
    },
    TOKEN_CONFIG.refresh.secret,
    { 
      expiresIn: TOKEN_CONFIG.refresh.expiresIn,
      issuer: process.env.JWT_ISSUER || "your-app",
      audience: process.env.JWT_AUDIENCE || "your-app-users",
    }
  );
};

const verifyAccessToken = (token) => {
  verifyEnv();
  return jwt.verify(token, TOKEN_CONFIG.access.secret, {
    issuer: process.env.JWT_ISSUER || "your-app",
    audience: process.env.JWT_AUDIENCE || "your-app-users",
  });
};

const verifyRefreshToken = (token) => {
  verifyEnv();
  return jwt.verify(token, TOKEN_CONFIG.refresh.secret, {
    issuer: process.env.JWT_ISSUER || "your-app",
    audience: process.env.JWT_AUDIENCE || "your-app-users",
  });
};

const decodeToken = (token) => {
  return jwt.decode(token, { complete: false });
};

const getTokenExpiry = (token) => {
  const decoded = decodeToken(token);
  if (!decoded?.exp) return null;
  return new Date(decoded.exp * 1000);
};

const isTokenExpired = (token) => {
  const expiry = getTokenExpiry(token);
  if (!expiry) return true;
  return new Date() >= expiry;
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  decodeToken,
  getTokenExpiry,
  isTokenExpired,
  TOKEN_CONFIG,
};