import express from "express";
import {
  userAuth,
  userLogin,
  userUpdate,
  userDelete,
} from "../controllers/auth.js";
import { isAuth } from "../middleware/is-auth.js";

const router = express.Router();

router.post("/signup", userAuth);
router.post("/login", userLogin);
router.put("/update", isAuth, userUpdate);
router.delete("/delete", isAuth, userDelete);

export default router;
