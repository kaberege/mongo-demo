import express from "express";
import type { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import { MONGO_URI, PORT } from "./utils/config.js";
import feedRoutes from "./routes/feed.js";
import authRoutes from "./routes/auth.js";
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
app.use((req: Request, res: Response, next: NextFunction) => {
  const error = new Error("Resource not found");
  (error as any).status = 404;
  next(error);
});
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  const status = error.statusCode || 500;
  const message = error.message || "An unexpected error occurred.";
  const data = error.data;

  res.status(status).json({
    message: message,
    errors: data,
  });
});

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
