import {} from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = "./public/uploads";
        if (!fs.existsSync(dir))
            fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
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
        cb(null, false);
    }
};
export const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
});
export const clearImage = (filePath) => {
    const resolvedPath = path.resolve(filePath);
    fs.unlink(resolvedPath, (err) => {
        if (err && err.code !== "ENOENT")
            console.error(`Storage Warning: File cleanup skipped at ${resolvedPath}`);
    });
};
//# sourceMappingURL=file-upload.js.map