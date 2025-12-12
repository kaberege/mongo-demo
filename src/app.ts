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
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, DELETE, PUT, PATCH"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/feed", router);
app.use("/auth", authRoutes);

mongoose
  .connect("mongodb://127.0.0.1:27017/mongoose")
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
