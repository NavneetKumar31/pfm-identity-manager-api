import { User } from "../models/user.model";
import { generateTokens, verifyToken } from "../utils/jwt";
import {
  SignupInput,
  LoginInput,
  RefreshTokenInput,
  LogoutInput,
} from "../validators/auth.validator";
import logger from "../utils/logger";
import bcrypt from "bcryptjs";

export class AuthService {
  static async registerUser(input: SignupInput) {
    logger.info("[Auth Service] Register User", input);
    const { email, mobile } = input;

    // Check for existing user
    const existingUser = await User.findOne({
      $or: [{ email }, { mobile }],
    });
    if (existingUser) throw new Error("User already exists");

    // Create user
    const user = await User.create(input);

    // Generate tokens
    const tokens = generateTokens(user._id.toString());
    user.refreshToken = tokens.refreshToken;
    await user.save();

    // Remove sensitive fields
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, refreshToken, ...userData } = user.toJSON();
    return { user: userData, tokens };
  }

  static async loginUser(input: LoginInput) {
    logger.info("[Auth Service] Login User", input);
    const { emailOrMobile, password } = input;

    // Find user by email/mobile
    const user = await User.findOne({
      $or: [{ email: emailOrMobile }, { mobile: emailOrMobile }],
    });
    if (!user) throw new Error("Invalid credentials");

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    // Update last login time
    user.lastLoggedInOn = new Date();
    const tokens = generateTokens(user._id.toString());
    user.refreshToken = tokens.refreshToken;
    await user.save();

    // Remove sensitive fields
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, refreshToken: __, ...userData } = user.toJSON();
    return { user: userData, tokens };
  }

  // Refresh Token
  static async refreshToken(input: RefreshTokenInput) {
    const { refreshToken } = input;

    // Verify refresh token
    const decoded = verifyToken(refreshToken, true) as { userId: string };

    // Find user by ID
    const user = await User.findById(decoded.userId);
    if (!user || user.refreshToken !== refreshToken) {
      throw new Error("Invalid or expired refresh token");
    }

    // Generate new tokens using the user's ID
    const newTokens = generateTokens(user._id.toString()); // ✅ Now `user` is defined

    // Update the user's refresh token
    user.refreshToken = newTokens.refreshToken;
    await user.save();

    return newTokens;
  }

  // Logout
  static async logoutUser(input: LogoutInput) {
    const { refreshToken } = input;

    try {
      // Verify the refresh token
      const decoded = verifyToken(refreshToken, true) as { userId: string };

      // Find user and clear refresh token if it matches
      const user = await User.findById(decoded.userId);
      if (user && user.refreshToken === refreshToken) {
        user.refreshToken = undefined;
        await user.save();
      }
    } catch (error) {
      // Token is invalid/expired - no action needed
      logger.error("[Auth Service] Logout User", error);
    }
    return { success: true };
  }
}
