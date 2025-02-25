import { config } from "dotenv";
config({ path: __dirname + "/../.env" }); // Add this line
import jwt from "jsonwebtoken";

const JWT_TOKEN_SECRET = process.env.JWT_SECRET || "my-jwt-token-secret";
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || "my-refresh-token-secret";

export const generateTokens = (userId: string) => {
  const accessToken = jwt.sign({ userId }, JWT_TOKEN_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ userId }, REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
};

export const verifyToken = (
  token: string,
  isRefreshToken = false
): string | jwt.JwtPayload => {
  return jwt.verify(
    token,
    isRefreshToken ? REFRESH_TOKEN_SECRET : JWT_TOKEN_SECRET
  );
};
