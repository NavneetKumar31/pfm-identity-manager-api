import { Router } from "express";
import { ProfileController } from "../controllers/profile.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { updateProfileSchema } from "../validators/profile.validator";

const router = Router();

// Apply authMiddleware to all profile routes
router.use(authMiddleware);

// Get user profile (no validation needed)
router.get("/me", ProfileController.getProfile);

// Update user profile (validate input)
router.patch(
  "/me",
  validate(updateProfileSchema),
  ProfileController.updateProfile
);

export default router;
