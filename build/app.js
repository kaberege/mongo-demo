"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const router = require("./routers/routes");
const authRoutes = require("./routers/auth");
const app = express();
app.use(bodyParser.json()); // application/json
app.use("/static", express.static("public"));
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT, PATCH");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});
app.use("/feed", router);
app.use("/auth", authRoutes);
mongoose
    .connect("mongodb://localhost:27017")
    .then((result) => {
    console.log("Mongooese is connected!");
    app.listen(8000, () => {
        console.log("I am listening to the port 8000");
    });
})
    .catch((error) => {
    console.log("+++++++++++++++++++++++++++++++++++++++++++++++");
    console.log("error", error);
});
//# sourceMappingURL=app.js.map