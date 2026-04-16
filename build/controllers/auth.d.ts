import type { NextFunction, Request, Response } from "express";
export declare const userAuth: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const userLogin: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const userUpdate: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const userDelete: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=auth.d.ts.map