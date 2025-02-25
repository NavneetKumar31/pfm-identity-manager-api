import { z } from "zod";

// Signup Schema
export const signupSchema = z.object({
  fName: z
    .string()
    .min(2, "First name must have at least 2 characters")
    .max(30, "First name cannot exceed 30 characters"),
  lName: z.string().optional(),
  email: z.string().email("Invalid email format"),
  mobile: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Invalid 10-digit Indian mobile number"),
  password: z
    .string()
    .min(5, "Password must be at least 5 characters")
    .max(15, "Password cannot exceed 15 characters"),
});
export type SignupInput = z.infer<typeof signupSchema>;

// Login Schema
export const loginSchema = z.object({
  emailOrMobile: z.union([
    z.string().email(),
    z.string().regex(/^[6-9]\d{9}$/),
  ]),
  password: z
    .string()
    .min(5, "Password must be at least 5 characters")
    .max(15, "Password cannot exceed 15 characters"),
});
export type LoginInput = z.infer<typeof loginSchema>;

// Refresh token schema
export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;

// Logout schema
export const logoutSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});
export type LogoutInput = z.infer<typeof logoutSchema>;
