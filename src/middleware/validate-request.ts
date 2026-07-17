import type { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import type { HttpError } from "../utils/interfaces.js";
import { clearImage } from "../utils/file-upload.js";

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    if (req.file) clearImage(req.file.path);
    const error = new Error("Input compliance processing error.") as HttpError;
    error.statusCode = 422;
    error.data = errors.array();
    return next(error);
  }
  next();
};
