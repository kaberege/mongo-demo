import type { Request, Response } from "express";
export declare const userAuth: (req: Request, res: Response) => Promise<void>;
export declare const userLogin: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const userUpdate: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const userDelete: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=auth.d.ts.map