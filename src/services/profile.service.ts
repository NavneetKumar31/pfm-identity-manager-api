import { User } from "../models/user.model";
import { UpdateProfileInput } from "../validators/profile.validator";
import bcrypt from "bcryptjs";

export class ProfileService {
  // Get profile (exclude sensitive fields)
  static async getProfile(userId: string) {
    const user = await User.findById(userId)
      .select("-password -refreshToken -_logs -__v")
      .lean();

    if (!user) throw new Error("User not found");
    return user;
  }

  // Update profile
  static async updateProfile(userId: string, input: UpdateProfileInput) {
    const updates: Partial<typeof input> = { ...input };

    // Hash password if updated
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const user = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    }).select("-password -refreshToken -_logs -__v");

    if (!user) throw new Error("User not found");
    return user;
  }
}
