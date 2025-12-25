import type { Request, Response } from "express";
export declare const feedResponse: (req: Request, res: Response) => void;
export declare const feedPost: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getPost: (req: Request, res: Response) => Promise<void>;
export declare const updatePost: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deletePost: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=feed.d.ts.map