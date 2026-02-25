import express from "express";
import type { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import { MONGO_URI, PORT } from "./utils/config.js";
import feedRoutes from "./routers/feed.js";
import authRoutes from "./routers/auth.js";
import swagger from "./utils/swagger.js";

const app = express();

app.use(bodyParser.json()); // accept application/json
app.use("/static", express.static("public"));
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, DELETE, PUT, PATCH",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/feed", feedRoutes);
app.use("/auth", authRoutes);
app.use("/api-docs", swagger);

mongoose
  .connect(MONGO_URI)
  .then((result) => {
    console.log("Mongoose is connected!");

    app.listen(PORT, () => {
      console.log(`Express is listening to the port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("+++++++++++++++++++++++++++++++++++++++++++++++");
    console.log("error", error);
  });
