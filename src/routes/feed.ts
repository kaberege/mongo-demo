import express, { type Request } from "express";
import {
  feedResponse,
  feedPost,
  getPost,
  updatePost,
  deletePost,
} from "../controllers/feed.js";
import { isAuth } from "../middleware/is-auth.js";
import multer, { type FileFilterCallback } from "multer";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void,
  ) {
    cb(null, "public/uploads/");
  },
  filename: function (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void,
  ) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

function fileFilter(
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) {
  if (
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
}
const upload = multer({ storage: storage, fileFilter: fileFilter });

router.get("/data", isAuth, feedResponse);
router.post("/posts", isAuth, upload.single("imageURL"), feedPost);
router.get("/posts/:postId", isAuth, getPost);
router.put("/posts/:postId", isAuth, upload.single("imageURL"), updatePost);
router.delete("/posts/:postId", isAuth, deletePost);

export default router;
