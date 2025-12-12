"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const router = require("./routers/routes");
const authRoutes = require("./routers/auth");
const app = express();
const { MONGO_USER, MONGO_PASSWORD, MONGO_HOST, MONGO_PORT, MONGO_DB, MONGO_AUTH_SOURCE, } = process.env;
app.use(bodyParser.json()); // accept application/json
app.use("/static", express.static("public"));
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT, PATCH");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});
app.use("/feed", router);
app.use("/auth", authRoutes);
const MONGO_URI = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}?authSource=${MONGO_AUTH_SOURCE}`;
mongoose
    .connect(MONGO_URI)
    .then((result) => {
    console.log("Mongoose is connected!");
    app.listen(8000, () => {
        console.log("Express is listening to the port 8000");
    });
})
    .catch((error) => {
    console.log("+++++++++++++++++++++++++++++++++++++++++++++++");
    console.log("error", error);
});
//# sourceMappingURL=app.js.map