const express = require("express");
const router = express.Router();
const userAuth = require("../controllers/auth")

router.post("/signup", userAuth.userAuth);
router.post("/login", userAuth.userLogin);

module.exports = router;