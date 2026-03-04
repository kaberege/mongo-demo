import express from "express";
import { userAuth, userLogin, userUpdate, userDelete, } from "../controllers/auth.js";
import { isAuth } from "../middleware/is-auth.js";
const router = express.Router();
/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       500:
 *         description: Some server error
 */
router.post("/signup", userAuth);
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in a user and receive a JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT Token
 *                 user:
 *                   $ref: '#/components/schemas/UserResponse'
 *     404:
 *       description: User not found
 *     400:
 *       description: Invalid credentials
 */
router.post("/login", userLogin);
/**
 * @swagger
 * /auth/update:
 *   put:
 *     summary: Update current user profile
 *     tags: [Auth]
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: User not found
 */
router.put("/update", isAuth, userUpdate);
/**
 * @swagger
 * /auth/delete:
 *   delete:
 *     summary: Delete current user and their posts
 *     tags: [Auth]
 *     security:
 *       - Bearer: []
 *     responses:
 *       204:
 *         description: User deleted successfully
 *       401:
 *         description: Not authenticated
 */
router.delete("/delete", isAuth, userDelete);
export default router;
//# sourceMappingURL=auth.js.map