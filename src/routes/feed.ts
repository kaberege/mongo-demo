import express, { type Request } from "express";
import {
  getAllPosts,
  feedPost,
  getPost,
  updatePost,
  deletePost,
} from "../controllers/feed.js";
import { isAuth } from "../middleware/is-auth.js";
import { checkRole } from "../middleware/check-role.js";
import { upload } from "../utils/file-upload.js";
import { validateRequest } from "../middleware/validate-request.js";
import { body, query } from "express-validator";

const router = express.Router();

router.get(
  "/posts",
  [
    query("page").optional().isInt({ min: 1 }).toInt(),
    query("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
    query("search").optional().trim(),
  ],
  validateRequest,
  getAllPosts,
);

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
router.post(
  "/post",
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
router.put(
  "/post/:postId",
  isAuth,
  upload.single("imageURL"),
  [
    body("title").optional().trim().isLength({ min: 5 }),
    body("content").optional().trim().isLength({ min: 5 }),
  ],
  validateRequest,
  updatePost,
);

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
