import { validationResult } from "express-validator";
import { clearImage } from "../utils/file-upload.js";
export const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        if (req.file)
            clearImage(req.file.path);
        const error = new Error("Input compliance processing error.");
        error.statusCode = 422;
        error.data = errors.array();
        return next(error);
    }
    next();
};
//# sourceMappingURL=validate-request.js.map