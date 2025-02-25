import { z } from "zod";

export const updateProfileSchema = z.object({
  fName: z.string().min(2).max(30).optional(),
  lName: z.string().optional(),
  mobile: z
    .string()
    .regex(/^[6-9]\d{9}$/)
    .optional(),
  password: z.string().min(5).max(15).optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
