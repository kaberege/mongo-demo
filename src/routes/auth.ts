import express from "express";
import {
  userAuth,
  userLogin,
  userUpdate,
  userDelete,
} from "../controllers/auth.js";
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
router.post("/login", userLogin);
router.put("/update", isAuth, userUpdate);
router.delete("/delete", isAuth, userDelete);

export default router;
