import type { NextFunction, Request, Response } from "express";
export declare const feedResponse: (req: Request, res: Response) => void;
export declare const feedPost: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getPost: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const updatePost: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const deletePost: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=feed.d.ts.map