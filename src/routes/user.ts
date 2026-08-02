import express from "express";
import {
  userRegister,
  userLogin,
  userUpdate,
  userDelete,
  tokenRefreshRotation,
  userLogout,
  forgotPassword,
  resetPassword,
} from "../controllers/user.js";
import { isAuth } from "../middleware/is-auth.js";
import { body } from "express-validator";
import { validateRequest } from "../middleware/validate-request.js";
import * as userController from "../controllers/user.js";
import { checkRole } from "../middleware/check-role.js";

const router = express.Router();

/**
 * @swagger
 * /auth/register:
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

router.post("/refresh", tokenRefreshRotation);
router.post("/logout", isAuth, userLogout);

router.post(
  "/forgot-password",
  [body("email").isEmail().normalizeEmail()],
  validateRequest,
  forgotPassword,
);

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

//==============================

router.get("/me", isAuth, userController.getProfile);
router.patch(
  "/me",
  isAuth,
  [
    body("email").optional().isEmail().normalizeEmail(),
    body("name").optional().trim().notEmpty(),
  ],
  validateRequest,
  userController.updateProfile,
);
router.delete("/me", isAuth, userController.deleteProfile);

// Executive Administrative Endpoint Trigger Overrides
router.patch(
  "/admin/role/:userId",
  isAuth,
  checkRole(["admin"]),
  userController.adminModifyRole,
);

export default router;
