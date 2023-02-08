import userModel from "../../Database/Schema/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import express from "express";
import yup from "yup";

const userRouter = express.Router();

//yup schema for validation while registration and login...
const userRegSchema = yup.object().shape({
  name: yup.string().default("example").required(),
  email: yup.string().email().notOneOf(["", null]).required(),
  password: yup.string().min(6).notOneOf(["", null]).required(),
});

userRouter.post("/register", async (request, response) => {
  const { name, email, password } = request.body;
  try {
    await userRegSchema.validate({ name, email, password });
  } catch (exception) {
    return response.json({ message: exception.message });
  }
  const user = await userModel.findOne({ email });
  if (user) {
    return response.json({ message: "User is already registered!" });
  }
  const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS));
  const hash = await bcrypt.hash(password, salt);
  const payload = { name, email };
  const access_token = jwt.sign(payload, process.env.ACCESS_SECRET, {
    expiresIn: "5m",
  });
  const refresh_token = jwt.sign(payload, process.env.REFRESH_SECRET, {
    expiresIn: "14 days",
  });
  const user1 = await userModel.create({ ...payload, password: hash });
  response.status(200).json({
    access_token,
    refresh_token,
  });
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    await userRegSchema.validate({ email, password });
  } catch (exception) {
    return res.json({ message: exception.message });
  }
  const user = await userModel.findOne({ email });
  if (!user) {
    return res.json({ message: "User is not registered!" });
  }
  if (!bcrypt.compareSync(password, user.password)) {
    return res.json({ message: "Password is incorrect." });
  }
  const access_token = jwt.sign(
    { email: user.email, name: user.name },
    process.env.ACCESS_SECRET,
    { expiresIn: "5m" }
  );
  const refresh_token = jwt.sign(
    { email: user.email, name: user.name },
    process.env.REFRESH_SECRET,
    { expiresIn: "14 days" }
  );
  return res.status(200).json({ access_token, refresh_token });
});

export default userRouter;
