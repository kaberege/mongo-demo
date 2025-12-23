import express from "express";
import {
  feedResponse,
  feedPost,
  getPost,
  updatePost,
  deletePost,
} from "../controllers/feed.js";
import { isAuth } from "../middleware/is-auth.js";
import multer from "multer";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

function fileFilter(req, file, cb) {
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
