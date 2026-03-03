import express, {} from "express";
import { feedResponse, feedPost, getPost, updatePost, deletePost, } from "../controllers/feed.js";
import { isAuth } from "../middleware/is-auth.js";
import multer, {} from "multer";
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
    if (file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/png") {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
}
const upload = multer({ storage: storage, fileFilter: fileFilter });
router.get("/data", isAuth, feedResponse);
/**
 * @swagger
 * /feed/posts:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               imageURL:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 */
router.post("/posts", isAuth, upload.single("imageURL"), feedPost);
/**
 * @swagger
 * /feed/posts/{postId}:
 *   get:
 *     summary: Get a specific post
 *     tags: [Posts]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: Post ID
 *     responses:
 *       200:
 *        description: Post found
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Post'
 */
router.get("/posts/:postId", isAuth, getPost);
/**
 * @swagger
 * /feed/posts/{postId}:
 *   put:
 *     summary: Update an existing post
 *     tags: [Posts]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: The unique ID of the post to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated Title"
 *               content:
 *                 type: string
 *                 example: "Updated content for my post"
 *               imageURL:
 *                 type: string
 *                 format: binary
 *                 description: New image file to upload (optional)
 *     responses:
 *       200:
 *         description: Post updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       403:
 *         description: Not authorized to edit this post
 *       404:
 *         description: Post not found
 */
router.put("/posts/:postId", isAuth, upload.single("imageURL"), updatePost);
/**
 * @swagger
 * /feed/posts/{postId}:
 *   delete:
 *     summary: Delete a post
 *     tags: [Posts]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         description: ID of the post to delete
 *         required: true
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Deleted post."
 *       403:
 *         description: Not authorized to delete this post
 *       404:
 *         description: Post not found
 */
router.delete("/posts/:postId", isAuth, deletePost);
export default router;
//# sourceMappingURL=feed.js.map