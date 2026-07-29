import express from "express";
import { body } from "express-validator";
import * as userController from "../controllers/user.js";
import { isAuth } from "../middleware/is-auth.js";
import { checkRole } from "../middleware/check-role.js";
import { validateRequest } from "../middleware/validate-request.js";

const router = express.Router();

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
