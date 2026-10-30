import express from "express";
import {
  getAllPosts,
  feedPost,
  getPost,
  updatePost,
  deletePost,
} from "../controllers/post.js";
import { isAuth } from "../middleware/is-auth.js";
import { checkRole } from "../middleware/check-role.js";
import { upload } from "../utils/file-upload.js";
import { validateRequest } from "../middleware/validate-request.js";
import { body, query } from "express-validator";

const router = express.Router();

/**
 * @swagger
 * /post/feed:
 *   get:
 *     summary: Fetch paginated posts feed with optional full-text search
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Text search query matching post title or content
 *     responses:
 *       200:
 *         description: List of posts retrieved successfully.
 *   post:
 *     summary: Create a new post with image upload
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [title, content, image]
 *             properties:
 *               title: { type: string }
 *               content: { type: string }
 *               image: { type: string, format: binary }
 *     responses:
 *       201:
 *         description: Post created successfully.
 *       422:
 *         description: Image file missing or invalid payload.
 */
router.get(
  "/feed",
  [
    query("page").optional().isInt({ min: 1 }).toInt(),
    query("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
    query("search").optional().trim(),
  ],
  validateRequest,
  getAllPosts,
);
router.post(
  "/feed",
  isAuth,
  checkRole(["admin", "editor", "user"]),
  upload.single("imageURL"),
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  validateRequest,
  feedPost,
);

/**
 * @swagger
 * /post/{postId}:
 *   get:
 *     summary: Get single post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Post found.
 *       404:
 *         description: Post not found.
 *   put:
 *     summary: Update an existing post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               content: { type: string }
 *               image: { type: string, format: binary }
 *     responses:
 *       200:
 *         description: Post updated successfully.
 *       403:
 *         description: Not authorized to modify post.
 *   delete:
 *     summary: Delete a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: Post deleted successfully.
 *       403:
 *         description: Not authorized to delete post.
 */
router.get("/:postId", getPost);
router.put(
  "/:postId",
  isAuth,
  upload.single("imageURL"),
  [
    body("title").optional().trim().isLength({ min: 5 }),
    body("content").optional().trim().isLength({ min: 5 }),
  ],
  validateRequest,
  updatePost,
);
router.delete("/:postId", isAuth, deletePost);

export default router;
