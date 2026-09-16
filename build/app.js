import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import path from "path";
import helmet from "helmet";
import cors from "cors";
import { MONGO_URI, PORT } from "./utils/config.js";
import userRoutes from "./routes/user.js";
import feedRoutes from "./routes/post.js";
const app = express();
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "PATCH", "DELETE"] }));
app.use(bodyParser.json());
app.use("/public", express.static(path.resolve("public")));
// Route Handling Registrations
app.use("/users", userRoutes);
app.use("/post", feedRoutes);
// Unresolved Wildcard Target Handler Route Middleware
app.use((req, res, next) => {
    const error = new Error("Resource not found across endpoint routing schema.");
    error.statusCode = 404;
    next(error);
});
// Centralized Intercept Pipeline Exception Catch Engine Error Middleware Block
app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const message = error.message ||
        "An unhandled execution trace boundary breakdown triggered.";
    const logs = error.data || undefined;
    res.status(status).json({ message, validationErrors: logs });
});
// Establish Infrastructure Communication Matrix Channels
mongoose
    .connect(MONGO_URI)
    .then(() => {
    console.log("Database connectivity validated safely.");
    app.listen(PORT, () => console.log(`Application cluster core online running across node allocation trace port: ${PORT}`));
})
    .catch((err) => console.error("Critical System Interruption: Storage core execution link down.", err));
//# sourceMappingURL=app.js.map