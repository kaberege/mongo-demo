import { Request } from "express";
import { UserRole } from "../utils/interfaces.ts";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userRole?: UserRole;
    }
  }
}
