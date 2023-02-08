import dotenv from "dotenv";
dotenv.config();
import express, { Router } from "express";
import connectDb from "./Database/connection.js";
import router from "./Routes/routes.js";

const app = express();
app.use(express.json());
app.use("/", router);

async function startServer() {
  await connectDb();
  app.listen(3000, () => {
    console.log("Listening to localhost//3000");
  });
}

startServer();
