// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Request } from "express";

declare namespace Express {
  export interface Request {
    user?: {
      id: string;
    };
  }
}
