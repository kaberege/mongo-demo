import type { NextFunction, Request, Response } from "express";
export declare const userRegister: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const userLogin: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const tokenRefreshRotation: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const userLogout: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const forgotPassword: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const resetPassword: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getProfile: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const updateProfile: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const deleteProfile: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const adminModifyRole: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=user.d.ts.map