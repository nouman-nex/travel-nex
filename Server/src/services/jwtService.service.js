const jwt = require("jsonwebtoken");
const { serverConfigs } = require("../config/vars");

class JwtService {
  // Generate JWT token
  static generateToken(payload, expiresIn = serverConfigs.JWT_EXPIRE) {
    if (!serverConfigs.JWT_SECRET) {
      throw new Error("JWT_SECRET is not set in config");
    }
    return jwt.sign(payload, serverConfigs.JWT_SECRET, { expiresIn });
  }

  // Verify JWT token
  static verifyToken(token) {
    if (!serverConfigs.JWT_SECRET) {
      throw new Error("JWT_SECRET is not set in config");
    }
    try {
      return jwt.verify(token, serverConfigs.JWT_SECRET);
    } catch (error) {
      throw new Error("Invalid or expired token");
    }
  }

  // Generate refresh token (optional, if needed later)
  static generateRefreshToken(payload, expiresIn = "7d") {
    if (!serverConfigs.JWT_REFRESH_SECRET) {
      throw new Error("JWT_REFRESH_SECRET is not set in config");
    }
    return jwt.sign(payload, serverConfigs.JWT_REFRESH_SECRET, { expiresIn });
  }

  // Verify refresh token (optional, if needed later)
  static verifyRefreshToken(token) {
    if (!serverConfigs.JWT_REFRESH_SECRET) {
      throw new Error("JWT_REFRESH_SECRET is not set in config");
    }
    try {
      return jwt.verify(token, serverConfigs.JWT_REFRESH_SECRET);
    } catch (error) {
      throw new Error("Invalid or expired refresh token");
    }
  }
}

module.exports = JwtService;
