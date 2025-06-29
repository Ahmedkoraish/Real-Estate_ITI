const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");

const userRouter = require("./routes/userRoutes");
const listRouter = require("./routes/listRoutes");

dotenv.config({ path: "config.env" });
const app = express();

// connect to database
const DB_LOCAL = process.env.DB_LOCAL;
mongoose
  .connect(DB_LOCAL)
  .then(() => {
    console.log("DB Connected Successfully");
  })
  .catch((err) => {
    console.log(err);
    console.log("Error while connected to DB");
  });

//general middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

//routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/list", listRouter);

//server
app.listen(8000, () => {
  console.log("listining to server...");
});
