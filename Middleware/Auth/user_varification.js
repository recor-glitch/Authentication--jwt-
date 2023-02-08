import jwt from "jsonwebtoken";
import userModel from "../../Database/Schema/user.js";

export async function userVerification(req, res, next) {
  try {
    const access_token = req.headers.authorization.split(" ")[1];
    const payload = jwt.verify(access_token, process.env.ACCESS_SECRET);
    const user = await userModel.findOne({ email: payload.email });
    if (!user) {
      return res.status(401).json({ message: "unauthorized" });
    }
    req.user = user;
    next();
  } catch (e) {
    res.json({ message: "unauthorized" });
  }
}
