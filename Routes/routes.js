import express, { response } from "express";
import homeRouter from "./Home/home.js";
import userRouter from "./User/user.js";

const router = express.Router();

router.use("/user", userRouter);
router.use("/home", homeRouter);
export default router;
