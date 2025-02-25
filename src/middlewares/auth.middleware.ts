import { Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import logger from "../utils/logger";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const authMiddleware: any = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  req: any,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const decoded = verifyToken(token) as { userId: string };
    req.user = { id: decoded.userId }; // Attach user to request object
    next();
  } catch (error) {
    logger.error("Auth middleware error:", error);
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};
