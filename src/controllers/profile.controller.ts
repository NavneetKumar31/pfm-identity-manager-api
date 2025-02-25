import { Response } from "express";
import { ProfileService } from "../services/profile.service";
import { updateProfileSchema } from "../validators/profile.validator";
import logger from "../utils/logger";

export class ProfileController {
  // Get user profile
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async getProfile(req: any, res: Response) {
    try {
      const userId = req.user?.id || ""; // From auth middleware
      const user = await ProfileService.getProfile(userId);

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      logger.error("Get profile error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch profile",
      });
    }
  }

  // Update user profile
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async updateProfile(req: any, res: Response) {
    try {
      const userId = req.user?.id || "";
      const validatedData = updateProfileSchema.parse(req.body);
      const updatedUser = await ProfileService.updateProfile(
        userId,
        validatedData
      );

      res.status(200).json({
        success: true,
        data: updatedUser,
      });
    } catch (error) {
      logger.error("Update profile error:", error);
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : "Update failed",
      });
    }
  }
}
