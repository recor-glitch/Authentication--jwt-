import express from "express";
import { verify_token } from "../../Middleware/Auth/token_validation.js";
import { userVerification } from "../../Middleware/Auth/user_varification.js";

const homeRouter = express.Router();

homeRouter.get("/", verify_token, userVerification, (req, res) => {
  return res.json({
    name: req.user.name,
    email: req.user.email,
    access_token: req.headers.authorization.split(" ")[1],
    data: {
      desc: "This is demo data.",
    },
  });
});

export default homeRouter;
