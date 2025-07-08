import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import cors from 'cors'
import mongoose from 'mongoose'

import userRouter from './src/routes/userRoutes.js'
import listRouter from './src/routes/listRoutes.js'
import { isUserLoggedIn } from './src/controllers/authControllers.js'

dotenv.config({ path: "config.env" });
const app = express();
const port  = process.env.PORT;

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
app.use("/api/v1/users", userRouter);
app.use("/api/v1/lists", listRouter);

//server
app.listen(port, () => {
  console.log("listining to server...");
}).on('error',(error)=>{
  console.log("Error while starting server: ", error);
});
