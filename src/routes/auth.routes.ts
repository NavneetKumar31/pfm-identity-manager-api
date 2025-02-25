import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { validate } from "../middlewares/validate.middleware";
import {
  signupSchema,
  loginSchema,
  refreshTokenSchema,
  logoutSchema,
} from "../validators/auth.validator";
import {
  authLimiter,
  loginLimiter,
} from "../middlewares/rateLimiter.middleware";

const router = Router();

// Signup route
router.post(
  "/signup",
  authLimiter,
  validate(signupSchema),
  AuthController.signup
);

// Login route
router.post(
  "/login",
  loginLimiter,
  validate(loginSchema),
  AuthController.login
);

// refresh token route
router.post(
  "/refresh",
  authLimiter,
  validate(refreshTokenSchema),
  AuthController.refreshToken
);

// logout route
router.post(
  "/logout",
  authLimiter,
  validate(logoutSchema),
  AuthController.logout
);

export default router;
