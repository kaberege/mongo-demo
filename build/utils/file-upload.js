import {} from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";
import { unlink } from "fs/promises";
const UPLOADS_DIR = "./public/uploads";
try {
    if (!fs.existsSync(UPLOADS_DIR)) {
        fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }
}
catch (bootError) {
    console.error("CRITICAL: Failed to initialize upload directories:", bootError);
    process.exit(1); // Hard exit because the app cannot function without its upload directory
}
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOADS_DIR);
    },
    filename: (req, file, cb) => {
        cb(null, `${uuidv4()}${path.extname(file.originalname)}`);
    },
});
const fileFilter = (req, file, cb) => {
    if (["image/png", "image/jpg", "image/jpeg", "image/webp"].includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        const fileUploadError = new Error("Invalid file structure: Only PNG, JPG, JPEG, and WEBP formats are authorized.");
        cb(fileUploadError, false);
    }
};
export const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
});
export const clearImage = async (filePath) => {
    if (!filePath)
        return;
    const resolvedPath = path.resolve(filePath);
    try {
        await unlink(resolvedPath);
    }
    catch (err) {
        // Safely ignore it if ENOENT:  means the file was already deleted or doesn't exist.
        if (err.code !== "ENOENT") {
            console.error(`Storage Warning: File cleanup skipped at ${resolvedPath}`, err);
        }
    }
};
//# sourceMappingURL=file-upload.js.map