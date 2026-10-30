import express from "express";
import {
  userRegister,
  userLogin,
  tokenRefreshRotation,
  userLogout,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
  deleteProfile,
  adminModifyRole,
} from "../controllers/user.js";
import { isAuth } from "../middleware/is-auth.js";
import { body } from "express-validator";
import { validateRequest } from "../middleware/validate-request.js";
import { checkRole } from "../middleware/check-role.js";

const router = express.Router();

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
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
 *       422:
 *         description: Email already exists.
 *       500:
 *         description: Some server error
 */
router.post(
  "/register",
  [
    body("email")
      .isEmail()
      .withMessage("Invalid email address schema context.")
      .normalizeEmail(),
    body("password")
      .trim()
      .isLength({ min: 8 })
      .withMessage(
        "Password requires an 8-character floor complexity constraint.",
      ),
    body("name")
      .trim()
      .notEmpty()
      .withMessage("User structural profile identity payload name required."),
  ],
  validateRequest,
  userRegister,
);

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Log in a user and receive a JWT
 *     tags: [Users]
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
 *         description: Login successful. Sets refreshToken cookie
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
 *     401:
 *       description: Invalid authentication parameters
 */
router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Missing required email field."),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Missing required password field."),
  ],
  validateRequest,
  userLogin,
);

/**
 * @swagger
 * /user/refresh:
 *   post:
 *     summary: Refresh JWT Access Token using HTTP-Only Refresh Cookie
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Access token refreshed.
 *       401:
 *         description: Invalid or missing refresh token.
 */
router.post("/refresh", tokenRefreshRotation);

/**
 * @swagger
 * /user/logout:
 *   post:
 *     summary: Logout user and invalidate access token
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Logout successful.
 */
router.post("/logout", isAuth, userLogout);

/**
 * @swagger
 * /user/forgot-password:
 *   post:
 *     summary: Request password reset link
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email: { type: string, format: email, example: "john@example.com" }
 *     responses:
 *       200:
 *         description: Reset email dispatched if account exists.
 */
router.post(
  "/forgot-password",
  [body("email").isEmail().normalizeEmail()],
  validateRequest,
  forgotPassword,
);

/**
 * @swagger
 * /user/reset-password:
 *   post:
 *     summary: Reset password using token
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token, newPassword]
 *             properties:
 *               token: { type: string }
 *               newPassword: { type: string, format: password }
 *     responses:
 *       200:
 *         description: Password updated successfully.
 *       400:
 *         description: Invalid or expired token.
 */
router.post(
  "/reset-password",
  [
    body("token")
      .notEmpty()
      .withMessage("Verification hash string key token missing."),
    body("newPassword")
      .trim()
      .isLength({ min: 8 })
      .withMessage("Complexity violation metrics triggered."),
  ],
  validateRequest,
  resetPassword,
);

/**
 * @swagger
 * /user/profile:
 *   get:
 *     summary: Get current authenticated user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *   put:
 *     summary: Update profile information
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               status: { type: string }
 *     responses:
 *       200:
 *         description: Profile updated successfully.
 *   delete:
 *     summary: Delete user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Profile deleted.
 */
router.get("/profile", isAuth, getProfile);
router.put(
  "/profile",
  isAuth,
  [
    body("name").optional().trim().notEmpty(),
    body("status").optional().trim().notEmpty(),
  ],
  validateRequest,
  updateProfile,
);
router.delete("/profile", isAuth, deleteProfile);

/**
 * @swagger
 * /user/admin/role/:userId:
 *   patch:
 *     summary: Admin route to update user role
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [role]
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [user, editor, admin]
 *     responses:
 *       200:
 *         description: Role updated successfully.
 *       403:
 *         description: Unauthorized.
 */
router.patch(
  "/admin/role/:userId",
  isAuth,
  checkRole(["admin"]),
  [
    body("role")
      .trim()
      .notEmpty()
      .isIn(["user", "editor", "admin"])
      .withMessage("Invalid role specified"),
  ],
  validateRequest,
  adminModifyRole,
);

export default router;
