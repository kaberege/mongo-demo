"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
const userAuth = require("../controllers/auth");
const isAuth = require("../middleware/is-auth");
router.post("/signup", userAuth.userAuth);
router.post("/login", userAuth.userLogin);
router.put("/update", isAuth, userAuth.userUpdate);
router.delete("/delete", isAuth, userAuth.userDelete);
module.exports = router;
//# sourceMappingURL=auth.js.map