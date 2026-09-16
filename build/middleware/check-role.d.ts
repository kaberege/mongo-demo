import type { Request, Response, NextFunction } from "express";
import type { UserRole } from "../utils/interfaces.js";
export declare const checkRole: (allowedRoles: UserRole[]) => (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=check-role.d.ts.map