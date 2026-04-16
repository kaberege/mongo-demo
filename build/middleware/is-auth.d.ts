import type { Request, Response, NextFunction } from "express";
interface CustomRequest extends Request {
    userId?: string;
}
export declare const isAuth: (req: CustomRequest, res: Response, next: NextFunction) => void;
export {};
//# sourceMappingURL=is-auth.d.ts.map