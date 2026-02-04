import type { Request, Response } from "express";
interface CustomRequest extends Request {
    userId?: string;
}
export declare const feedResponse: (req: Request, res: Response) => void;
export declare const feedPost: (req: CustomRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getPost: (req: Request, res: Response) => Promise<void>;
export declare const updatePost: (req: CustomRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deletePost: (req: CustomRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export {};
//# sourceMappingURL=feed.d.ts.map