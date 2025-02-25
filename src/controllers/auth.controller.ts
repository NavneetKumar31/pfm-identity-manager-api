import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import {
  signupSchema,
  loginSchema,
  refreshTokenSchema,
  logoutSchema,
} from "../validators/auth.validator";
import logger from "../utils/logger";

export class AuthController {
  // Signup
  static async signup(req: Request, res: Response) {
    try {
      const validatedData = signupSchema.parse(req.body);
      const { user, tokens } = await AuthService.registerUser(validatedData);

      res.status(201).json({
        success: true,
        data: { user, tokens },
      });
    } catch (error) {
      logger.error("Signup error:", error);
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : "Signup failed",
      });
    }
  }

  // Login
  static async login(req: Request, res: Response) {
    try {
      const validatedData = loginSchema.parse(req.body);
      const { user, tokens } = await AuthService.loginUser(validatedData);

      res.status(200).json({
        success: true,
        data: { user, tokens },
      });
    } catch (error) {
      logger.error("Login error:", error);
      res.status(401).json({
        success: false,
        message: error instanceof Error ? error.message : "Login failed",
      });
    }
  }

  // Refresh Token
  static async refreshToken(req: Request, res: Response) {
    try {
      const validatedData = refreshTokenSchema.parse(req.body);
      const tokens = await AuthService.refreshToken(validatedData);

      res.status(200).json({
        success: true,
        data: tokens,
      });
    } catch (error) {
      logger.error("Refresh token error:", error);
      res.status(401).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Token refresh failed",
      });
    }
  }

  // Logout
  static async logout(req: Request, res: Response) {
    try {
      const validatedData = logoutSchema.parse(req.body);
      await AuthService.logoutUser(validatedData);

      res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error) {
      logger.error("Logout error:", error);
      res.status(200).json({
        success: true, // Always return success for security
        message: "Logged out successfully",
      });
    }
  }
}
