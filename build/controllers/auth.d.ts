import type { Request, Response } from "express";
interface CustomRequest extends Request {
    userId?: string;
}
export declare const userAuth: (req: Request, res: Response) => Promise<void>;
export declare const userLogin: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const userUpdate: (req: CustomRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const userDelete: (req: CustomRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export {};
//# sourceMappingURL=auth.d.ts.map