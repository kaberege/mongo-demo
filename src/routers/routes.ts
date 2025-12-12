const express = require("express");
const feedData = require("../controllers/feed");
const router = express.Router();
const isAuth = require("../middleware/is-auth");
const multer = require("multer");

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

router.get("/data", isAuth, feedData.feedResponse);
router.post("/posts", isAuth, upload.single("imageURL"), feedData.feedPost);
router.get("/posts/:postId", isAuth, feedData.getPost);
router.put(
  "/posts/:postId",
  isAuth,
  upload.single("imageURL"),
  feedData.updatePost
);
router.delete("/posts/:postId", isAuth, feedData.deletePost);

module.exports = router;
